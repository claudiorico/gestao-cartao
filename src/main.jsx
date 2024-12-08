import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Layout from "./layouts/dashboard.jsx";
import OAuthSignInPage from "./pages/Login.jsx";
import ProtectedRoutes from "./pages/ProtectedRoute.jsx";
import FileUploadContext from "../context/FileUploadContext.jsx";
import EditTableUpdate from "../components/EditTableUpdate.jsx";
import PageContainer from "../src/layouts/container.jsx";
import { FileUpload } from "../components/FileUpload.jsx";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <App />, // root layout route
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <ProtectedRoutes />,
            children: [
              {
                path: "/",
                element: <PageContainer />,
              },
              {
                path: "/fileupload",
                element: <FileUpload />,
              },
              {
                path: "/cartupdate",
                element: <EditTableUpdate />,
              },
            ]
          }
        ]
      },
      {
        path: "/login",
        element: <OAuthSignInPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <FileUploadContext>
      <RouterProvider router={router} />
    </FileUploadContext>
  </QueryClientProvider>
  // {/* </StrictMode> */}
);
