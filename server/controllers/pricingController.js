const pricingData = require("../data/pricingData");

const getPriceList = async (req, res, next) => {
  return res.json(pricingData);
};

const getPriceItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("please provide an id");
    }
    const foundItem = pricingData.find((item) => item.id === parseInt(id));

    if (!foundItem) {
      res.status(400);
      throw new Error("pricing item not found");
    }
    return res.json(foundItem);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPriceList,
  getPriceItem,
};
