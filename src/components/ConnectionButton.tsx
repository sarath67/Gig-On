import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Loading from './Loading';

const CreateConnectionButton: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const { user: user1_username } = useContext(AuthContext);
  const { username: user2_username } = useParams<{ username: string }>();
  const [requester, setRequester] = useState<string | null>(null);
  const [acceptor, setAcceptor] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      try {
        const response = await fetch(`/api/connections/${user1_username}/${user2_username}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer 1234'
          },
        });
        if (response.ok) {
          const data = await response.json();
          setConnectionStatus(data.results[0].status);
          setRequester(data.results[0].user1_username);
          setAcceptor(data.results[0].user2_username);
          setConnectionId(data.results[0].id);
        } else {
          console.error('Error fetching connection status');
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };

    fetchConnectionStatus();
  }, [user1_username, user2_username]);

  const handleButtonClick = async () => {
    if (connectionStatus === 0 && acceptor === user1_username) {
      try {
        const response = await fetch(`/api/connections/${connectionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 1234'
          },
          body: JSON.stringify({ status: 1 }) 
        });
        if (response.ok) {
          setConnectionStatus(1); 
          console.log('Connection accepted');
        } else {
          console.error('Error accepting connection');
        }
      } catch (error) {
        console.error('Error accepting connection:', error);
      }
    } else if (connectionStatus === null) {
      try {
        const response = await fetch(`/api/connections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 1234'
          },
          body: JSON.stringify({ user1_username, user2_username })
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          setConnectionStatus(0); // Update connectionStatus to 0 (request sent)
        } else {
          console.error('Error creating connection:', await response.text());
        }
      } catch (error) {
        console.error('Error creating connection:', error);
      }
    }
  };
  
  const handleRemoveButtonClick = async () => {
    if (!connectionId) return;
  
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer 1234'
        },
      });
      if (response.ok) {
        setConnectionStatus(null); // Reset connectionStatus
        setConnectionId(null); // Reset connectionId
        console.log('Connection removed');
      } else {
        console.error('Error removing connection');
      }
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  let buttonText;
  if (connectionStatus === null) {
    buttonText = 'Give Request';
  } else if (connectionStatus === 0) {
    if (requester === user1_username) {
      buttonText = 'Requested';
    } else {
      buttonText = 'Accept Request';
    }
  } else if (connectionStatus === 1) {
    buttonText = 'Connected';
  }

  return (
    <>
      {isLoading ? ( // Render loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <button onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {buttonText}
          </button>
          {connectionStatus === 0 && (
            <button onClick={handleRemoveButtonClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">
              Remove Request
            </button>
          )}
          {connectionStatus === 1 && (
            <button onClick={handleRemoveButtonClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">
              Remove Connection
            </button>
          )}
        </>
      )}
    </>
  );
};

export default CreateConnectionButton;