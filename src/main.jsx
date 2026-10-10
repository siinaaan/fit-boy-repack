import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

import { store } from "./userLayout/app/store";
import { queryClient } from "./userLayout/app/queryClient";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider store={store}>

      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <App />
          <Toaster 
            position="top-right"
    toastOptions={{
    duration: 3000,

    style: {
      background: "#18181b",
      color: "#ffffff",
      border: "1px solid #3f3f46",
      borderRadius: "10px",
      padding: "16px 18px",
      fontSize: "14px",
      marginTop: "60px",
    },

    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#ffffff",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#ffffff",
      },
    },
  }}/>
        </BrowserRouter>

      </QueryClientProvider>

    </Provider>

  </React.StrictMode>
);