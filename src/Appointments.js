import React, { useState, useEffect } from 'react';
import './Appointments.css'; 

const Appointments = ({ goToDashboard }) => {
  // State to store appointments data
  const [appointments, setAppointments] = useState([]);
  // State to manage the visibility of the add appointment form
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  // State to store form data for adding a new appointment
  const [formData, setFormData] = useState({
    chassisNumber: '',
    action: '',
    day: '',
    hour: '',
    contactMethod: '',
    contactInfo: '',
    appointmentNumber: ''
  });
  // State to handle warning messages
  const [warning, setWarning] = useState('');

  useEffect(() => {
    // Fetch appointments data from the database or API
    fetchAppointments();
  }, []);

  // Function to fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Function to show the add appointment form
  const handleAddAppointment = () => {
    setShowAppointmentForm(true);
  };

  // Function to cancel adding a new appointment
  const handleCancelAddAppointment = () => {
    setShowAppointmentForm(false);
  };

  // Function to handle input changes in the appointment form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to validate appointment time
  const validateAppointmentTime = (time) => {
    const hours = parseInt(time.split(':')[0], 10);
    const minutes = parseInt(time.split(':')[1], 10);
    if (hours < 8 || hours > 17 || (minutes !== 0 && minutes !== 30)) {
      setWarning('The appointment schedule that you enter should be within the timeframe of 8:00 AM to 5:00 PM, with time slots available at intervals of either 30 minutes or hourly.');
      return false;
    }
    setWarning('');
    return true;
  };

  // Function to handle form submission for adding a new appointment
  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (validateAppointmentTime(formData.hour)) {
      try {
        const response = await fetch('http://localhost:3001/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chassisNumber: formData.chassisNumber,
            action: formData.action,
            day: formData.day,
            hour: formData.hour,
            contactMethod: formData.contactMethod,
            contactInfo: formData.contactInfo
          })
        });
        if (response.ok) {
          await fetchAppointments();
          setShowAppointmentForm(false);
          setFormData({
            chassisNumber: '',
            action: '',
            day: '',
            hour: '',
            contactMethod: '',
            contactInfo: ''
          });
        } else {
          console.error('Failed to add appointment:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding appointment:', error);
      }
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      <div className="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.id} className="appointment-entry">
            <p>Chassis Number: {appointment.chassisNumber}</p>
            <p>Day: {appointment.day}</p>
            <p>Hour: {appointment.hour}</p>
            <p>Action: {appointment.action}</p>
            <p>Appointment ID: {appointment.appointmentNumber}</p>
          </div>
        ))}
      </div>
      <button className="add-appointment-button" onClick={handleAddAppointment}>Add Appointment</button>
      <button className="go-back-button" onClick={goToDashboard}>Go Back</button>

      {/* Appointment form */}
      {showAppointmentForm && (
        <div className="appointment-form">
          <h3>Add Appointment</h3>
          <form onSubmit={handleSubmitAppointment}>

            <div className="form-group">
              <label htmlFor="chassisNumber">Chassis Number:</label>
              <input type="text" id="chassisNumber" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="action">Action:</label>
              <input type="text" id="action" name="action" value={formData.action} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentDay">Appointment Day:</label>
              <input type="text" id="appointmentDay" name="day" value={formData.day} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time:</label>
              <input type="text" id="appointmentTime" name="hour" value={formData.hour} onChange={handleChange} />
              {warning && <p style={{ color: 'red' }}>{warning}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="contactMethod">Contact Method:</label>
              <input type="text" id="contactMethod" name="contactMethod" value={formData.contactMethod} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="contactInfo">Contact Info:</label>
              <input type="text" id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelAddAppointment} style={{ backgroundColor: '#dc3545' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Appointments;
