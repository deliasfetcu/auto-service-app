import React, { useState, useEffect } from 'react';
import './Clients.css'; 
import ClientForm from './ClientForm'; 

const DeactivatedClients = ({ goToDashboard }) => {
  // State to store clients data
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [deactivatedClients, setDeactivatedClients] = useState([]);
  const [showDeactivatedClients, setShowDeactivatedClients] = useState(false);
  const [currentPage, setCurrentPage] = useState('clients');

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to navigate to clients page
  const goToClients = () => {
    setCurrentPage('clients');
  };

  // Fetch deactivated clients data from the backend
  useEffect(() => {
    fetch('http://localhost:3001/api/clients')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, [refreshFlag]);

  // Function to show deactivated clients
  const handleGoToDeactivatedClients = () => {
    setShowDeactivatedClients(true);
  };

  // Function to handle editing client details
  const handleEdit = (clientId) => {
    setEditingClientId(clientId);
  };

  // Function to deactivate a client
  const handleDeactivate = (clientId) => {
    fetch(`http://localhost:3001/api/clients/${clientId}/deactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
    .then(response => {
      if (response.ok) {
        console.log('Client deactivated successfully');
        toggleRefresh();
      } else {
        console.error('Failed to deactivate client');
      }
    })
    .catch(error => {
      console.error('Error deactivating client:', error);
    });
  };

  // Function to handle input changes for client details
  const handleInputChange = (clientId, field, value) => {
    setClients(prevClients => prevClients.map(client => {
      if (client._id === clientId) {
        return { ...client, [field]: value };
      }
      return client;
    }));
  };

  // Function to activate a client
  const handleActivate = (clientId) => {
    fetch(`http://localhost:3001/api/clients/${clientId}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
    .then(response => {
      if (response.ok) {
        console.log('Client activated successfully');
        toggleRefresh();
      } else {
        console.error('Failed to activate client');
      }
    })
    .catch(error => {
      console.error('Error activating client:', error);
    });
  };

  // Function to toggle refresh flag
  const toggleRefresh = () => {
    setRefreshFlag(prevFlag => !prevFlag);
  };
  
  return (
    <div className="clients-container">
      <h2>Deactivated Clients</h2>
      <div className="clients-list">
        {clients
          .filter(client => client.isActive === false) 
          .map(client => (
            <div key={client._id} className="client-entry">
              <div className="client-info">
                {editingClientId === client._id ? (
                  <div className="client-editing">
                    <input
                      type="text"
                      value={client.firstName}
                      onChange={e => handleInputChange(client._id, 'firstName', e.target.value)}
                    />
                    <input
                      type="text"
                      value={client.lastName}
                      onChange={e => handleInputChange(client._id, 'lastName', e.target.value)}
                    />
                    <input
                      type="text"
                      value={client.phoneNumbers}
                      onChange={e => handleInputChange(client._id, 'phoneNumbers', e.target.value)}
                    />
                    <input
                      type="text"
                      value={client.email}
                      onChange={e => handleInputChange(client._id, 'email', e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <p>Name: {client.firstName} {client.lastName}</p>
                    <p>Phone: {client.phoneNumbers}</p>
                    <p>Email: {client.email}</p>
                    <div className="client-buttons">
                      <button className="activate-button" onClick={() => handleActivate(client._id)}>Activate</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="buttons-container">
        <button className="go-back-button" onClick={goToDashboard}>Go Back</button>
      </div>
    </div>
  );
};

export default DeactivatedClients;
