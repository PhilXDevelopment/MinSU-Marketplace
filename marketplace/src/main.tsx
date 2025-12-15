import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
import Verify from "./pages/auth/user/verify";
import VerifyToken from "./pages/auth/user/token";
import PrivateRoute from "./restriction/access";
import GuestRoute from "./restriction/guest";
import Shop from "./pages/users/marketplace/tabs/shop";
import Kyc from "./pages/auth/user/kyc";
import AdminRoutes from "./restriction/admin";
import AdminKyc from "./pages/admin/tabs/kyc";
import MyAddresses from "./pages/users/settings/address";
import { SocketProvider } from "./socketcontext";

// ---------------------------------------------------------------------------
// CLEAN & COMPLETE ROUTER
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // Redirect root to /marketplace
  {
    path: "/",
    element: <Navigate to="/marketplace" replace />,
  },

  // ------------------------- AUTH ROUTES -------------------------
  {
    path: "/auth",
    children: [
      {
        path: "signin",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: "verify",
        element: (
          <GuestRoute>
            <Verify />
          </GuestRoute>
        ),
      },
      {
        path: "verify-token",
        element: (
          <GuestRoute>
            <VerifyToken />
          </GuestRoute>
        ),
      },
      {
        path: "kyc",
        element: (
          <PrivateRoute>
            <Kyc />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ------------------------- MARKETPLACE ROUTES -------------------------
  {
    path: "/marketplace",
    element: <Marketplace_Layout />,
    children: [
      { index: true, element: <Marketplace /> },
      { path: "store/:id", element: <StorePage /> },
      { path: "product/:id", element: <ViewProduct /> },
      {
        path: "checkout-order/:id",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ------------------------- USER PROFILE ROUTES -------------------------
  {
    path: "/myprofile",
    element: (
      <PrivateRoute>
        <Profile_Layout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Showcase /> },
      {
        path: "addresses",
        element: (
          <PrivateRoute>
            <MyAddresses />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/settings",
    // element: (
    //   <PrivateRoute>
    //     <Profile_Layout />
    //   </PrivateRoute>
    // ),
    children: [
      {
        path: "addresses",
        element: (
          <PrivateRoute>
            <MyAddresses />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ------------------------- USER SHOP ROUTE -------------------------
  {
    path: "/myshop",
    element: (
      <PrivateRoute>
        <Shop />
      </PrivateRoute>
    ),
  },

  // ------------------------- ADMIN ROUTES -------------------------
  {
    path: "/admin/kyc",
    element: (
      <AdminRoutes>
        <AdminKyc />
      </AdminRoutes>
    ),
  },

  // ------------------------- 404 FALLBACK -------------------------
  {
    path: "*",
    element: (
      <div className="w-full h-screen flex justify-center items-center text-xl">
        404 – Page Not Found
      </div>
    ),
  },
]);

// ---------------------------------------------------------------------------
// RENDER APP
// ---------------------------------------------------------------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>
);
