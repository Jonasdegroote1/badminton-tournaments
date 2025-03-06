// app/layout.js
"use client";

import { SessionProvider } from "next-auth/react";  // Importeer de SessionProvider

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head />
      <body>
        <SessionProvider>
          {children}  {/* Hiermee wordt de sessiecontext beschikbaar voor alle pagina's */}
        </SessionProvider>
      </body>
    </html>
  );
}
