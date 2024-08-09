const { Router } = require("express");
const {
  deposit,
  getById,
  getByUserId,
} = require("../../../controllers/deposit.controller");
const authenticate = require("../../../middleware/auth");
const router = Router();

router.post("/deposit/", authenticate, deposit);
router.get("/deposit/:depositId", authenticate, getById);
router.get("/deposit/user/:userId", authenticate, getByUserId);

module.exports = router;
