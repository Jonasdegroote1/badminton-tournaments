// app/middleware.js
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";  // Correcte import
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getServerSession({ req, ...authOptions });

  // Als er geen sessie is (dus niet ingelogd), stuur de gebruiker naar de loginpagina
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Controleer of de gebruiker de juiste rol heeft voor POST, PUT, DELETE
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    // Hier gaan we ervan uit dat rol '1' admin is
    if (session.user.roleId !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Laat de aanvraag doorgaan als de sessie aanwezig is en de gebruiker de juiste rol heeft
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/*",  // Beveilig dashboardpagina's
    "/api/*",         // Beveilig alle API-routes
  ],
};
