"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

const ColorModeContext = createContext({
  mode: "light" as PaletteMode,
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

type Props = {
  children: React.ReactNode;
};

export default function AppThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const savedMode = window.localStorage.getItem("github-analyzer-theme-mode") as PaletteMode | null;
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((currentMode) => {
          const nextMode = currentMode === "light" ? "dark" : "light";
          window.localStorage.setItem("github-analyzer-theme-mode", nextMode);
          return nextMode;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#2563eb" : "#60a5fa",
            light: mode === "light" ? "#60a5fa" : "#93c5fd",
            dark: mode === "light" ? "#1d4ed8" : "#2563eb",
            contrastText: mode === "light" ? "#ffffff" : "#020617",
          },
          secondary: {
            main: mode === "light" ? "#7c3aed" : "#c084fc",
            light: mode === "light" ? "#a78bfa" : "#ddd6fe",
            dark: mode === "light" ? "#6d28d9" : "#9333ea",
            contrastText: mode === "light" ? "#ffffff" : "#020617",
          },
          success: {
            main: mode === "light" ? "#16a34a" : "#4ade80",
          },
          warning: {
            main: mode === "light" ? "#d97706" : "#fbbf24",
          },
          error: {
            main: mode === "light" ? "#dc2626" : "#fb7185",
          },
          text: {
            primary: mode === "light" ? "#0f172a" : "#e5eefb",
            secondary: mode === "light" ? "#64748b" : "#9fb0c7",
          },
          background: {
            default: mode === "light" ? "#f8fafc" : "#07111f",
            paper: mode === "light" ? "#ffffff" : "#0f1b2d",
          },
          divider: mode === "light" ? "rgba(15, 23, 42, 0.08)" : "rgba(148, 163, 184, 0.16)",
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: "var(--font-geist-sans), Arial, sans-serif",
          h3: {
            letterSpacing: "-0.04em",
          },
          h4: {
            letterSpacing: "-0.03em",
          },
          h5: {
            letterSpacing: "-0.02em",
          },
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                boxShadow: "none",
              },
            },
            defaultProps: {
              disableElevation: true,
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage:
                  mode === "light"
                    ? "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.90))"
                    : "linear-gradient(180deg, rgba(15, 27, 45, 0.96), rgba(10, 20, 35, 0.94))",
                border: mode === "light" ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid rgba(148, 163, 184, 0.14)",
                boxShadow: mode === "light" ? "0 20px 50px rgba(15, 23, 42, 0.08)" : "0 20px 60px rgba(0, 0, 0, 0.32)",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 700,
              },
              outlined: {
                borderColor: mode === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(148, 163, 184, 0.22)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "rgba(255,255,255,0.78)" : "rgba(2, 6, 23, 0.28)",
                "& fieldset": {
                  borderColor: mode === "light" ? "rgba(15, 23, 42, 0.14)" : "rgba(148, 163, 184, 0.20)",
                },
                "&:hover fieldset": {
                  borderColor: mode === "light" ? "rgba(37, 99, 235, 0.42)" : "rgba(96, 165, 250, 0.48)",
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
