const { Router } = require("express");
const {
  create,
  getAll,
  getById,
} = require("../../../controllers/transaction.controller");
const router = Router();

router.post("/transaction/", create);
router.get("/transactions/", getAll);
router.get("/transaction/:transactionId", getById);

module.exports = router;