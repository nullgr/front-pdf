const puppeteer = require('puppeteer');
const genericPool = require('generic-pool');
const buildMakeBrowser = require('./browser');

function launch({ layoutConfig, headless = true }) {
  const { width, height } = getDimentions(layoutConfig);
  const standartOptions = {
    headless,
    handleSIGINT: false,
    args: [`--window-size=${width},${height}`]
  };
  const config =
    process.platform === 'linux'
      ? {
          ...standartOptions,
          args: [`--window-size=${width},${height}`]
        }
      : standartOptions;
  return puppeteer.launch(config);
}

async function destroy(browser) {
  await browser.close();
  console.log(' - browser closed');
}

function createPool({ layoutConfig, browserInstance }) {
  const { width, height } = getDimentions(layoutConfig);
  const pageFacrory = {
    create: async function() {
      const page = await browserInstance.newPage();
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

async function usePage({ poolInstance }) {
  return await poolInstance.acquire();
}

async function releasePage({ poolInstance, page }) {
  await poolInstance.release(page);
}

function getDimentions(config) {
  const { PAGE_HORIZONTAL_PADDING, PAGE_VERTICAL_PADDING, PAGE_INNER_WIDTH, PAGE_INNER_HEIGHT } = config;
  return {
    width: Math.ceil(PAGE_HORIZONTAL_PADDING + PAGE_INNER_WIDTH + PAGE_HORIZONTAL_PADDING),
    height: Math.ceil(PAGE_VERTICAL_PADDING + PAGE_INNER_HEIGHT + PAGE_VERTICAL_PADDING)
  };
}

const makeBrowser = buildMakeBrowser({
  launch,
  destroy,
  createPool,
  usePage,
  releasePage
});

module.exports = makeBrowser;
