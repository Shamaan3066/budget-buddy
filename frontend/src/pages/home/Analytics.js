import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
// import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import randomColor from "randomcolor";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'; // Import axios for making HTTP requests
import { getBudgetUrl } from "../../utils/ApiRequest";

const Analytics = ({ transactions, budgets }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [colors, setColors] = useState({});
  const [budgetCategories, setBudgetCategories] = useState({});

  const generateRandomColor = () => {
    let color;
    do {
      color = randomColor();
    } while (color.toLowerCase().includes("ff0000") || color.toLowerCase().includes("00ff00")); // Exclude shades of red and green
    return color;
  };

  useEffect(() => {
    // Fetch budget data from the backend
    const fetchBudget = async () => {
      try {
        const response = await axios.post(`${getBudgetUrl}`, { userId: user._id });
        const { success, budgets } = response.data;
        // console.log(budgets); // Log budgets array
        if (success && budgets && budgets.length > 0) {
          // Extract category names and amounts from the budget documents
          const categories = budgets.reduce((acc, budget) => {
            if (budget.categories) {
              budget.categories.forEach(category => {
                acc[category.category] = category.amount;
              });
            }
            return acc;
          }, {});
          setBudgetCategories(categories);
        } else {
          console.error('No budgets found');
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
      }
    };

    fetchBudget();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const categories = transactions.map(transaction => transaction.category);
    const uniqueCategories = [...new Set(categories)];

    const newColors = uniqueCategories.reduce((acc, category) => {
      acc[category] = generateRandomColor();
      return acc;
    }, {});

    setColors(newColors);
  }, [transactions]);

  // const TotalTransactions = transactions.length;
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  // let totalExpensePercent =
  //   (totalExpenseTransactions.length / TotalTransactions) * 100;

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  // const totalTurnOverExpense = transactions
  //   .filter((item) => item.transactionType === "expense")
  //   .reduce((acc, transaction) => acc + transaction.amount, 0);

  // const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

  const categories = [
    ...new Set(transactions.map(transaction => transaction.category))
  ];

  // Data for pie charts
  const expenseData = categories.map(category => ({
    name: category,
    value: transactions
      .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0),
  }));

  // Data for bar charts
  const barData = categories.map(category => {
    const expenses = transactions
      .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const budget = budgetCategories[category] || 0;
    const overBudget = expenses > budget;

    return {
      category,
      expenses,
      budget,
      overBudget
    };
  });

  return (
    <Container className="mt-5">
      <Row>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>No of Transactions:</span>
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "red" }}>
                Budget: <ArrowDropDownIcon />{budgets.length}
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon />{totalExpenseTransactions.length}
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Total Expense: <ArrowDropDownIcon />{totalTurnOver}
              </h5>
              {/* <div className="d-flex justify-content-center mt-4 mb-2">
                <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="red" />
              </div> */}
            </div>
          </div>
        </div>

        {/* <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Total Expense:</span> {totalTurnOver}
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon />{totalTurnOverExpense} <CurrencyRupeeIcon />
              </h5>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <CircularProgressBar percentage={TurnOverExpensePercent.toFixed(0)} color="red" />
              </div>
            </div>
          </div>
        </div> */}

        <div className="col-lg-4 col-md-6 mb-4">
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
                const budget = budgetCategories[category] || 0;
                const overBudget = expenses > budget;

                return (
                  expenses > 0 && (
                    <LineProgressBar key={category} label={category} percentage={expensePercent.toFixed(0)} lineColor={overBudget ? "red" : colors[category]} />
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Budget</span>
            </div>
            <div className="card-body">
              {Object.keys(budgetCategories).map(category => {
                const budget = budgetCategories[category];
                return (
                  budget > 0 && (
                    <div key={category} className="mb-2">
                      <span style={{ color: colors[category], fontWeight: 'bold' }}>{category}:</span> {budget} <CurrencyRupeeIcon />
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Expense Distribution</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Expense vs Budget</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="red" />
                  <Bar dataKey="budget" fill="blue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </Row>
    </Container>
  );
};

export default Analytics;
