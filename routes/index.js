const express = require("express");
var router = express.Router();
const IndexController = require("../controllers/IndexController");
const verifyToken = require("../middleware/verifyJWT");
const auth = require("../middleware/authRole");

router.post("/authenticate", IndexController.authenticate);
router.post(
  "/createAssignment",
  verifyToken,
  auth.authRoleTeacher,
  IndexController.createAssignment
);
router.put(
  "/updateAssignment/:id",
  verifyToken,
  auth.authRoleTeacher,
  IndexController.updateAssignment
);
router.delete(
  "/deleteAssignment/:id",
  verifyToken,
  auth.authRoleTeacher,
  IndexController.deleteAssignment
);

router.get("/all_assignments",IndexController.getAllAssignment)
router.post(
  "/addSubmission",
  verifyToken,
  auth.authRoleStudent,
  IndexController.addSubmission
);
router.post("/getDetails", verifyToken, IndexController.detailsAssignment);
router.post("/assignment_feed", verifyToken, IndexController.assignmentFeed);

module.exports = router;
