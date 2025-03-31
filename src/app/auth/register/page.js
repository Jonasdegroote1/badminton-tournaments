// app/auth/register/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (response.ok) {
      alert("Registratie succesvol!");
      router.push("/auth/login");
    } else {
      const data = await response.json();
      alert("Fout: " + (data.message || "Onbekende fout"));
    }
  };

  return (
    <div>
      <h2>Registreren</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="firstName" onChange={handleChange} placeholder="Voornaam" required />
        <input type="text" name="lastName" onChange={handleChange} placeholder="Achternaam" required />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" onChange={handleChange} placeholder="Wachtwoord" required />
        <button type="submit" disabled={loading}>{loading ? "Registreren..." : "Registreren"}</button>
      </form>
    </div>
  );
}
