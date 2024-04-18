import React, { useState } from 'react';
import Clients from './Clients';
import Cars from './Cars';
import Appointments from './Appointments';
import ServiceHistory from './ServiceHistory';
import DeactivatedClients from './DeactivatedClients'; // Import the new component
import './Dashboard.css'; 

const Dashboard = () => {
  // State to track current page
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to navigate back to dashboard
  const goToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Function to render different pages based on current page state
  const renderPage = () => {
    switch (currentPage) {
      case 'clients':
        return <Clients goToDashboard={goToDashboard} />;
      case 'cars':
        return <Cars goToDashboard={goToDashboard} />;
      case 'appointments':
        return <Appointments goToDashboard={goToDashboard} />;
      case 'appointmentsHistory':
        return <ServiceHistory goToDashboard={goToDashboard} />;
      case 'deactivatedClients': // Add case for deactivated clients
        return <DeactivatedClients goToDashboard={goToDashboard} />; // Render DeactivatedClients component
      default:
        return (
          <div className="background">
            <div className="dashboard-container">
              <h1>Auto Service App</h1>
              <div className="button-container">
                <button className="dashboard-button" onClick={() => handlePageChange('clients')}>
                  Clients
                </button>
                <button className="dashboard-button" onClick={() => handlePageChange('cars')}>
                  Cars
                </button>
                <button className="dashboard-button" onClick={() => handlePageChange('appointments')}>
                  Appointments
                </button>
                <button className="dashboard-button" onClick={() => handlePageChange('appointmentsHistory')}>
                  Appointments History
                </button>
                <button className="dashboard-button" onClick={() => handlePageChange('deactivatedClients')}> {/* Add button to navigate to deactivated clients */}
                  Deactivated Clients
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPage();
};

export default Dashboard;
