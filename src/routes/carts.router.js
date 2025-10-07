const express = require("express");
const CartManager = require("../managers/CartManager");
const router = express.Router();

const cm = new CartManager();

// POST / -> crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:cid -> listar productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:cid/product/:pid -> agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cm.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    if (!updatedCart)
      return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
