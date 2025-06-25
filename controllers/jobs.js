const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getAllJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const whereClause = userId
      ? {
          NOT: {
            applications: {
              some: {
                userId: userId,
              },
            },
          },
        }
      : {};

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.render("home", {
      jobs: jobs,
      user: req.user,
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({ message: "Error fetching jobs" });
  }
};

const createAJob = (req, res) => {
  return res.render("createJob");
};

const handleJobCreation = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    const jobs = await prisma.job.create({
      data: {
        title,
        description,
        company,
        postedBy: {
          connect: { id: req.user.id },
        },
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!jobs) {
      return res.status(500).json({ message: "Error creating job" });
    }
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating job" });
  }
};

const handleJobDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const job = await prisma.job.findUnique({
      where: { id: id },
      include: {
        postedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.render("aboutJob", {
      job: job,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching job" });
  }
};

const applyJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).render("error", {
        message: "Job not found",
      });
    }
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        userId: req.user.id,
      },
    });

    if (existingApplication) {
      return res.redirect(`/job/${jobId}`);
    }

    return res.render("applicationForm", {
      job,
      user: req.user,
    });
  } catch (error) {
    console.error("Error showing apply form:", error);
    return res.status(500).render("error", {
      message: "Error loading application form",
    });
  }
};

const handleApplication = async (req, res) => {
  try {
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        jobId: parseInt(req.params.id),
      },
    });

    if (existingApplication) {
      return res.redirect("/");
    }

    // Create the application
    await prisma.application.create({
      data: {
        message: req.body.message,
        resumeUrl: `/uploads/${req.file.filename}`,
        user: {
          connect: { id: req.user.id },
        },
        job: {
          connect: { id: parseInt(req.params.id) },
        },
        // status defaults to "PENDING"
      },
    });

    return res.redirect("/"); // Redirect to jobs listing or dashboard
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.redirect("/");
  }
};
module.exports = {
  getAllJobs,
  createAJob,
  handleJobCreation,
  handleJobDetails,
  applyJob,
  handleApplication,
};
