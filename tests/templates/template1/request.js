// get UUID from URL
const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

// get the DOM node to fill with data
const content = document.getElementById('content');

// fetch JSON from the endpoint based on UUID
fetch(`/json?id=${id}`)
  .then(response => response.json())
  .then(responseData => {
    content.innerHTML = responseData.message;
    content.classList.add('rendered');
  });
