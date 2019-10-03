// get UUID from URL
const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

// fetch JSON from the endpoint based on UUID
fetch(`/json?id=${id}`)
  .then(response => response.json())

  // generate a chart based on the response data
  .then(responseData => {
    chart = c3.generate({
      bindto: '#chart',
      data: responseData,
      transition: {
        duration: 0
      },

      // when the chart has finished rendering, add the renderedClass class to the chart container
      onrendered: document.getElementById('chart').classList.add('rendered')
    });
  });
