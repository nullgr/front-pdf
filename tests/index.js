const path = require('path');

const startService = require('../src/index');

const mock = require('./mocks/mock.json');

startService({
  templates: [
    {
      name: 'template1',
      static: path.join(__dirname, './template1'),
      index: path.join(__dirname, './template1/index.html'),
      pageConfig: {
        PAGE_CLASS: 'pdf-page',
        RENDERED_CHART_CLASS: 'rendered',
        preferCSSPageSize: true
      }
    },
    {
      name: 'template-css',
      static: path.join(__dirname, './template-css'),
      index: path.join(__dirname, './template-css/index.html'),
      pageConfig: {
        PAGE_CLASS: 'pdf-page',
        RENDERED_CHART_CLASS: 'rendered',
        preferCSSPageSize: true
      }
    }
  ],
  payloadMock: mock,
  port: 5000,
  debugMode: true,
  headless: true
});
