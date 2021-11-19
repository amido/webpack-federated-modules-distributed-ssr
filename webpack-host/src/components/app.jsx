import React from "react";

import federatedComponent, { context } from "./federated-component";

export { context };

const REMOTE_HOSTS = process.env.REMOTE_HOSTS;

const Header = federatedComponent("webpackRemote", "./header", undefined);
const Paragraph = federatedComponent(
  "webpackRemote2",
  "./paragraph",
  undefined
);
// const port = typeof window !== undefined ? env.PORT : "";
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Esbuild Host</title>
      </head>
      <body>
        <React.Suspense fallback="">
          <Header>
            <h1>Header</h1>
            <p>Federated from a webpack build</p>

            <Header>
              <h1>Nested</h1>
              <p>Nested component</p>
              <Paragraph>Paragraph nested from a different remote</Paragraph>
            </Header>
          </Header>

          {Object.entries(REMOTE_HOSTS).map(([name, entry]) => (
            <script
              key={`${name}_url`}
              src={`${entry}/build/remote-entry.js`}
            />
          ))}
          <script type="module" src={`build/app.js`} />
        </React.Suspense>
      </body>
    </html>
  );
}
