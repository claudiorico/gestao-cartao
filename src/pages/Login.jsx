import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { Account } from "@toolpad/core";
import { useTheme } from "@mui/material/styles";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useFileUploadContext } from "../../context/FileUploadContext";

// preview-start
const providers = [
  // { id: "github", name: "GitHub" },
  { id: "google", name: "Google" },
  // { id: "facebook", name: "Facebook" },
  // { id: "twitter", name: "Twitter" },
  // { id: "linkedin", name: "LinkedIn" },
];

const demoSession = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
  },
};
// preview-end

export default function OAuthSignInPage() {
  const { setSession } = useFileUploadContext();

  //   const signIn = async (provider) => {
  //     const promise = new Promise((resolve) => {
  //       console.log(`Sign in with ${provider.id}`);
  //       setSession(demoSession);
  //       resolve();
  //     });
  //     return promise;
  //   };

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

          //   // Configurando o usuário no Account
          //   Account.signIn({ user });

          //   // Redireciona para o Dashboard
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
  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage signIn={handleGoogleSignIn} providers={providers} />
    </AppProvider>
    // preview-end
  );
}
