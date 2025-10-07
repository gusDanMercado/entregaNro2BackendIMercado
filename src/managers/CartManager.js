const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class CartManager {
  constructor(filename = "carts.json") {
    this.path = path.resolve(__dirname, "../../data", filename);
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (err) {
      if (err.code === "ENOENT") {
        await this._writeFile([]);
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const idx = carts.findIndex((c) => String(c.id) === String(cartId));
    if (idx === -1) return null;

    const productEntryIdx = carts[idx].products.findIndex(
      (p) => String(p.product) === String(productId)
    );
    if (productEntryIdx === -1) {
      carts[idx].products.push({ product: String(productId), quantity: 1 });
    } else {
      carts[idx].products[productEntryIdx].quantity += 1;
    }

    await this._writeFile(carts);
    return carts[idx];
  }
}

module.exports = CartManager;
