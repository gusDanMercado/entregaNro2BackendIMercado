const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();

const pm = new ProductManager();

// GET / -> listar todos
router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:pid -> producto por id
router.get("/:pid", async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / -> agregar producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:pid -> actualizar (no se puede cambiar id)
router.put("/:pid", async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:pid -> eliminar
router.delete("/:pid", async (req, res) => {
  try {
    const ok = await pm.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
