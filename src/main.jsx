import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { PropertyProvider } from "./context/PropertyContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { FilterDataProvider } from "./context/FilterDataContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <PropertyProvider>
            <UserProvider>
              <FilterDataProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </FilterDataProvider>
            </UserProvider>
          </PropertyProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
