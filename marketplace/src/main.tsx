import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages and layouts
import Showcase from "./pages/users/profile/showcase/showcase";
import Profile_Layout from "./pages/layouts/users/profile_layout";
import Marketplace_Layout from "./pages/layouts/users/marketplace_layout";
import Marketplace from "./pages/users/marketplace/marketplace";
import Login from "./pages/auth/user/signin";
import Register from "./pages/auth/user/register";
import StorePage from "./pages/users/marketplace/tabs/store";
import ViewProduct from "./pages/users/marketplace/tabs/viewproduct";
import CheckoutPage from "./pages/users/marketplace/tabs/checkout";

// Define routes
const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "signin", element: <Login /> },
      { path: "signup", element: <Register /> },
    ],
  },
  {
    path: "/marketplace",
    element: <Marketplace_Layout />, // This is the layout
    children: [
      { index: true, element: <Marketplace /> }, // Main marketplace page
      { path: "store/:id", element: <StorePage /> }, // Now correctly nested inside layout
      { path: "product/:id", element: <ViewProduct /> },
      { path: "checkout-order/:id", element: <CheckoutPage /> },
    ],
  },
  {
    path: "/myprofile",
    element: <Profile_Layout />,
    children: [
      { index: true, element: <Showcase /> }, // User profile page
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
