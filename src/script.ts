import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  const newLink = await prismaClient.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
      linkStatus: 'ACTIVE',
    },
  });
  const allLinks = await prismaClient.link.findMany();
  console.log(allLinks);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
