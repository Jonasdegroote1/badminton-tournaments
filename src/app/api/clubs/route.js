// src/app/api/clubs/route.js

import { prisma } from "@/lib/prisma"; // Zorg ervoor dat dit het juiste pad is

export async function GET(request) {
  try {
    // Haal alle clubs op uit de database
    const clubs = await prisma.club.findMany();  

    // Log de clubs naar de browserconsole (deze zal zichtbaar zijn in de devtools van je browser)
    console.log('Clubs in API:', clubs);

    // Geef de clubs terug als JSON
    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return new Response(JSON.stringify({ error: 'Error fetching clubs' }), {
      status: 500,
    });
  }
}
