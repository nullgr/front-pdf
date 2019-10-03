const http = require('http');
const express = require('express');
const slowDown = require('express-slow-down');
const bodyParser = require('body-parser');
const { createTerminus } = require('@godaddy/terminus');
var shortid = require('shortid');

const makeBrowser = require('./browser');
const makeReportGenerator = require('./reportGenerator');
const { startTimeLog } = require('./utils');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

let server;
let browser;

const speedLimiter = slowDown({
  windowMs: 10000, // 10 sec
  delayAfter: 100,
  delayMs: 380,
  maxDelayMs: 10000 // max 10 seconds delay
});

async function startService({ templates, browserConfig, port, payloadMock, headless, debugMode } = {}) {
  const app = express();
  const requests = {};
  browser = makeBrowser({ browserConfig });
  await browser.launch({ headless });
  const reportGenerator = makeReportGenerator({ browserConfig, browser, port });

  // serve assets for each template on /root/{template.name}/{asset} url
  templates.forEach(function(template) {
    app.use(`/root/${template.name}/`, express.static(template.static));
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/createReport/:templateId', speedLimiter, async function(req, res, next) {
    try {
      const templateName = req.params.templateId;
      const template = templates.find(t => t.name === templateName);
      if (!template) {
        throw new Error(`Template '${templateName}' does not exist!`);
      }
      const id = shortid.generate();
      let endTimeLog;
      if (debugMode) {
        endTimeLog = startTimeLog(id);
      }
      requests[id] = req.body;
      const buffer = await reportGenerator.createReport(template, id);
      res.setHeader('Content-Length', Buffer.byteLength(buffer));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
      await res.send(buffer);
      delete requests[id];
      debugMode && endTimeLog();
    } catch (e) {
      console.error('\x1b[31m');
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

  server = http.createServer(app);

  function onShutDown() {
    return Promise.all([browser.destroy()]);
  }

  // gracefull shutdown
  // https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
  createTerminus(server, {
    signal: 'SIGINT', // shutDown signal
    timeout: 1000,
    onSignal: onShutDown
  });

  server.listen(appPort);
  console.log(`Reports generator listening on ${appPort}`);
}

module.exports = startService;
