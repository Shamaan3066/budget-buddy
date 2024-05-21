import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import randomColor from "randomcolor";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Analytics = ({ transactions }) => {
  const [colors, setColors] = useState({});

  const generateRandomColor = () => {
    let color;
    do {
      color = randomColor();
    } while (color.toLowerCase().includes("ff0000") || color.toLowerCase().includes("00ff00")); // Exclude shades of red and green
    return color;
  };

  useEffect(() => {
    const categories = transactions.map(transaction => transaction.category);
    const uniqueCategories = [...new Set(categories)];

    const newColors = uniqueCategories.reduce((acc, category) => {
      acc[category] = generateRandomColor();
      return acc;
    }, {});

    setColors(newColors);
  }, [transactions]);

  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;
  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = (totalTurnOverIncome / totalTurnOver) * 100;
  const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

  const categories = [
    ...new Set(transactions.map(transaction => transaction.category))
  ];

  // Data for pie charts
  const incomeData = categories.map(category => ({
    name: category,
    value: transactions
      .filter(transaction => transaction.transactionType === "credit" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0),
  }));

  const expenseData = categories.map(category => ({
    name: category,
    value: transactions
      .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0),
  }));

  // Data for bar charts
  const barData = categories.map(category => {
    const income = transactions
      .filter(transaction => transaction.transactionType === "credit" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const expenses = transactions
      .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    return {
      category,
      income,
      expenses,
    };
  });

  return (
    <Container className="mt-5">
      <Row>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Total Transactions:</span> {TotalTransactions}
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "green" }}>
                Income: <ArrowDropUpIcon />{totalIncomeTransactions.length}
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon />{totalExpenseTransactions.length}
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar percentage={totalIncomePercent.toFixed(0)} color="green" />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-2">
                <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="red" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Total TurnOver:</span> {totalTurnOver}
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "green" }}>
                Income: <ArrowDropUpIcon /> {totalTurnOverIncome} <CurrencyRupeeIcon />
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon />{totalTurnOverExpense} <CurrencyRupeeIcon />
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar percentage={TurnOverIncomePercent.toFixed(0)} color="green" />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <CircularProgressBar percentage={TurnOverExpensePercent.toFixed(0)} color="red" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Income</span>
            </div>
            <div className="card-body">
              {categories.map(category => {
                const income = transactions
                  .filter(transaction => transaction.transactionType === "credit" && transaction.category === category)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

                const incomePercent = (income / totalTurnOver) * 100;

                return (
                  income > 0 && (
                    <LineProgressBar key={category} label={category} percentage={incomePercent.toFixed(0)} lineColor={colors[category]} />
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Expense</span>
            </div>
            <div className="card-body">
              {categories.map(category => {
                const expenses = transactions
                  .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

                const expensePercent = (expenses / totalTurnOver) * 100;

                return (
                  expenses > 0 && (
                    <LineProgressBar key={category} label={category} percentage={expensePercent.toFixed(0)} lineColor={colors[category]} />
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Income Distribution</span>
            </div>
            <div className="card-body">
              <PieChart width={400} height={400}>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Expense Distribution</span>
            </div>
            <div className="card-body">
              <PieChart width={400} height={400}>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Income vs Expense</span>
            </div>
            <div className="card-body">
              <BarChart width={800} height={400} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="green" />
                <Bar dataKey="expenses" fill="red" />
              </BarChart>
            </div>
          </div>
        </div>

      </Row>
    </Container>
  );
};

export default Analytics;
