const express = require("express");
const {
  getAllInterests,
  addInterestUser,
  addInterestEvent,
  getUserInterests,
  deleteInterestByUserId,
  deleteInterestByEventId,
  getEventInterest
} = require("../controllers/interests_controller");
const authenticateJWT = require("../middleware/auth_middleware");

const router = express.Router();

router.get("/all", getAllInterests);
router.post("/user", authenticateJWT, addInterestUser);
router.post("/event/:id", authenticateJWT, addInterestEvent);
router.get("/user/:id", getUserInterests);
router.get("/event/:id", getEventInterest)
router.delete("/user/", authenticateJWT, deleteInterestByUserId);
router.delete("/event/:id", authenticateJWT, deleteInterestByEventId);

module.exports = router;
