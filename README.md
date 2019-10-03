# NullGravity front-pdf package

_front-pdf_ is a self-hosted service that uses front-end layouts for PDF export.
You can create pdf oriented layouts using any front-end technology that you like. Just prepare the front-end build and configure the service.

## Conventions

Your front-end build should contain wrapper with `pageClass`, each `page` should have its fixed dimentions.
You should tell the service, when your renedering process is finished for all pages by adding the `renderedClass` in the end.
We are working on improvement of this conventions in future.
This is a draft version of the package.

## Service usage

- install node and npm
- execute `npm install`
- execute `npm run start` it will run the service (on 5000 port by default)
- execute a POST request on http://localhost:{port}/createReport, send your data in body
- each page will have its unique id, like this `http://localhost:{port}?&id=${id}`
- your static assets (frontend build) should contain an ajax request with the id url parameter on `/json?id={id}`, they will recieve all the required data, that was sent in body request
- after your front-end rendering is complete, you should add a `renderedClass` classname, so the service will now, that it can make a pdf from your page

### example

```js
const path = require('path');
const startService = require('front-pdf');

// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
const browserConfig = {
  headless: true
};

startService({
  templates: [
    {
      name: 'template1',
      static: path.join(__dirname, './template1'),
      index: path.join(__dirname, './template1/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered'
      }
    },
    {
      name: 'template-css',
      static: path.join(__dirname, './template-css'),
      index: path.join(__dirname, './template-css/index.html'),
      pageConfig: {
        pageClass: 'pdf-page',
        renderedClass: 'rendered',
        preferCSSPageSize: true
      }
    }
  ],
  browserConfig,
  port: 5000,
  debugMode: true
});
```
