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
      name: 'template1',
      static: path.join(__dirname, './template1'),
      index: path.join(__dirname, './template1/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered'
      }
    },
    {
      name: 'template-css',
      static: path.join(__dirname, './template-css'),
      index: path.join(__dirname, './template-css/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered',
        preferCSSPageSize: true
      }
    }
  ],
  browserConfig,
  payloadMock: mock,
  port: 5000,
  debugMode: true
});
