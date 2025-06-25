const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllJobs,
  handleAdmindashboard,
  handleUserDelete,
  handleJobDelete,
  getAllApplications,
} = require("../controllers/admin");
const { checkForAutentication } = require("../middlewares/auth");
const { checkForAdminAutentication } = require("../middlewares/admin");
router.use(checkForAutentication("token"));
router.use(checkForAdminAutentication);
router.get("/admin", handleAdmindashboard);
router.get("/admin/users", getAllUsers);
router.get("/admin/applications", getAllApplications);
router.post("/admin/users/:id", handleUserDelete);
router.get("/admin/jobs", getAllJobs);
router.post("/admin/jobs/:id", handleJobDelete);
module.exports = router;
