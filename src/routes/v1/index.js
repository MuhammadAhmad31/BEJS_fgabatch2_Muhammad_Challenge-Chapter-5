const { Router } = require("express");
const accountRoutes = require("./account");
const authRoutes = require("./auth");
const depositRoutes = require("./deposit");
const transactionRoutes = require("./transaction");
const userRoutes = require("./user");
const withdrawalRoutes = require("./withdrawal");
const router = Router();

router.use("/v1/",accountRoutes);
router.use("/v1/",authRoutes);
router.use("/v1/",depositRoutes);
router.use("/v1/",transactionRoutes);
router.use("/v1/",userRoutes);
router.use("/v1/",withdrawalRoutes);

module.exports = router;
