const { Router } = require("express");
const {
  withdraw,
  getById,
  getByUserId,
} = require("../../../controllers/withdrawal.controller");
const authenticate = require("../../../middleware/auth");
const router = Router();

router.post("/withdrawal/", authenticate, withdraw);
router.get("/withdrawals/user/:userId", authenticate, getByUserId);
router.get("/withdrawal/:withdrawalId", authenticate, getById);

module.exports = router;
