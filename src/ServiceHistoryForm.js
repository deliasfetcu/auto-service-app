import React, { useState } from 'react';
import './ServiceHistory.css'; 

const ServiceHistoryForm = ({ onSubmit, onCancel }) => {
  // State to store form data
  const [formData, setFormData] = useState({
    appointmentId: '',
    actionType: '',
    description: '',
    repairDuration: ''
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data here
    onSubmit(formData);
  };

  return (
    <div className="service-history-form-container">
      <h3>Add Service Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Appointment ID:</label>
          <input type="text" name="appointmentId" value={formData.appointmentId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Action Type:</label>
          <input type="text" name="actionType" value={formData.actionType} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Repair Duration:</label>
          <input type="number" name="repairDuration" value={formData.repairDuration} onChange={handleChange} />
        </div>
        <div className="button-group">
          <button type="submit">Submit</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ServiceHistoryForm;
