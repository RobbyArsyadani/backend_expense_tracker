const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let expenses = [{ id: 1, description: "makan siang", amount: 2000 }];

app.get("/", (req, res) => {
  res.json(expenses);
});

app.post("/post", (req, res) => {
  const newExpenses = { id: expenses.length + 1, ...req.body };
  expenses.push(newExpenses);
  res.status(201).json(expenses);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  const newExpenses = expenses.filter((data) => data.id !== Number(id));
  expenses = newExpenses;
  res.status(201).json(expenses);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  const numericID = Number(id);
  const index = expenses.findIndex((data) => data.id === numericID);

  if (index === -1) {
    res.status(404).send("Data tidak ditemukan");
  }
  expenses[index] = { ...expenses[index], ...req.body };
  res.status(201).json(expenses);
});

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

