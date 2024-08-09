const { Router } = require("express");
const {
  create,
  getAll,
  getById,
  getByUserId,
} = require("../../../controllers/account.controller");
const router = Router();

router.post("/account/", create);
router.get("/accounts/", getAll);
router.get("/account/:accountId", getById);
router.get("/account/user/:userId", getByUserId);

module.exports = router;
