// app/api/courts/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Zorg ervoor dat de juiste import is
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  console.log("API request received");

  // Iedereen kan courts ophalen
  try {
    const courts = await prisma.court.findMany();
    console.log("Courts fetched from database:", courts);

    return new Response(JSON.stringify(courts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching courts:", error);
    return new Response(JSON.stringify({ error: "Error fetching courts" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  // Alleen admins mogen nieuwe courts aanmaken
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { name, city } = await request.json();

  try {
    const court = await prisma.court.create({
      data: { name, city },
    });
    console.log("Court created in database:", court);

    return new Response(JSON.stringify(court), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating court:", error);
    return new Response(JSON.stringify({ error: "Error creating court" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  // Alleen admins mogen courts updaten
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { id, name, city } = await request.json();

  try {
    const court = await prisma.court.update({
      where: { id },
      data: { name, city },
    });
    console.log("Court updated in database:", court);

    return new Response(JSON.stringify(court), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating court:", error);
    return new Response(JSON.stringify({ error: "Error updating court" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  // Alleen admins mogen courts verwijderen
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { id } = await request.json();

  try {
    const court = await prisma.court.delete({
      where: { id },
    });
    console.log("Court deleted from database:", court);

    return new Response(JSON.stringify(court), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting court:", error);
    return new Response(JSON.stringify({ error: "Error deleting court" }), {
      status: 500,
    });
  }
}
