import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PassThrough } from "node:stream";
import App from "./App";
import { ContentProvider } from "./ContentContext";
export function render(url, content = {}) {
  return new Promise((resolve, reject) => {
    let html = "";
    const stream = new PassThrough();
    stream.on("data", (c) => (html += c.toString()));
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <ContentProvider data={content}>
          <App />
        </ContentProvider>
      </StaticRouter>,
      {
        onAllReady() {
          pipe(stream);
        },
        onShellError: reject,
        onError: reject,
      },
    );
    setTimeout(() => abort(), 15000).unref();
  });
}
