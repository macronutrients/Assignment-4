import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient(); //our dynamic queryClient manager who can use frontEnd copies of the backend when available

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App/>
      </QueryClientProvider></BrowserRouter>
  </React.StrictMode>
);