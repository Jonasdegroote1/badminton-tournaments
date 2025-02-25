import Image from "next/image";
import styles from "./page.module.css";
import { cache } from "react"; // ✅ Helps with caching data in Server Components

// ✅ Fix: Use correct fetching logic for Server Components
const getClubs = cache(async () => {
  const response = await fetch(`${process.env.API_URL || "http://localhost:3000"}/api/clubs`, {
    cache: "no-store", // Ensure fresh data on each request
  });

  if (!response.ok) {
    throw new Error("Failed to fetch clubs");
  }

  return response.json();
});

export default async function Home() {
  let clubs = [];

  try {
    clubs = await getClubs(); // ✅ Ensures consistent data fetching
  } catch (error) {
    console.error("Error fetching clubs:", error);
  }

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

        {clubs.length === 0 ? (
          <p>No clubs found.</p>
        ) : (
          <ul>
            {clubs.map((club) => (
              <li key={club.id}>{club.name}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
