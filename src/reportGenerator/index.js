const DEFAULT_PAGE_SCALE = 0.775;

async function createPdf(page, pageNumbers, PAGE_CLASS, PAGE_SCALE = DEFAULT_PAGE_SCALE) {
  for (const pageNumber of pageNumbers) {
    await page.evaluate(
      (pageNumber, PAGE_CLASS) => {
        document.querySelector(`.${PAGE_CLASS}[data-number="${pageNumber}"]`).scrollIntoView();
      },
      pageNumber,
      PAGE_CLASS
    );
    const pdf = await page.pdf({
      scale: PAGE_SCALE,
      pageNumber: pageNumber,
      totalPages: pageNumbers.length,
      format: 'A4'
    });
    return pdf;
  }
}

function makeReportGenerator({ layoutConfig, browser, port }) {
  async function createReport(templateName, id) {
    const page = await browser.usePage();
    await page.goto(`http://localhost:${port}/root/${templateName}?&id=${id}`);
    await page.waitForSelector(`.${layoutConfig.PAGE_CLASS}`);
    await page.waitForSelector(`.${layoutConfig.RENDERED_CHART_CLASS}`);
    const pageNumbers = await page.evaluate(PAGE_CLASS => {
      let elements = document.getElementsByClassName(PAGE_CLASS);
      let pageNumbers = [];
      for (var i = 1; i <= elements.length; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }, layoutConfig.PAGE_CLASS);
    const pdf = await createPdf(page, pageNumbers, layoutConfig.PAGE_CLASS, layoutConfig.PAGE_SCALE);
    await browser.releasePage(page);
    return pdf;
  }

  return Object.freeze({
    createReport: (...args) => createReport(...args)
  });
}

module.exports = makeReportGenerator;
