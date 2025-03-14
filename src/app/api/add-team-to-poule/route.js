app.put('/api/add-team-to-poule', async (req, res) => {
  const { teamId, strengthId, pouleId } = req.body;

  if (!teamId || !strengthId || !pouleId) {
    return res.status(400).json({ error: 'Invalid teamId, strengthId or pouleId' });
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { strengthId, pouleId },
    });

    return res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error adding team to poule:", error);
    return res.status(500).json({ error: 'Error adding team to poule' });
  }
});
