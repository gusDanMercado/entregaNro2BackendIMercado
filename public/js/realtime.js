const socket = io();

// Renderizar lista
socket.on("products", (products) => {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> — $${p.price} 
      <button onclick="deleteProduct('${p.id}')">Eliminar</button>`;
    list.appendChild(li);
  });
});

// Agregar producto
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = Object.fromEntries(formData.entries());
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  socket.emit("newProduct", product);
  e.target.reset();
});

// Eliminar producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
