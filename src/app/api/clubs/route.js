import { prisma } from "@/lib/prisma";

export async function GET(request) {
  console.log("API request received"); // Debug: Log als de API wordt aangeroepen

  try {
    const clubs = await prisma.club.findMany();
    console.log("Clubs fetched from database:", clubs); // Debug: Log de opgehaalde clubs

    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return new Response(JSON.stringify({ error: "Error fetching clubs" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  const { name, city } = await request.json();

  try {
    const club = await prisma.club.create({
      data: { name, city },
    });
    console.log("Club created in database:", club);

    return new Response(JSON.stringify(club), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating club:", error);
    return new Response(JSON.stringify({ error: "Error creating club" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  const { id, name, city } = await request.json();

  try {
    const club = await prisma.club.update({
      where: { id },
      data: { name, city },
    });
    console.log("Club updated in database:", club);

    return new Response(JSON.stringify(club), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating club:", error);
    return new Response(JSON.stringify({ error: "Error updating club" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  const { id } = await request.json();

  try {
    const club = await prisma.club.delete({ where: { id } });
    console.log("Club deleted from database:", club);

    return new Response(JSON.stringify(club), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting club:", error);
    return new Response(JSON.stringify({ error: "Error deleting club" }), {
      status: 500,
    });
  }
}