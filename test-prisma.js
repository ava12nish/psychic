const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient();
  console.log("Success");
} catch(err) {
  console.error(err);
}
