const pricingData = require("../data/pricingData");
const { getPriceItem } = require("../controllers/pricingController");
const { api } = require("./utils/request");

describe("Pricing routes", () => {
  it("returns the full pricing list", async () => {
    const response = await api().get("/api/pricing").expect(200);
    expect(response.body).toEqual(pricingData);
  });

  it("fetches a single pricing item by id", async () => {
    const target = pricingData[0];
    const response = await api().get(`/api/pricing/${target.id}`).expect(200);
    expect(response.body).toEqual(target);
  });

  it("returns a 400 error when the pricing item does not exist", async () => {
    const response = await api().get("/api/pricing/999").expect(400);
    expect(response.body).toEqual({ success: false, error: "pricing item not found" });
  });

  it("returns a 400 error when no id is provided", async () => {
    const req = { params: {} };
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json: jest.fn(),
    };
    const next = jest.fn();

    await getPriceItem(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe("please provide an id");
  });
});
