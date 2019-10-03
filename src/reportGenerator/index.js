const DEFAULT_PAGE_SCALE = 0.775;

async function createPdf({ page, pageNumbers, PAGE_CLASS, PAGE_SCALE, preferCSSPageSize } = {}) {
  for (const pageNumber of pageNumbers) {
    await page.evaluate(
      (pageNumber, PAGE_CLASS) => {
        document.querySelector(`.${PAGE_CLASS}[data-number="${pageNumber}"]`).scrollIntoView();
      },
      pageNumber,
      PAGE_CLASS
    );
    const pdf = await page.pdf({
      scale: !preferCSSPageSize ? PAGE_SCALE : undefined,
      pageNumber: pageNumber,
      totalPages: pageNumbers.length,
      preferCSSPageSize,
      format: !preferCSSPageSize ? 'A4' : undefined
    });
    return pdf;
  }
}

function makeReportGenerator({ layoutConfig, browser, port }) {
  async function createReport(template, id) {
    const page = await browser.usePage();
    await page.goto(`http://localhost:${port}/root/${template.name}?&id=${id}`);
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
    const pdf = await createPdf({
      page,
      pageNumbers,
      PAGE_CLASS: layoutConfig.PAGE_CLASS,
      PAGE_SCALE: layoutConfig.PAGE_SCALE || DEFAULT_PAGE_SCALE,
      preferCSSPageSize: template.pageConfig && template.pageConfig.preferCSSPageSize
    });
    await browser.releasePage(page);
    return pdf;
  }

  return Object.freeze({
    createReport: (...args) => createReport(...args)
  });
}

module.exports = makeReportGenerator;
