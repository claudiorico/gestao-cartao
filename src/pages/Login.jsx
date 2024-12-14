import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useFileUploadContext } from "../../context/FileUploadContext";
import { Typography, Alert } from "@mui/material";

// preview-start
const providers = [
  { id: "google", name: "Google" },
];

export default function OAuthSignInPage() {
  const { setSession } = useFileUploadContext();

  const navigate = useNavigate();

  const handleGoogleSignIn = async (provider) => {
    const promise = new Promise((resolve) => {
      console.log(auth.currentUser);
      if (auth.currentUser) {
        const userlogin = {
          user: {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            image: auth.currentUser.photoURL,
          },
        };
        setSession(userlogin);
        navigate("/");
        return;
      }
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          const user = result.user;
          console.log("Usuário logado:", user);

          const userlogin = {
            user: {
              name: user.displayName,
              email: user.email,
              image: user.photoURL,
            },
          };

          //return user;

          // Redireciona para o Dashboard
          setSession(userlogin);
          navigate("/");
          resolve();
        })
        .catch((error) => {
          console.error("Erro ao fazer login com Google:", error);
        });
    });
    return promise;
  };

  const theme = useTheme();

  const BRANDING = {
    title: "Gestão de Gastos - Cartão",
    logo: <img src="cart.svg" alt="Logo Cart" style={{ width: "80px" }} />,
  };

  const Title = () => {
    return (
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome Back!
      </Typography>
    );
  };

  const Subtitle = () => {
    return (
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Sign in to your account
      </Typography>
    );
  };

  return (
    // preview-start
    <AppProvider theme={theme} branding={BRANDING}>
      <SignInPage signIn={handleGoogleSignIn}
        slots={{
          title: () => <h1 style={{ color: '#1976d2' }}>Bem-vindo ao Meu App</h1>,
          subtitle: () => <h2 style={{ color: '#555' }}>Faça login para continuar</h2>,
        }}
        providers={providers} />
    </AppProvider>
    // preview-end
  );
}
