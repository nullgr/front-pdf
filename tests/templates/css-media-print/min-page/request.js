const pageClass = 'pdf-page';

function buildPages(pagesCount) {
  const pages = Array(pagesCount).fill(true);
  pages.forEach((_, i) => {
    const el = document.createElement('DIV');
    el.classList.add(pageClass);
    el.setAttribute('data-number', i + 1);
    document.querySelector('body').appendChild(el);
  });
}

buildPages(5);

const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

fetch(`/json?id=${id}`)
  .then(response => response.json())
  .then(responseObj => {
    const els = document.getElementsByClassName(pageClass);
    for (el of els) {
      el.innerHTML = responseObj.test;
      el.classList.add('rendered');
    }
  });
