import Image from "next/image";
import styles from "./page.module.css";
import { cache } from "react"; // ✅ Helps with caching data in Server Components

// ✅ Fix: Use correct fetching logic for Server Components

export default async function Home() {

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
      </main>
    </div>
  );
}
