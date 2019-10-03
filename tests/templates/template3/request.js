const el = document.createElement('DIV');
el.classList.add('pdf-page');
el.setAttribute('data-number', 1);
document.querySelector('body').appendChild(el);

const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

fetch(`/json?id=${id}`)
  .then(response => response.json())
  .then(responseObj => {
    el.innerHTML = responseObj.test;
    el.classList.add('rendered');
  });
