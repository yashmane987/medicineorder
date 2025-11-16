import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderList, setOrderList] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [editId, setEditId] = useState(null);
  const [isOrderSaved, setIsOrderSaved] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/medicines`)
      .then((res) => setMedicines(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add Medicine to DB
  const handleAddMedicine = () => {
    if (!newMedicine.trim()) {
      toast.error("Medicine name cannot be empty");
      return;
    }

    axios
      .post(`${API_BASE}/api/medicines`, { name: newMedicine })
      .then((res) => {
        setMedicines([...medicines, res.data]);
        setNewMedicine("");
        toast.success("Medicine added");
      });
  };

  // Update medicine
  const handleUpdateMedicine = (id, name) => {
    setEditId(id);
    setNewMedicine(name);
  };

  const saveUpdateMedicine = () => {
    if (!newMedicine.trim()) {
      toast.error("Medicine name cannot be empty");
      return;
    }

    axios
      .put(`${API_BASE}/api/medicines/${editId}`, { name: newMedicine })
      .then((res) => {
        setMedicines(medicines.map((m) => (m._id === editId ? res.data : m)));
        setEditId(null);
        setNewMedicine("");
        toast.success("Medicine updated");
      });
  };

  // Delete medicine
  const handleDeleteMedicine = (id) => {
    axios.delete(`${API_BASE}/api/medicines/${id}`).then(() => {
      setMedicines(medicines.filter((m) => m._id !== id));
      toast.success("Medicine deleted");
    });
  };

  
  const addMedicine = () => {
    if (!selectedMedicine) {
      toast.error("Please select a medicine");
      return;
    }

    setOrderList([...orderList, { name: selectedMedicine, quantity }]);
    setSelectedMedicine("");
    setQuantity(1);
    setIsOrderSaved(false);
    toast.success("Medicine added successfully");
  };

  // Save Order
  const saveOrder = () => {
    if (orderList.length === 0) {
      toast.error("Add at least one medicine before saving");
      return;
    }

    axios
      .post(`${API_BASE}/api/orders`, { medicines: orderList })
      .then(() => {
        toast.success("Order Saved Successfully");
        setIsOrderSaved(true); // order saved
      })
      .catch((err) => console.error(err));
  };

  // Print Order
  const printOrder = () => {
  if (orderList.length === 0) {
    toast.error("No medicines added! Please add medicine first.");
    return;
  }

  if (!isOrderSaved) {
    toast.error("Please save the order before printing");
    return;
  }

  window.print();

  setOrderList([]);
  setSelectedMedicine("");
  setQuantity(1);
  setIsOrderSaved(false);

  toast.success("Ready for a new order!");
};

  return (
    <div className="container mt-4">
      {/* Print form */}
      <div className="print-area">
        <h2 className="mb-3 text-center">
          Medicine Order by :{" "}
          <span className="text-primary">Dr. Abhishek Shelke</span>
        </h2>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button section */}
      <div className="no-print">
        <div className="row g-2">
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
            >
              <option value="">Select Medicine</option>
              {medicines.map((med, i) => (
                <option key={i} value={med.name}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <button className="btn btn-primary me-2" onClick={addMedicine}>
              Add
            </button>

            <button className="btn btn-success me-2" onClick={saveOrder}>
              Save
            </button>

            <button className="btn btn-warning" onClick={printOrder}>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Manage  Medicine */}
      <div className="mt-4">
        <h3>Manage Medicines</h3>
        <div className="d-flex mb-2">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Medicine name"
            value={newMedicine}
            onChange={(e) => setNewMedicine(e.target.value)}
          />

          {editId ? (
            <button className="btn btn-warning" onClick={saveUpdateMedicine}>
              Update
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleAddMedicine}>
              Add
            </button>
          )}
        </div>

        <ul className="list-group">
          {medicines.map((med) => (
            <li
              key={med._id}
              className="list-group-item d-flex justify-content-between"
            >
              {med.name}
              <div>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleUpdateMedicine(med._id, med.name)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteMedicine(med._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}
