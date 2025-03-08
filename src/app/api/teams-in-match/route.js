import { prisma } from "@/lib/prisma"; // Zorg ervoor dat Prisma goed is geïmporteerd

export async function GET(request) {
  try {
    const teamsInMatch = await prisma.teamsInMatch.findMany();
    return new Response(JSON.stringify(teamsInMatch), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching teams in match:", error);
    return new Response(JSON.stringify({ error: "Error fetching teams in match" }), {
      status: 500,
    });
  }
}


export async function POST(req, res) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  try {
    const { teamId, matchId } = req.body;
    const teamInMatch = await prisma.teamsInMatch.create({
      data: {
        teamId,
        matchId
      }
    });
    return res.status(201).json(teamInMatch);
  } catch (error) {
    console.error("Error creating team in match:", error);
    return res.status(500).json({ error: "Error creating team in match" });
  }
}

export async function PUT(req, res) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  try {
    const { id } = req.params;
    const { teamId, matchId } = req.body;
    const teamInMatch = await prisma.teamsInMatch.update({
      where: {
        id: parseInt(id)
      },
      data: {
        teamId,
        matchId
      }
    });
    return res.status(200).json(teamInMatch);
  } catch (error) {
    console.error("Error updating team in match:", error);
    return res.status(500).json({ error: "Error updating team in match" });
  }
}

export async function DELETE(req, res) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  try {
    const { id } = req.params;
    await prisma.teamsInMatch.delete({
      where: {
        id: parseInt(id)
      }
    });
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting team in match:", error);
    return res.status(500).json({ error: "Error deleting team in match" });
  }
}
