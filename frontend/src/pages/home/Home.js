import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransaction, getBudgetUrl, getTransactions, addBudget } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import GeminiAI from "./GeminiAI";
import TableDatab from "./TableDatab";

const Home = () => {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [showb, setshowb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const getBudget = async () => {
    try {
      const datab = await axios.post(getBudgetUrl, { userId: user._id });
      const { budgets } = datab.data; // Extract budgets array from response
      setBudgets(budgets);
    } catch (err) {
      console.error('Error while fetching budgets:', err);
    }
  };

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseb = () => setshowb(false);
  const handleshowb = () => setshowb(true);

  useEffect(() => {
    const firstLog = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    firstLog();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "expense",
    customCategory: "",
  });


  const [bvalues, setbvalues] = useState({
    amount: "",
    category: "",
    endDate: "",
    startDate: "",
    customCategory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "category" && value === "Other") {
      setIsCustomCategory(true);
    } else if (name === "category") {
      setIsCustomCategory(false);
    }
    
    setValues({ ...values, [name]: value });
  };
  

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const HandleChangeb = (e) => {
    const { name, value } = e.target;

    if (name === "category" && value === "Other") {
      setIsCustomCategory(true);
    } else if (name === "category") {
      setIsCustomCategory(false);
    }

    setbvalues({ ...bvalues, [name]: value });
  };

  // const HandleChangebFrequency = (e) => {
  //   setFrequency(e.target.value);
  // };

  // const handleSetType = (e) => {
  //   setType(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { title, amount, description, category, date, transactionType, customCategory } = values;
  
    if (!title || !amount || !description || (!category && !customCategory) || !date || !transactionType) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
  
    setLoading(true);
  
    const selectedCategory = category === "Other" ? customCategory : category;
  
    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description,
      category: selectedCategory,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });
  
    if (data.success) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }
  
    setLoading(false);
  };

  const handleSubmitb = async (e) => {
    e.preventDefault();

    const { amount, category, endDate, startDate, customCategory } = bvalues;

    if (!amount || !endDate || (!category && !customCategory) || !startDate) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }

    setLoading(true);

    const selectedCategory = category === "Other" ? customCategory : category;

    const { data } = await axios.post(addBudget, {
      amount: amount,
      startDate: startDate,
      categories: [{
        category: selectedCategory,
        amount: amount
      }
       ],
      endDate: endDate,
      userId: cUser._id,
    });

    if (data.success) {
      toast.success(data.message, toastOptions);
      handleCloseb();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };
  

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };


  


  useEffect(() => {

    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        // console.log(cUser._id, frequency, startDate, endDate, type);

        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });
        // console.log(data);
  
        setTransactions(data.transactions);
  
        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    getBudget();
    fetchAllTransactions();
    // eslint-disable-next-line
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{ position: "relative", zIndex: "2 !important" }}
            className="mt-3"
          >
            <div className="filterRow">
              <div className="text-white">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* <div className="text-white type">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={type}
                    onChange={handleSetType}
                  >
                    <option value="all">All</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Earned</option>
                  </Form.Select>
                </Form.Group>
              </div> */}

              <div className="text-white iconBtnBox">
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={`${
                    view === "table" ? "iconActive" : "iconDeactive"
                  }`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleChartClick}
                  className={`${
                    view === "chart" ? "iconActive" : "iconDeactive"
                  }`}
                />
              </div>

              <div>
                <Button onClick={handleShow} className="addNew">
                  Add New
                </Button>
                <Button onClick={handleShow} className="mobileBtn">
                  +
                </Button>
                <Modal show={show} onHide={handleClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Transaction Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          type="text"
          placeholder="Enter Transaction Name"
          value={values.title}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          name="amount"
          type="number"
          placeholder="Enter your Amount"
          value={values.amount}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSelect">
        <Form.Label>Budget Category</Form.Label>
        <Form.Select
          name="category"
          value={values.category}
          onChange={handleChange}
        >
          <option value="" onClick={getBudget}>Choose...</option>
          {budgets.flatMap(budget => budget.categories.map(category => (
            <option key={category._id} value={category.category}>
              {category.category}
            </option>
          )))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          placeholder="Enter Description"
          value={values.description}
          onChange={handleChange}
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formSelect1">
        <Form.Label>Transaction Type</Form.Label>
        <Form.Select
          name="transactionType"
          value={values.transactionType}
          onChange={handleChange}
        >
          <option value="">Choose...</option>
          <option value="credit">Income</option>
          <option value="expense">Expense</option>
        </Form.Select>
      </Form.Group> */}

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Submit
    </Button>
  </Modal.Footer>
</Modal>
<Button onClick={handleshowb} className="setBudget" style={{ marginLeft: '10px' }}>
                  Set Budget
                </Button>
                <Button onClick={handleshowb} className="mobileBtn">
                  +
                </Button>
                <Modal show={showb} onHide={handleCloseb} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Budget Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your Amount"
                          value={bvalues.amount}
                          onChange={HandleChangeb}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={bvalues.category}
                          onChange={HandleChangeb}
                        >
                          <option value="">Choose...</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Rent">Rent</option>
                          <option value="Salary">Salary</option>
                          <option value="Tip">Tip</option>
                          <option value="Food">Food</option>
                          <option value="Medical">Medical</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      {isCustomCategory && (
                        <Form.Group className="mb-3" controlId="formCustomCategory">
                          <Form.Label>Custom Category</Form.Label>
                          <Form.Control
                            type="text"
                            name="customCategory"
                            placeholder="Enter your custom category"
                            value={bvalues.customCategory}
                            onChange={HandleChangeb}
                          />
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Start Date</Form.Label>
                        <DatePicker
                          selected={bvalues.startDate}
                          onChange={(date) => setbvalues({ ...bvalues, startDate: date })}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>End Date</Form.Label>
                        <DatePicker
                          selected={bvalues.endDate}
                          onChange={(date) => setbvalues({ ...bvalues, endDate: date })}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseb}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmitb}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="containerBtn">
              <Button variant="primary" onClick={handleReset}>
                Reset Filter
              </Button>
            </div>
            {view === "table" ? (
              <>
                <TableData data={transactions} user={cUser} />
                <TableDatab data={budgets} user={cUser} />
              </>
            ) : (
              <>
                <Analytics transactions={transactions} budgets={budgets} user={cUser} />
                <GeminiAI transactions={transactions} budgets={budgets} loading={loading}/>
              </>
            )}
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;