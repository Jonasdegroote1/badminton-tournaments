"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [clubs, setClubs] = useState([]); // state om clubs op te slaan
  const [loading, setLoading] = useState(true); // state om te controleren of de clubs nog geladen worden
  const [error, setError] = useState(null); // state voor eventuele fouten

  // Gebruik useEffect om clubs op te halen bij het laden van de pagina
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setClubs(data); // Zet de clubs in de state
        setLoading(false); // Zet loading op false als de data is opgehaald
      } catch (error) {
        setError(error.message); // Foutafhandelingsmechanisme
        setLoading(false);
      }
    };

    fetchClubs();
  }, []); // Lege dependency array betekent dat dit maar één keer wordt uitgevoerd bij het laden

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1>Clubs</h1>

        {loading && <p>Loading clubs...</p>} {/* Laat een laadbericht zien */}
        {error && <p>Error: {error}</p>} {/* Laat een foutmelding zien als er iets mis gaat */}

        {!loading && !error && (
          <ul>
            {clubs.map((club) => (
              <li key={club.id}>{club.name}</li> // Weergeven van de clubnamen
            ))}
          </ul>
        )}

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
