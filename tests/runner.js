const path = require('path');

const startService = require('../src/index');

const mock = require('./mocks/mock.json');

const standartOptions = {
  headless: true
};
const browserConfig =
  process.platform === 'linux'
    ? {
        ...standartOptions,
        executablePath: '/usr/bin/chromium-browser',
        args: [`--no-sandbox`, `--headless`, `--disable-gpu`, `--disable-dev-shm-usage`]
      }
    : standartOptions;

startService({
  templates: [
    {
      name: 'c3-chart',
      static: path.join(__dirname, './templates/charts/c3-chart'),
      index: path.join(__dirname, './templates/charts/c3-chart/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered'
      }
    },
    {
      name: 'c3-multiple-charts',
      static: path.join(__dirname, './templates/charts/c3-multiple-charts'),
      index: path.join(__dirname, './templates/charts/c3-multiple-charts/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered'
      }
    },
    {
      name: 'min-page',
      static: path.join(__dirname, './templates/css-media-print/min-page'),
      index: path.join(__dirname, './templates/css-media-print/min-page/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered'
      }
    }
  ],
  browserConfig,
  payloadMock: mock,
  port: 5000,
  debugMode: true
});
