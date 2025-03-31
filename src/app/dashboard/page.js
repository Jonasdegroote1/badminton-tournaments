// app/dashboard/page.js

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.roleId !== 1) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welkom, <strong>{session.user.firstName}</strong>! 🎉</p>
      <p>Rol: <span>{session.user.roleId === 1 ? "Admin" : "Gebruiker"}</span></p>

      <p>Hier komt jouw admin-only content...</p>
    </div>
  );
}
