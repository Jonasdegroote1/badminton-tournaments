// app/page.js

"use client";
import Image from "next/image";
import styles from "./page.module.css"; // Zorg ervoor dat dit bestand bestaat

export default function Home() {
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
        <h1>Welkom bij de Club</h1>
        <p>
          Dit is de informatiepagina van de website. Je kunt hier alles vinden wat je
          nodig hebt. De pagina is toegankelijk zonder inloggen.
        </p>
      </main>
    </div>
  );
}
