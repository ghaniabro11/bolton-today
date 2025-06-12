"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Success toast styles
          "--success-bg": "#4CAF50",
          "--success-text": "white",
          "--success-border": "#45a049",
          // Error toast styles
          "--error-bg": "#f44336",
          "--error-text": "white",
          "--error-border": "#d32f2f",
          // Warning toast styles
          "--warning-bg": "#ff9800",
          "--warning-text": "white",
          "--warning-border": "#f57c00",
          // Info toast styles
          "--info-bg": "#2196F3",
          "--info-text": "white",
          "--info-border": "#1976D2",
        } as React.CSSProperties
      }
      // You can also set default options for all toasts
      toastOptions={{
        duration: 3000,
        // position: "top-right",

        // Add any other default options here
      }}
      {...props}
    />
  );
};

export { Toaster };
