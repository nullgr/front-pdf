async function createPdf({ page, pageNumbers, pageClass, scale, preferCSSPageSize } = {}) {
  for (const pageNumber of pageNumbers) {
    await page.evaluate(
      (pageNumber, pageClass) => {
        document.querySelector(`.${pageClass}[data-number="${pageNumber}"]`).scrollIntoView();
      },
      pageNumber,
      pageClass
    );
    const pdf = await page.pdf({
      scale: !preferCSSPageSize ? scale : undefined,
      pageNumber: pageNumber,
      totalPages: pageNumbers.length,
      preferCSSPageSize,
      format: !preferCSSPageSize ? 'A4' : undefined
    });
    return pdf;
  }
}

function makeReportGenerator({ browser, port }) {
  async function createReport(template, id) {
    const page = await browser.usePage();
    const { pageClass, renderedClass, preferCSSPageSize, scale } = template.pageConfig;
    await page.goto(`http://localhost:${port}/root/${template.name}?&id=${id}`);
    await page.waitForSelector(`.${pageClass}`);
    if (renderedClass) {
      await page.waitForSelector(`.${renderedClass}`);
    }
    const pageNumbers = await page.evaluate(pageClass => {
      let elements = document.getElementsByClassName(pageClass);
      let pageNumbers = [];
      for (var i = 1; i <= elements.length; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }, pageClass);
    const pdf = await createPdf({
      page,
      pageNumbers,
      pageClass: pageClass,
      scale,
      preferCSSPageSize: preferCSSPageSize
    });
    await browser.releasePage(page);
    return pdf;
  }

  return Object.freeze({
    createReport: (...args) => createReport(...args)
  });
}

module.exports = makeReportGenerator;
