import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import WithContentFieldExtension from "./contexts/content-field-extension/WithContentFieldExtension.tsx";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#039be5",
    },
    secondary: {
      main: "#ccc",
      contrastText: "#fff",
    },
  },
  typography: {
    allVariants: {
      color: "#333",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          fill: "#fff",
          "&:hover": {
            backgroundColor: "#039be5",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <WithContentFieldExtension key={"extension"}>
        <App />
      </WithContentFieldExtension>
    </ThemeProvider>
  </React.StrictMode>
);
