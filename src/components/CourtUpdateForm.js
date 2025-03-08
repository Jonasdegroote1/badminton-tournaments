"use client";

import { useState } from "react";

export default function CourtUpdateForm() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Parse de id naar een integer
    const parsedId = parseInt(id, 10);  // 10 is het radix getal voor decimale getallen

    if (isNaN(parsedId)) {
      setMessage("Court ID must be a valid number.");
      setLoading(false);
      return;
    }

    console.log("Form Data:", { id: parsedId, name });  // Log de parsed id

    const response = await fetch("/api/courts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parsedId, name }),  // Verstuur de id als een nummer
    });

    if (response.ok) {
      setMessage("Court updated successfully!");
    } else {
      setMessage("Failed to update court.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Update Court</h2>

      <label className="block mb-2">
        Court ID:
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </label>

      <label className="block mb-2">
        Court Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full mt-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Court"}
      </button>

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  );
}
