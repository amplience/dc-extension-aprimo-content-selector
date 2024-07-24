import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import WithContentFieldExtension from "./contexts/content-field-extension/WithContentFieldExtension.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WithContentFieldExtension key={"extension"}>
      <App />
    </WithContentFieldExtension>
  </React.StrictMode>
);
