const genericPool = require('generic-pool');
const puppeteer = require('puppeteer');

function getDimentions(config) {
  const { PAGE_HORIZONTAL_PADDING, PAGE_VERTICAL_PADDING, PAGE_INNER_WIDTH, PAGE_INNER_HEIGHT } = config;
  return {
    width: Math.ceil(PAGE_HORIZONTAL_PADDING + PAGE_INNER_WIDTH + PAGE_HORIZONTAL_PADDING),
    height: Math.ceil(PAGE_VERTICAL_PADDING + PAGE_INNER_HEIGHT + PAGE_VERTICAL_PADDING)
  };
}

const browserInstance = {
  browser: undefined,

  create: async function({ frontendConfig }) {
    const { width, height } = getDimentions(frontendConfig);
    this.browser = await puppeteer.launch(
      process.platform === 'linux'
        ? {
            executablePath: '/usr/bin/chromium-browser',
            args: [`--window-size=${width},${height}`]
          }
        : {
            args: [`--window-size=${width},${height}`]
          }
    );
  },
  destroy: async function() {
    this.browser = await puppeteer.close();
  }
};

function makeBrowserPool({ frontendConfig }) {
  const { width, height } = getDimentions(frontendConfig);
  const pageFacrory = {
    create: async function() {
      const page = await browserInstance.browser.newPage();
      page.setViewport({
        width: width,
        height: height
      });
      return page;
    },
    destroy: function(page) {
      page.close();
    }
  };

  return genericPool.createPool(pageFacrory, {
    max: 20,
    min: 2,
    evictionRunIntervalMillis: 1000,
    maxWaitingClients: 500
  });
}

module.exports = {
  browserInstance,
  makeBrowserPool
};
