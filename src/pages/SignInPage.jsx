import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { Account } from "@toolpad/core";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Usuário logado:", user);

      // Configurando o usuário no Account
      Account.signIn({ user });

      // Redireciona para o Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleSignIn}
        style={{ marginTop: "16px" }}
      >
        Entrar com Google
      </Button>
    </Box>
  );
};

export default SignInPage;
