import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { initializeApp } from "firebase/app";
import router from "./router";
import "./index.css"; // Tailwind styles
import  firebaseConfig  from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
