import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <StrictMode>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  </StrictMode>
);
