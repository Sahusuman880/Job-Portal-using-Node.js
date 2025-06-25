const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
async function checkForAdminAutentication(req, res, next) {
  if (req?.user?.isAdmin) {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
      },
    });
    const jobs = await prisma.job.findMany({});
    const companies = await prisma.job.findMany({
      distinct: ["company"],
      select: {
        company: true,
      },
    });
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });
    req.allUsers = users;
    req.jobs = jobs;
    req.applications = applications;
    req.companies = companies;

    return next();
  }
  return res.redirect("/login");
}
module.exports = { checkForAdminAutentication };
