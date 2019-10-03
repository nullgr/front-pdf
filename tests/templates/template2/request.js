// get UUID from URL
const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

// get the DOM node to bind chart to
const container = document.getElementById('chart');

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

      // when the chart has finished rendering, add the .rendered class to the chart container
      onrendered: container.classList.add('rendered')
    });
  });
