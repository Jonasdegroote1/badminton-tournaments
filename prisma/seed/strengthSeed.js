module.exports = async (prisma) => {
  const strengths = [{
    name: 'zeer sterk'
  }, {
    name: 'sterk'
  }, {
    name: 'gemiddeld'
  }, {
    name: 'zwak'
  }];

  for (const strength of strengths) {
    await prisma.strength.create({
      data: strength
    });
  }

  console.log('Strengths seeded successfully!');
}