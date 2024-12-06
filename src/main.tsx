import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NextBrainProvider } from "./context/NextBrainContext.js";
import { Providers } from "./context/Providers.tsx";
import '@coinbase/onchainkit/styles.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <NextBrainProvider>
        <App />
      </NextBrainProvider>
    </Providers>
  </StrictMode>
);
