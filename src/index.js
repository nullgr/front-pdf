const express = require('express');
const slowDown = require('express-slow-down');
const bodyParser = require('body-parser');

const uuidv1 = require('uuid/v1');
const makeBrowser = require('./browser');
const makeReportGenerator = require('./reportGenerator');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const speedLimiter = slowDown({
  windowMs: 10000, // 10 sec
  delayAfter: 100,
  delayMs: 380,
  maxDelayMs: 10000 // max 10 seconds delay
});

async function startService({ templates, layoutConfig, port, payloadMock, headless } = {}) {
  const app = express();
  const requests = {};
  const browser = makeBrowser({ layoutConfig });
  await browser.launch({ headless });
  const reportGenerator = makeReportGenerator({ layoutConfig, browser, port });

  // serve assets for each template on /root/{template.name}/{asset} url
  templates.forEach(function(template) {
    app.use(`/root/${template.name}/`, express.static(template.static));
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/createReport/:templateId', speedLimiter, async function(req, res, next) {
    try {
      const template = req.params.templateId;
      const id = uuidv1();
      requests[id] = req.body;
      const buffer = await reportGenerator.createReport(template, id);
      res.setHeader('Content-Length', Buffer.byteLength(buffer));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
      await res.send(buffer);
      delete requests[id];
      console.log(`Report ${id} is generated!`);
    } catch (e) {
      next(e);
    }
  });

  // serve index.html for each template
  templates.forEach(function(template) {
    app.get(`/root/${template.name}/`, (req, res) => {
      res.sendFile(template.index);
    });
  });

  // a payload data servise
  app.get('/json', function(req, res) {
    // mock the json response in development mode
    if (DEVELOPMENT && Object.keys(payloadMock).length) {
      return res.send(payloadMock);
    }

    const { id } = req.query;
    res.send(requests[id]);
  });

  // redirect all asset requests to their destinations
  // /{asset} --> /root/{template.name}/{asset}
  app.get(/^\/(?!root).*/, (req, res) => {
    const url = new URL(req.header('Referer'));
    res.redirect(url.pathname + req.path);
  });

  const appPort = port || process.env.PORT || 5000;
  app.listen(appPort);

  console.log(`Reports generator listening on ${appPort}`);
}

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
  process.on(sig, () => {
    // implementation of browser closing on Ctrl + C,
    // it works even without calling browser.destroy() O_o
    // tested in headless off mode
    // TODO investigate this in future
    console.log(' - all service related apps are terminated');
    process.exit(0);
  });
});

module.exports = startService;
