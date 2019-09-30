/**
 * Browser entity layer for creating pdf reports
 * with a browser tabs pool for optimisation
 * @author Oleksander Chernenko <ca@nullgr.com>
 */
function buildMakeBrowser({ launch, createPool, destroy, usePage, releasePage }) {
  return function makeBrowser({ layoutConfig } = {}) {
    let browserInstance;
    let poolInstance;
    return Object.freeze({
      getBrowser: () => browserInstance,
      getPool: () => poolInstance,
      launch: async ({ headless }) => {
        browserInstance = await launch({ headless, layoutConfig });
        poolInstance = await createPool({ browserInstance, layoutConfig });
      },
      destroy: async () => {
        browserInstance = await destroy();
      },
      usePage: async () => {
        const page = await usePage({ poolInstance });
        return page;
      },
      releasePage: async page => {
        await releasePage({ poolInstance, page });
      }
    });
  };
}

module.exports = buildMakeBrowser;
