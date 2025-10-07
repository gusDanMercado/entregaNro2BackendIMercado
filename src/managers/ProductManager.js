const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor(filename = "products.json") {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(productData) {
    const products = await this._readFile();

    // Validaciones básicas
    const required = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of required) {
      if (productData[field] === undefined) {
        throw new Error(`Falta el campo requerido: ${field}`);
      }
    }

    // Generar id único (UUID) para evitar colisiones
    const newProduct = {
      id: uuidv4(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status:
        productData.status !== undefined ? Boolean(productData.status) : true,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: Array.isArray(productData.thumbnails)
        ? productData.thumbnails
        : [],
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    // No permitir cambiar id
    const { id: _ignore, ...rest } = updates;
    products[idx] = { ...products[idx], ...rest };
    await this._writeFile(products);
    return products[idx];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;
