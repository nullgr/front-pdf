const express = require('express');
const slowDown = require('express-slow-down');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');

const ReportCreator = require('./ReportCreator');
const { browserInstance } = require('./browser.js');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const app = express();

const speedLimiter = slowDown({
  windowMs: 10000, // 10 sec
  delayAfter: 100,
  delayMs: 380,
  maxDelayMs: 10000 // max 10 seconds delay
});

async function startService({ paths, frontendConfig, payloadMock } = {}) {
  const requests = {};
  const reportMaker = new ReportCreator({ paths, frontendConfig });

  await browserInstance.create({ frontendConfig });

  app.use(express.static(paths.static));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/createReport', speedLimiter, async function(req, res, next) {
    try {
      const id = uuidv1();
      requests[id] = req.body;
      const buffer = await reportMaker.createReport(id);
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

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('/', (req, res) => {
    res.sendFile(paths.index);
  });

  app.get('/json', function(req, res) {
    // mock the json response in development mode
    if (DEVELOPMENT && Object.keys(payloadMock).length) {
      return res.send(payloadMock);
    }

    const { id } = req.query;
    res.send(requests[id]);
  });

  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log(`Reports generator listening on ${port}`);
}

module.exports = startService;
