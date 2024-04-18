import React, { useState, useEffect } from 'react';
import './Cars.css'; 

const Cars = ({ goToDashboard }) => {
  // State to store cars data
  const [cars, setCars] = useState([]);
  // State to manage the visibility of the add car form
  const [showCarForm, setShowCarForm] = useState(false);
  // State to store data of the new car being added
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    registrationNumber: '',
    engineCapacity: '',
    horsepower: '',
    kilowatts: '',
    engineType: '',
    chassisNumber: '',
    email: '' // Add email field for the car
  });

  useEffect(() => {
    // Fetch cars data from the database or API
    fetch('http://localhost:3001/api/cars') // Replace with your API endpoint
      .then(response => response.json())
      .then(async (data) => {
        setCars(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  // Function to handle input change in the add car form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to show the add car form
  const handleAddCar = () => {
    setShowCarForm(true);
  };

  // Function to cancel adding a new car
  const handleCancelAddCar = () => {
    setShowCarForm(false);
  };

  // Function to save the new car to the database
  const handleSaveCar = async () => {
    try {
      // Send new car data to the backend API
      const response = await fetch('http://localhost:3001/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
      });
      if (response.ok) {
        // If successful, fetch updated list of cars and hide the form
        const updatedCarsResponse = await fetch('http://localhost:3001/api/cars');
        const updatedCarsData = await updatedCarsResponse.json();
        setCars(updatedCarsData);
        setShowCarForm(false);
        // Reset form fields
        setNewCar({
          make: '',
          model: '',
          year: '',
          registrationNumber: '',
          engineCapacity: '',
          horsepower: '',
          kilowatts: '',
          engineType: '',
          email: '' // Reset email field
        });
      } else {
        // Handle form submission error
        console.error('Failed to save car');
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  return (
    <div className="cars-container">
      <h2>Cars</h2>
      <div className="cars-list">
        {cars.map(car => (
          <div key={car.email} className="car-entry">
            <p>Make: {car.make}</p>
            <p>Model: {car.model}</p>
            <p>Year: {car.year}</p>
            <p>Email: {car.email}</p> {/* Display car's email */}
            <p>Registration Number: {car.registrationNumber}</p>
            <p>Engine Capacity: {car.engineCapacity}</p>
            <p>Horsepower: {car.horsepower}</p>
            <p>Kilowatts: {car.kilowatts}</p>
            <p>Engine Type: {car.engineType}</p>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button className="add-car-button" onClick={handleAddCar}>Add Car</button>
        <button className="go-back-button" onClick={goToDashboard}>Go Back</button>
      </div>
      {showCarForm && (
        <div className="client-form">
          <h3>Add Car</h3>
          <div className="form-group">
            <label htmlFor="make">Make:</label>
            <input type="text" id="make" name="make" value={newCar.make} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model:</label>
            <input type="text" id="model" name="model" value={newCar.model} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <input type="text" id="year" name="year" value={newCar.year} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="registrationNumber">Registration Number:</label>
            <input type="text" id="registrationNumber" name="registrationNumber" value={newCar.registrationNumber} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="engineCapacity">Engine Capacity:</label>
            <input type="text" id="engineCapacity" name="engineCapacity" value={newCar.engineCapacity} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="horsepower">Horsepower:</label>
            <input type="text" id="horsepower" name="horsepower" value={newCar.horsepower} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="kilowatts">Kilowatts:</label>
            <input type="text" id="kilowatts" name="kilowatts" value={newCar.kilowatts} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="engineType">Engine Type:</label>
            <input type="text" id="engineType" name="engineType" value={newCar.engineType} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="chassisNumber">Chassis Number:</label>
            <input type="text" id="chassisNumber" name="chassisNumber" value={newCar.chassisNumber} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Client Email:</label> {/* Change label to "Car Email" */}
            <input type="text" id="email" name="email" value={newCar.email} onChange={handleInputChange} />
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSaveCar}>Save</button>
            <button className="cancel-button" onClick={handleCancelAddCar}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
