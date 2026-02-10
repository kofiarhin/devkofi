const { Router } = require("express");
const pricingData = require("../data/pricingData.json");

const router = Router();

//get pricing
router.get("/", async (req, res, next) => {
  return res.json(pricingData);
});

module.exports = router;
