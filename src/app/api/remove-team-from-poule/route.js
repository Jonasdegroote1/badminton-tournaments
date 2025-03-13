import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  // const session = await getServerSession({ req: request, ...authOptions });
  
  //   if (!session || session.user.roleId !== 1) {
  //     return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  //   }
  try {
    const body = await req.json();
    const { teamId, pouleId } = body;

    if (!teamId || !pouleId) {
      return new Response(JSON.stringify({ error: "Ongeldige invoer" }), { status: 400 });
    }

    await prisma.team.update({
      where: { id: teamId },
      data: { pouleId: null }, // Team loskoppelen van de poule
    });

    return new Response(JSON.stringify({ message: "Team verwijderd uit poule" }), { status: 200 });
  } catch (error) {
    console.error("Fout bij verwijderen team:", error);
    return new Response(JSON.stringify({ error: "Interne serverfout" }), { status: 500 });
  }
}
