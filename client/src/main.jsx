import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./visuals.css";
import { ContentProvider } from "./ContentContext";
const content = JSON.parse(
  document.getElementById("esgrow-content")?.textContent || "{}",
);
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider data={content}>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
const snapshotPath = root.dataset.prerenderPath?.replace(/\/$/, "") || "/";
const currentPath = location.pathname.replace(/\/$/, "") || "/";
if (root.hasChildNodes() && snapshotPath === currentPath)
  hydrateRoot(root, app);
else createRoot(root).render(app);
