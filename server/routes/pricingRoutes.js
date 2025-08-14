const { Router } = require("express");
const {
  getPriceList,
  getPriceItem,
} = require("../controllers/pricingController");

const router = Router();

router.get("/", getPriceList);
router.get("/:id", getPriceItem);

module.exports = router;
