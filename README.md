# NullGravity front-pdf package

## Service usage

- install node and npm
- execute `npm install`
- execute `npm run start` it will run the service (on 5000 port by default)
- execute a POST request on http://localhost:5000/createReport, send your data in body
- each page will have its unique id, like this `http://localhost:{port}?&id=${id}`
- your static assets (frontend build) should contain an ajax request with the id url parameter on `/json?id={id}`, they will recieve all the required data, that was sent in body request
- after your front-end rendering is complete, you should add a `RENDERED_CHART_CLASS` classname, so the service will now, that it can make a pdf from your page

### example

```js
const path = require('path');
const startService = require('front-pdf');

startService({
  paths: {
    static: path.join(__dirname, '/../static'),
    index: path.join(__dirname, '/../static/index.html')
  },
  port: 5000,
  layoutConfig: {
    PAGE_HORIZONTAL_PADDING: 42.7,
    PAGE_VERTICAL_PADDING: 42.7,
    PAGE_INNER_WIDTH: 1180,
    PAGE_INNER_HEIGHT: 1704,
    PAGE_CLASS: 'pdf-page',
    RENDERED_CHART_CLASS: 'analysis-chart-rendered'
  }
});
```
