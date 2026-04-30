const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFields() {
  const dmmf = prisma._dmmf;
  const profileModel = dmmf.datamodel.models.find(m => m.name === 'Profile');
  console.log('Profile fields:', profileModel.fields.map(f => f.name));
  process.exit(0);
}

checkFields();
