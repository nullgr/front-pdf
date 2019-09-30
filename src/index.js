const express = require('express');
const slowDown = require('express-slow-down');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');

const makeBrowser = require('./browser');
const makeReportGenerator = require('./reportGenerator');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const app = express();

const speedLimiter = slowDown({
  windowMs: 10000, // 10 sec
  delayAfter: 100,
  delayMs: 380,
  maxDelayMs: 10000 // max 10 seconds delay
});

async function startService({ templates, layoutConfig, port, payloadMock, headless } = {}) {
  const requests = {};
  const browser = makeBrowser({ layoutConfig });
  await browser.launch({ headless });
  const reportGenerator = makeReportGenerator({ layoutConfig, browser, port });

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
  templates.forEach(function(template) {
    app.get(`/root/${template.name}/`, (req, res) => {
      res.sendFile(template.index);
    });
  });

  app.get('/json', function(req, res) {
    // mock the json response in development mode
    if (DEVELOPMENT && Object.keys(payloadMock).length) {
      return res.send(payloadMock);
    }

    const { id } = req.query;
    res.send(requests[id]);
  });

  // redirect to template sources
  app.get(/^\/(?!root).*/, (req, res) => {
    const url = new URL(req.header('Referer'));
    res.redirect(url.pathname + req.path);
  });

  const appPort = port || process.env.PORT || 5000;
  app.listen(appPort);

  console.log(`Reports generator listening on ${appPort}`);
}

module.exports = startService;
