import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import { FileUpload } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router-dom';
import SnackbarAlert from '../components/MessageAlert.jsx';
import { createTheme } from '@mui/material/styles';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'fileupload',
    title: 'Carregar Arquivo',
    icon: <FileUpload />,
  },
  {
    segment: 'cartupdate',
    title: 'Atualização de Extrato',
    icon: <TableViewIcon />,
  },  
];

const BRANDING = {
  title: 'Gestão de Gastos - Cartão',
  logo: <img src="cart.svg" alt="Logo Cart"/>
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
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
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING} theme={demoTheme}>
      <SnackbarAlert/>
      <Outlet />
    </AppProvider>
  );
}
