// get UUID from URL
const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

// fetch JSON from the endpoint based on UUID
fetch(`/json?id=${id}`)
  .then(response => response.json())

  // generate a chart based on the response data
  .then(({ chart1, chart2, chart3 }) => {
    c3.generate({
      bindto: '#chart1',
      data: chart1,
      transition: {
        duration: 0
      }
    });

    c3.generate({
      bindto: '#chart2',
      data: chart2,
      transition: {
        duration: 0
      }
    });

    c3.generate({
      bindto: '#chart3',
      data: chart3,
      transition: {
        duration: 0
      },

      // when all the charts have finished rendering, add the .rendered class to the chart container
      onrendered: document.getElementById('container').classList.add('rendered')
    });
  });
