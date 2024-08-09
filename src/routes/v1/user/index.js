const { Router } = require("express");
const {
  create,
  getAll,
  getById,
} = require("../../../controllers/user.controller");
const router = Router();

router.post("/user/", create);
router.get("/users/", getAll);
router.get("/user/:userId", getById);

module.exports = router;
