const path = require('path');

const startService = require('../src/index');

const mock = require('./mocks/mock.json');

startService({
  templates: [
    {
      name: 'template1',
      static: path.join(__dirname, './templates/template1'),
      index: path.join(__dirname, './templates/template1/index.html')
    },
    {
      name: 'template2',
      static: path.join(__dirname, './templates/template2'),
      index: path.join(__dirname, './templates/template2/index.html')
    },
    {
      name: 'template3',
      static: path.join(__dirname, './templates/template3'),
      index: path.join(__dirname, './templates/template3/index.html')
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
  headless: true
});
