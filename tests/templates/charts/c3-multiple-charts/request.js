// get UUID from URL
const searchParams = new URLSearchParams(location.search);
const id = decodeURI(searchParams.get('id'));

// fetch JSON from the endpoint based on UUID
fetch(`/json?id=${id}`)
  .then(response => response.json())

  // generate charts based on the response data
  .then(({ chart1, chart2, chart3 }) => {
    c3.generate({
      bindto: '#chart1',
      data: chart1,
      transition: {
        duration: 0
      },

      //after each chart is rendered add renderedClass class to it's container
      onrendered: document.getElementById('chart1').classList.add('rendered')
    });

    c3.generate({
      bindto: '#chart2',
      data: chart2,
      transition: {
        duration: 0
      },
      onrendered: document.getElementById('chart2').classList.add('rendered')
    });

    c3.generate({
      bindto: '#chart3',
      data: chart3,
      transition: {
        duration: 0
      },
      onrendered: document.getElementById('chart3').classList.add('rendered')
    });
  });
