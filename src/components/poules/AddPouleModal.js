"use client";
import { useState, useEffect } from "react";

export default function AddPouleModal({ showModal, setShowModal, tournamentId, onAddPoule }) {
  const [strengths, setStrengths] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    strengthId: '',
    tournamentId: tournamentId, // Dit zou automatisch moeten worden ingesteld op het juiste toernooi-ID
  });

  // Haal de strengths op bij het laden van de component
  useEffect(() => {
    const fetchStrengths = async () => {
      const response = await fetch('/api/strength');
      const data = await response.json();
      setStrengths(data);
    };

    fetchStrengths();
  }, []);

  // Zorg ervoor dat tournamentId up-to-date is in de formData als het verandert
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      tournamentId: tournamentId, // Update tournamentId als de prop verandert
    }));
  }, [tournamentId]);

  // Functie om de form data bij te werken
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Functie om de poule toe te voegen
  const handleAddPoule = async () => {
    const updatedFormData = {
      ...formData,
      strengthId: Number(formData.strengthId), // Zet de string om naar een integer
    };

    try {
      const response = await fetch('/api/poules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const newPoule = await response.json(); // Haal de nieuwe poule op uit de response
        onAddPoule(newPoule); // Voeg de nieuwe poule toe aan de lijst in de oudercomponent
        setShowModal(false); // Sluit de modal na succes
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error creating poule:", error);
    }
  };

  return (
    showModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Voeg een Poule toe</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name">Poule Naam:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="strengthId">Strength:</label>
              <select
                id="strengthId"
                name="strengthId"
                value={formData.strengthId}
                onChange={handleChange}
                required
              >
                <option value="">Select Strength</option>
                {strengths.map((strength) => (
                  <option key={strength.id} value={strength.id}>
                    {strength.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button type="button" onClick={handleAddPoule}>
                Voeg Poule toe
              </button>
              <button type="button" onClick={() => setShowModal(false)}>
                Annuleer
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
