const { makeBrowserPool } = require('./browser.js');

async function createPdf(page, pageNumbers, PAGE_CLASS) {
  for (const pageNumber of pageNumbers) {
    await page.evaluate(
      (pageNumber, PAGE_CLASS) => {
        document.querySelector(`.${PAGE_CLASS}[data-number="${pageNumber}"]`).scrollIntoView();
      },
      pageNumber,
      PAGE_CLASS
    );
    const pdf = await page.pdf({
      scale: 0.755,
      pageNumber: pageNumber,
      totalPages: pageNumbers.length,
      format: 'A4'
    });
    return pdf;
  }
}

class ReportCreator {
  constructor({ frontendConfig }) {
    this.browserPagePool = makeBrowserPool({ frontendConfig });
    this.frontendConfig = frontendConfig;
  }
  async createReport(id) {
    const page = await this.browserPagePool.acquire();
    await page.goto(`http://localhost:5000?&id=${id}`);
    await page.waitForSelector(`.${this.frontendConfig.PAGE_CLASS}`);
    await page.waitForSelector(`.${this.frontendConfig.RENDERED_CHART_CLASS}`);
    const pageNumbers = await page.evaluate(PAGE_CLASS => {
      let elements = document.getElementsByClassName(PAGE_CLASS);
      let pageNumbers = [];
      for (var i = 1; i <= elements.length; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }, this.frontendConfig.PAGE_CLASS);
    const pdf = await createPdf(page, pageNumbers, this.frontendConfig.PAGE_CLASS);
    await this.browserPagePool.release(page);
    return pdf;
  }
}

module.exports = ReportCreator;
