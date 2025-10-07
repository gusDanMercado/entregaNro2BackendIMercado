const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const exphbs = require("express-handlebars");
const path = require("path");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const ProductManager = require("./managers/ProductManager");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const pm = new ProductManager();
const PORT = process.env.PORT || 8081; //original 8080

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Configurar Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WebSocket
io.on("connection", async (socket) => {
  console.log("Cliente conectado vía WebSocket");

  // Enviar lista inicial de productos
  const products = await pm.getProducts();
  socket.emit("products", products);

  // Escuchar creación de producto desde cliente
  socket.on("newProduct", async (data) => {
    await pm.addProduct(data);
    const updated = await pm.getProducts();
    io.emit("products", updated); // emitir a todos los clientes
  });

  // Escuchar eliminación de producto
  socket.on("deleteProduct", async (id) => {
    await pm.deleteProduct(id);
    const updated = await pm.getProducts();
    io.emit("products", updated);
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
