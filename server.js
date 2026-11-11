import express from "express";

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 13},
  { id: 3, nombre: "Camara", precio: 120000, stock: 2 },
];

let siguienteId = 4;

app.get("/products", (req, res) => {
  res.status(200).json(productos);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No Existe" });
  res.status(200).json(producto);
});

app.listen(3000, () => {
  console.log("Servidor listo");
});

app.post("/products", (req, res) => {
  const {nombre, precio, stock = 0} = req.body;
  if (!nombre|| precio === undefined){
    return res.status(400).json({error: "Faltan datos"});
  }
  const nuevo = { id: siguienteId++, nombre, precio, stock};
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({ error: "No Existe" });

  const { nombre, precio, stock } = req.body;
  if (!nombre || precio === undefined || stock === undefined || precio < 0 || stock < 0) {
    return res.status(400).json({ error: "Faltan datos o no son válidos" });
  }
  productos[i] = { id, nombre, precio, stock };
  res.status(200).json(productos[i]);
});

app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({ error: "No Existe" });

  const { nombre, precio, stock } = req.body;
  if (
    (nombre !== undefined && !nombre) ||
    (precio !== undefined && precio < 0) ||
    (stock !== undefined && stock < 0)
  ) {
    return res.status(400).json({ error: "Datos no válidos" });
  }
  if (nombre !== undefined) productos[i].nombre = nombre;
  if (precio !== undefined) productos[i].precio = precio;
  if (stock !== undefined) productos[i].stock = stock;
  res.status(200).json(productos[i]);
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({error: "No Existe"});
  productos.splice(i, 1);
  res.status(204).end()
});