const { CallTracker } = require("assert");
const express = require("express");
const { write } = require("fs");
const fs = require("fs/promises");
const { execPath } = require("process");
const app = express();
const port = 3000;

const filepath = "./utils/expenses.json";
app.use(express.json());

async function readExpenses() {
  try {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeExpenses(expenses) {
  await fs.writeFile(filepath, JSON.stringify(expenses, null, 2));
}

app.get("/", async (req, res) => {
  const expenses = await readExpenses();
  res.json(expenses);
});
app.post("/post", async (req, res) => {
  const expenses = await readExpenses();
  const newExpense = { id: expenses.length + 1, ...req.body };
  expenses.push(newExpense);
  await writeExpenses(expenses);
  res.status(201).json(expenses);
});
app.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readExpenses();
  const newExpenses = expenses.filter((data) => data.id !== id);
  await writeExpenses(newExpenses);
  res.status(200).json(newExpenses);
});

app.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readExpenses();
  const index = expenses.findIndex((data) => data.id === id);
  if (index === -1) {
    res.status(404).send("Data tidak ditemukan");
  }
  expenses[index] = { ...expenses[index], ...req.body };
  await writeExpenses(expenses);
  res.status(200).json(expenses);
});

app.listen(port, () => {
  console.log(`App berjalan di http://localhost:${port}`);
});

