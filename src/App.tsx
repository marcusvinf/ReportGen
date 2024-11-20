import { RouterProvider } from "react-router-dom";
import React from "react";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { routes } from "./routes/router";
import { AuthProvider } from "./contexts/authProvider";
import { theme } from "./theme/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
