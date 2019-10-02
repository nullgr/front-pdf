const path = require('path');

const startService = require('../src/index');

const mock = require('./mocks/mock.json');

startService({
  templates: [
    {
      name: 'template1',
      static: path.join(__dirname, './template1'),
      index: path.join(__dirname, './template1/index.html')
    }
  ],
  payloadMock: mock,
  port: 5000,
  layoutConfig: {
    PAGE_HORIZONTAL_PADDING: 42.7,
    PAGE_VERTICAL_PADDING: 42.7,
    PAGE_INNER_WIDTH: 1180,
    PAGE_INNER_HEIGHT: 1704,
    PAGE_CLASS: 'pdf-page',
    RENDERED_CHART_CLASS: 'rendered'
  },
  debugMode: true,
  headless: true
});
