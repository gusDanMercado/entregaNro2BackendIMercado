const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();

const pm = new ProductManager();

// home → muestra todos los productos (versión “no realtime”)
router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products });
});

// realtime → versión dinámica con websockets
router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
