import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Haal het token op (JWT) uit de cookies
  const token = await getToken({ req });

  // Als er geen token is, stuur de gebruiker naar de loginpagina
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Alleen gebruikers met roleId === 1 mogen POST, PUT, DELETE doen
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    if (token.roleId !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",  // Beveilig alle dashboardpagina's
    "/api/:path*",        // Beveilig alle API-routes
  ],
};
