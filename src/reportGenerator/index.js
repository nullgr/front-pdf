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

function makeReportGenerator({ layoutConfig, browser, port }) {
  async function createReport(id) {
    const page = await browser.usePage();
    await page.goto(`http://localhost:${port}?&id=${id}`);
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
    const pdf = await createPdf(page, pageNumbers, layoutConfig.PAGE_CLASS);
    await browser.releasePage(page);
    return pdf;
  }

  return Object.freeze({
    createReport: id => createReport(id)
  });
}

module.exports = makeReportGenerator;
