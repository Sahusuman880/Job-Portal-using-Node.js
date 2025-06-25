const { application } = require("express");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const handleAdmindashboard = async (req, res) => {
  try {
    return res.render("adminDashboard", {
      user: req.user,
      allUsers: req.allUsers,
      jobs: req.jobs,
      applications: req.applications,
      companies: req.companies,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
      },
    });
    return res.render("allUsers", {
      users,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        postedBy: true, // This will include all user details who posted the job
      },
    });
    return res.render("allJobs", {
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const handleUserDelete = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await prisma.application.deleteMany({
      where: { userId: userId },
    });
    await prisma.job.deleteMany({
      where: { postedById: userId },
    });
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.redirect("/admin/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const handleJobDelete = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    await prisma.application.deleteMany({
      where: { jobId: jobId },
    });
    await prisma.job.delete({
      where: { id: jobId },
    });

    return res.redirect("/admin/jobs");
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message,
    });
  }
};

const getAllApplications = (req, res) => {
  return res.render("jobApplications", {
    applications: req.applications,
  });
};
module.exports = {
  handleAdmindashboard,
  getAllUsers,
  getAllJobs,
  handleUserDelete,
  handleJobDelete,
  getAllApplications,
};
