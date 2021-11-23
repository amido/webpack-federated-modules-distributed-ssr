import React from "react";

import Paragraph from "./paragraph";

export default function App({ chunks }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Webpack Remote 2</title>

        {chunks.map((c) =>
          c.endsWith(".css") ? (
            <link key={c} rel="stylesheet" href={`build/${c}`} />
          ) : null
        )}
      </head>
      <body>
        <Paragraph>Paragraph</Paragraph>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.__CHUNKS__ = ${JSON.stringify(chunks)};`,
          }}
        />

        {chunks.map((c) =>
          c.endsWith(".js") ? <script key={c} src={`build/${c}`} /> : null
        )}
      </body>
    </html>
  );
}
