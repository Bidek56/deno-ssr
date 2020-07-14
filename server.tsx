// Importing Modules
import {
    Application,
    Router,
    send,
    React,
    ReactDOMServer
  } from "./src/deps.ts";

import NavBar from './src/NavBar.tsx'

const server = new Application();
const router = new Router();

// Adding a route for js code to use i the browser
const browserBundlePath = "/browser.js";

// js for client side React - the React components are stored as client side consts
const js =
  `import React from "https://cdn.pika.dev/react@16.13.1";
   import ReactDOM from "https://cdn.pika.dev/react-dom@16.13.1/server.js";

   const NavBar = ${NavBar}
   ReactDOM.hydrate(React.createElement(App), document.getElementById('react-app'));`;

// the js code is loaded from a script tag
const html =
  `<html>
    <head> 
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" data-react-helmet="true">
      <link rel="stylesheet" href="/static/style.css" />
      <title>Deneact O.O</title>
    </head>
    <body>
      <div id="react-app">${ReactDOMServer.renderToString(<NavBar />)}</div>
      <script type="module" src="${browserBundlePath}"></script>
    </body>
  </html>`;


// setting the routes
router.get(browserBundlePath, (ctx) => { //the js code that is loaded from script tag
  ctx.response.type ="application/javascript"
  ctx.response.body = js;
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
})
.get("/static/:name", async (ctx) => {
  // console.log(`Static router: ${ctx.request.method} ${ctx.request.url} ${ctx.params.name}`);
  ctx.response.type = "text/css"
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    extensions: [".css"],
    format: true
  });

})
.get("/", (ctx) => { //default route
  ctx.response.type = "text/html";
  ctx.response.body = html;
  // console.log(`Router: ${ctx.request.method} ${ctx.request.url}`);
})

// Passing Router as middleware
server.use(router.routes());
server.use(router.allowedMethods());

// start server
console.log("React SSR App listening on port 8000");
await server.listen({ port: 8000 });