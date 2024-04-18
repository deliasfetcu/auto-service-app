import React, { useState, useEffect } from 'react';
import './ServiceHistory.css'; 
import ServiceHistoryForm from './ServiceHistoryForm'; 

const ServiceHistory = ({ goToDashboard }) => {
  // State to store service history data
  const [serviceHistory, setServiceHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch service history data from the database or API
    fetch('http://localhost:3001/api/service-histories')
      .then(response => response.json())
      .then(data => {
        setServiceHistory(data);
      })
      .catch(error => console.error('Error fetching service history:', error));
  }, []);

  // Function to update service history record in the database
  const updateServiceHistory = async (serviceHistoryId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/service-histories/${serviceHistoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update service history');
      }
  
      const updatedRecord = await response.json();
      return updatedRecord;
    } catch (error) {
      console.error('Error updating service history:', error);
      throw error;
    }
  };

  // Function to create a new service history record in the database
  const handleCreateServiceHistory = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/service-histories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create service history record');
      }
  
      const newRecord = await response.json();
  
      // Update service history state by appending the new record
      setServiceHistory(prevServiceHistory => [...prevServiceHistory, newRecord]);
  
      // Show a success message or perform any other action
      console.log('New service history record added successfully:', newRecord);
    } catch (error) {
      console.error('Error creating service history record:', error);
    }
  };

  // Function to handle the click event when adding a new record
  const handleAddRecord = () => {
    setShowForm(true);
  };

  // Function to handle the click event when cancelling adding a record
  const handleCancel = () => {
    setShowForm(false);
  };

  // Function to handle form submission
  const handleSubmit = (formData) => {
    handleCreateServiceHistory(formData);
    console.log('Form data submitted:', formData);
    setShowForm(false);
  };

  return (
    <div className="service-history-container">
      <h2>Service History</h2>
      <div className="service-history-list">
        {serviceHistory.map(entry => (
          <div key={entry._id} className="service-history-entry">
            <p>Action: {entry.actionType}</p>
            <p>Type of service: {entry.description}</p>
            <p>Duration: {entry.repairDuration}</p>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button className="add-record-button" onClick={handleAddRecord}>Add Record</button>
        <button className="go-back-button" onClick={goToDashboard}>Go Back</button>
      </div>
      {showForm && <ServiceHistoryForm onSubmit={handleSubmit} onCancel={handleCancel} />}
    </div>
  );
};

export default ServiceHistory;
