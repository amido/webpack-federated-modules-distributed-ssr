# esbuild federation example

In this example SSR will not happen all on the host (as classic module-federation-ssr) but in the federated module NodeJS application, serialised HTML is being sent back over fetch to the host NodeJS app which will parse it back to react and send it back to the browser for hydration. 

this way SSR can be offloaded to a number of enterprise servers.

<img src="diagram.png" width="1000">

## Running

From the root of the project:

```bash
yarn
yarn build
yarn start 
```

The webpack bundled application that owns the Header component will start on http://localhost:3001 while the esbuild bundled application that consumes the exposed Header component will start on http://localhost:3000.

based on https://www.ebey.me/blog/webpack-federation-ssr and https://github.com/module-federation/module-federation-examples

makes use of [esbuild-federation-share-scope](https://github.com/jacob-ebey/esbuild-federation-share-scope).