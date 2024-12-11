import DashboardIcon from "@mui/icons-material/Dashboard";
import TableViewIcon from "@mui/icons-material/TableView";
import { FileUpload } from "@mui/icons-material";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet } from "react-router-dom";
import SnackbarAlert from "../components/MessageAlert.jsx";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useFileUploadContext } from "../context/FileUploadContext.jsx";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./pages/firebase.js";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "fileupload",
    title: "Carregar Arquivo",
    icon: <FileUpload />,
  },
  {
    segment: "cartupdate",
    title: "Atualização de Extrato",
    icon: <TableViewIcon />,
  },
];

const BRANDING = {
  title: "Gestão de Gastos - Cartão",
  logo: <img src="cart.svg" alt="Logo Cart" />,
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function App() {

  const navigate = useNavigate();

  const { session, setSession } = useFileUploadContext();

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        navigate('login');
      },
      signOut: async () => {
        try {
          await signOut(auth);
          console.log("Usuário deslogado.");
        } catch (error) {
          console.error("Erro ao deslogar:", error);
        }        
        setSession(null);
        navigate('login');
      },
    };
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      theme={demoTheme}
      session={session}
      authentication={authentication}
    >
      <SnackbarAlert />
      <Outlet />
    </AppProvider>
  );
}
