import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteBudget, editBudget } from "../../utils/ApiRequest";
import axios from "axios";

const TableDatab = (props) => {
  const [show, setShow] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const handleEditClick = (itemKey) => {
    console.log("Clicked button ID:", itemKey);
    if (budgets.length > 0) {
      const editBudget = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingBudget(editBudget);
      handleShow();
    }
  };

  const handleEditSubmit = async (e) => {
    const { data } = await axios.put(`${editBudget}/${currId}`, {
      ...values,
    });

    if (data.success === true) {
      await handleClose();
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleDeleteClick = async (itemKey) => {
    console.log(user._id);
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);
    const { data } = await axios.post(`${deleteBudget}/${itemKey}`, {
      userId: props.user._id,
    });

    if (data.success === true) {
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const [values, setValues] = useState({
    startDate: "",
    endDate: "",
    categories: [],
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (index, e) => {
    const newCategories = values.categories.slice();
    newCategories[index][e.target.name] = e.target.value;
    setValues({ ...values, categories: newCategories });
  };

  const handleAddCategory = () => {
    setValues({
      ...values,
      categories: [...values.categories, { category: "", amount: "" }],
    });
  };

  const handleRemoveCategory = (index) => {
    const newCategories = values.categories.slice();
    newCategories.splice(index, 1);
    setValues({ ...values, categories: newCategories });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setUser(props.user);
    setBudgets(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container>
        <Table responsive="md" className="data-table">
          <thead>
            <h1>Budget Table</h1>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Categories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {props.data.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.startDate).format("YYYY-MM-DD")}</td>
                <td>{moment(item.endDate).format("YYYY-MM-DD")}</td>
                <td>
                  {item.categories.map((cat, idx) => (
                    <div key={idx}>
                      {cat.category}: {cat.amount}
                    </div>
                  ))}
                </td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                    {editingBudget ? (
                      <>
                        <div>
                          <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                              <Modal.Title>
                                Update Budget Details
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form onSubmit={handleEditSubmit}>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formStartDate"
                                >
                                  <Form.Label>Start Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={values.startDate}
                                    onChange={handleChange}
                                  />
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formEndDate"
                                >
                                  <Form.Label>End Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={values.endDate}
                                    onChange={handleChange}
                                  />
                                </Form.Group>

                                {values.categories.map((cat, idx) => (
                                  <div key={idx} className="category-item">
                                    <Form.Group
                                      className="mb-3"
                                      controlId={`formCategory${idx}`}
                                    >
                                      <Form.Label>Category</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="category"
                                        placeholder={editingBudget[0].categories[idx]?.category}
                                        value={cat.category}
                                        onChange={(e) =>
                                          handleCategoryChange(idx, e)
                                        }
                                      />
                                    </Form.Group>

                                    <Form.Group
                                      className="mb-3"
                                      controlId={`formAmount${idx}`}
                                    >
                                      <Form.Label>Amount</Form.Label>
                                      <Form.Control
                                        type="number"
                                        name="amount"
                                        placeholder={editingBudget[0].categories[idx]?.amount}
                                        value={cat.amount}
                                        onChange={(e) =>
                                          handleCategoryChange(idx, e)
                                        }
                                      />
                                    </Form.Group>

                                    <Button
                                      variant="danger"
                                      onClick={() => handleRemoveCategory(idx)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}

                                <Button
                                  variant="primary"
                                  onClick={handleAddCategory}
                                >
                                  Add Category
                                </Button>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="primary"
                                type="submit"
                                onClick={handleEditSubmit}
                              >
                                Submit
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default TableDatab;
