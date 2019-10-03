const puppeteer = require('puppeteer');
const genericPool = require('generic-pool');
const buildMakeBrowser = require('./browser');

function launch({ browserConfig }) {
  return puppeteer.launch({
    ...browserConfig,
    handleSIGINT: false // force to disable handleSIGINT
  });
}

async function destroy(browser) {
  await browser.close();
  console.log(' - browser closed');
}

function createPool({ firstPageViewport, browserInstance }) {
  const pageFacrory = {
    create: async function() {
      const page = await browserInstance.newPage();
      if (firstPageViewport) {
        page.setViewport({
          width: width,
          height: height
        });
      }
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

const makeBrowser = buildMakeBrowser({
  launch,
  destroy,
  createPool,
  usePage,
  releasePage
});

module.exports = makeBrowser;
