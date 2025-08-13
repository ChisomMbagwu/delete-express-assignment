const groceryDB = require("./db/products.json");
const writeFile = require("./helper/WriteFile");
const express = require("express");
const { v4: uuid } = require("uuid");
const PORT = 8000;
const app = express();

app.use(express.json());

app.post("/create-grocery", async (req, res) => {
  const { storeName, goods, unitPrice, quantity } = req.body;

  if (!storeName) {
    return res.status(400).json({ message: "Please enter store name" });
  }
  if (!goods) {
    return res.status(400).json({ message: "Please enter goods name" });
  }
  if (!unitPrice) {
    return res.status(400).json({ message: "Please enter unit price" });
  }
  if (!(quantity > -1)) {
    return res.status(400).json({ message: "Please enter quantity" });
  }

  const qtyNumber = parseFloat(quantity) || 0;
  const priceNumber = parseFloat(unitPrice) || 0;

  const totalPrice = (qtyNumber * priceNumber).toFixed(2);
  const isAvailable = qtyNumber > 0;

  const grocery = {
    id: uuid(),
    storeName,
    goods,
    unitPrice: parseFloat(unitPrice).toFixed(2),
    quantity,
    totalPrice,
    isAvailable,
  };

  groceryDB.push(grocery);
  await writeFile(groceryDB);

  res.status(201).json({
    message: "Grocery item created successfully",
    data: grocery,
  });
});

app.get("/all-groceries", (req, res) => {
  if (groceryDB.length === 0) {
    return res.status(404).json({ message: "No groceries found" });
  }

  res.status(200).json({
    message: "All grocery items",
    total: groceryDB.length,
    data: groceryDB,
  });
});

app.get("/grocery/:id", (req, res) => {
  const { id } = req.params;
  const grocery = groceryDB.find((item) => item.id === id);

  if (!grocery) {
    return res.status(404).json({ message: "Grocery item not found" });
  }

  res.status(200).json({
    message: "Grocery item found",
    data: grocery,
  });
});

app.put("/update-grocery/:id", async (req, res) => {
  const { storeName, goods, unitPrice, quantity } = req.body;
  const { id } = req.params;

  const grocery = groceryDB.find((item) => item.id === id);
  if (!grocery) {
    return res.status(404).json({ message: "Grocery item not found" });
  }

  const qtyNumber = quantity !== undefined ? parseFloat(quantity) : grocery.quantity;
  const priceNumber = unitPrice !== undefined ? parseFloat(unitPrice) : grocery.unitPrice;

  const totalPrice = (qtyNumber * priceNumber).toFixed(2);
  const isAvailable = qtyNumber > 0;

  const updatedGrocery = {
    ...grocery,
    storeName: storeName ?? grocery.storeName,
    goods: goods ?? grocery.goods,
    unitPrice: priceNumber.toFixed(2),
    quantity: qtyNumber,
    totalPrice,
    isAvailable,
  };

  const index = groceryDB.findIndex((item) => item.id === id);
  groceryDB[index] = updatedGrocery;
  await writeFile(groceryDB);

  res.status(200).json({
    message: "Grocery item updated successfully",
    data: updatedGrocery,
  });
});

app.delete("/delete-grocery/:id", async (req, res) => {
  const { id } = req.params;
  const index = groceryDB.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Grocery item not found" });
  }

  const deletedGrocery = groceryDB.splice(index, 1)[0];
  await writeFile(groceryDB);

  res.status(200).json({
    message: "Grocery item deleted successfully",
    data: deletedGrocery,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});