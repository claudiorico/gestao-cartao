import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Layout from "./layouts/dashboard";
import EditTable from "../components/EditTable.jsx";
import FileUploadContext from "../context/FileUploadContext.jsx";
import EditTableUpdate from "../components/EditTableUpdate.jsx";
import PageContainer from "../src/layouts/container.jsx";
import { FileUpload } from "../components/FileUpload.jsx";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "",
            Component: PageContainer,
          },
          {
            path: "fileupload",
            Component: FileUpload,
          },
          {
            path: "cartupdate",
            Component: EditTableUpdate,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FileUploadContext>
        <RouterProvider router={router} />
      </FileUploadContext>
    </QueryClientProvider>
  </StrictMode>
);
