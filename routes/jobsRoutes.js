const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  getAllJobs,
  createAJob,
  handleJobCreation,
  handleJobDetails,
  applyJob,
  handleApplication,
} = require("../controllers/jobs");
const { checkForAutentication } = require("../middlewares/auth");
router.use(checkForAutentication("token"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", getAllJobs);
router.get("/create", createAJob);
router.post("/create", handleJobCreation);
router.get("/job/:id", handleJobDetails);
router.get("/apply/:id", applyJob);
router.post("/apply/:id", upload.single("resume"), handleApplication);

module.exports = router;
