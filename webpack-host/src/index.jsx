import React from "react";
import { hydrateRoot } from "react-dom";

import App from "./components/app";

const links = document.body.getElementsByTagName("link");
for (let link of links) {
  document.head.appendChild(link);
}
hydrateRoot(document, <App />);
// const root = createRoot(document, { hydrate: true });

// root.render(<App />);
