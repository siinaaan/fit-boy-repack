import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

import { store } from "./userLayout/app/store";
import { queryClient } from "./userLayout/app/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider store={store}>

      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <App />
        </BrowserRouter>

      </QueryClientProvider>

    </Provider>

  </React.StrictMode>
);