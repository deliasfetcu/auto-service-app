import React, { useState, useEffect } from 'react';
import './Clients.css'; 
import ClientForm from './ClientForm'; 

const Clients = ({ goToDashboard }) => {
  // State to store client data
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

  // Function to navigate back to clients page
  const goToClients = () => {
    setCurrentPage('clients');
  };

  // Fetch clients data from the server
  useEffect(() => {
    fetch('http://localhost:3001/api/clients')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, [refreshFlag]);

  // Function to display deactivated clients
  const handleGoToDeactivatedClients = () => {
    setShowDeactivatedClients(true);
  };

  // Function to enable editing mode for a client
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

  // Function to update client data in the database
  const handleSave = (clientId) => {
    const editedClient = clients.find(client => client._id === clientId);
    fetch(`http://localhost:3001/api/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedClient),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      setClients(prevClients => prevClients.map(client => {
        if (client._id === clientId) {
          return editedClient;
        }
        return client;
      }));
      setEditingClientId(null);
    })
    .catch(error => console.error('Error updating client:', error));
  };

  // Function to cancel editing mode
  const handleCancelEdit = () => {
    setEditingClientId(null);
  };

  // Function to handle input change for a client
  const handleInputChange = (clientId, field, value) => {
    setClients(prevClients => prevClients.map(client => {
      if (client._id === clientId) {
        return { ...client, [field]: value };
      }
      return client;
    }));
  };

  // Function to display client form for adding a new client
  const handleAddClient = () => {
    setShowClientForm(true);
  };

  // Function to cancel adding a new client
  const handleCancelAddClient = () => {
    setShowClientForm(false);
  };

  // Function to toggle refresh flag for fetching updated client data
  const toggleRefresh = () => {
    setRefreshFlag(prevFlag => !prevFlag);
  };
  
  // Function to handle submission of client form data
  const handleSubmitClientForm = (formData) => {
    fetch('http://localhost:3001/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        setShowClientForm(false);
        toggleRefresh();
        throw new Error('Failed to add client');
      }
      return response.json();
    })
    .then(newClient => {
      console.log("Client added successfully:", newClient);
      setClients(prevClients => [...prevClients, newClient]);
      setShowClientForm(false);
    })
    .catch(error => console.error('Error adding client:', error));
  };

  return (
    <div className="clients-container">
      <h2>Clients</h2>
      <div className="clients-list">
        {clients
          .filter(client => client.isActive) // Filter clients with isActive set to true
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
                    <button onClick={() => handleSave(client._id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p>Name: {client.firstName} {client.lastName}</p>
                    <p>Phone: {client.phoneNumbers}</p>
                    <p>Email: {client.email}</p>
                    <div className="client-buttons">
                      <button className="edit-button" onClick={() => handleEdit(client._id)}>Edit</button>
                      <button className="deactivate-button" onClick={() => handleDeactivate(client._id)}>Deactivate</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      {showClientForm && <ClientForm onSubmit={handleSubmitClientForm} onCancel={handleCancelAddClient} />}
      <div className="buttons-container">
        <button className="add-client-button" onClick={handleAddClient}>Add Client</button>
        <button className="go-back-button" onClick={goToDashboard}>Go Back</button>
      </div>
    </div>
  );
};

export default Clients;
