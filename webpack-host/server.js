const React = require("react");
const { renderToPipeableStream } = require("react-dom/server");

const express = require("express");

const App = require("./dist/app");

const dotenv = require("dotenv").config();

const app = express();

const PORT = dotenv.PORT || "3002";

app.use("/", express.static("./public"));

app.use("/", (req, res) => {
  if (req.path !== "/") {
    res.status(404);
    res.send();
    return;
  }

  let didError = false;
  const ctx = {};
  const { pipe, abort } = renderToPipeableStream(
    React.createElement(
      App.context.Provider,
      { value: ctx },
      React.createElement(App.default)
    ),
    {
      onCompleteAll() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.contentType("html");
        res.write("<!DOCTYPE html>");
        pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      },
    }
  );

  setTimeout(abort, 5000);
});

app.listen(PORT, () =>
  console.log(`webpack host: started at http://localhost:${PORT}`)
);
