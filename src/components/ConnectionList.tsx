import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import Loading from './Loading'; 
import { Link } from 'react-router-dom';

interface Connection {
  id: number;
  user1_username: string;
  user2_username: string;
  status: number;
}

const ConnectionsList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requestedConnections, setRequestedConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedTab, setSelectedTab] = useState<'connected' | 'requested' | 'requestsForYou'>('connected');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/connections/${user}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const userConnections = data.results.filter((conn: Connection) => conn.status === 1);
        const userRequestedConnections = data.results.filter((conn: Connection) => conn.status === 0 && conn.user1_username === user);
        const userConnectionRequests = data.results.filter((conn: Connection) => conn.status === 0 && conn.user2_username === user);
        setConnections(userConnections);
        setRequestedConnections(userRequestedConnections);
        setConnectionRequests(userConnectionRequests);
      } else {
        console.error('Error fetching connections:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'connected' | 'requested' | 'requestsForYou') => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Connections</h2>
      <div className="flex justify-between mb-4 m-6">
        <button
          className={`text-lg font-semibold ${selectedTab === 'connected' ? 'text-blue-900' : 'text-gray-600'} focus:outline-none`}
          onClick={() => handleTabChange('connected')}
        >
          Connected
        </button>
        <button
          className={`text-lg font-semibold ${selectedTab === 'requested' ? 'text-blue-900' : 'text-gray-600'} focus:outline-none`}
          onClick={() => handleTabChange('requested')}
        >
          Requested
        </button>
        <button
          className={`text-lg font-semibold ${selectedTab === 'requestsForYou' ? 'text-blue-900' : 'text-gray-600'} focus:outline-none`}
          onClick={() => handleTabChange('requestsForYou')}
        >
          Requests for You
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          {selectedTab === 'connected' && (
            <>
              
              {connections.map((conn) => (
                <Link to={`/profile/${conn.user1_username === user ? conn.user2_username : conn.user1_username}`}>
                <div key={conn.id} className="border border-gray-300 rounded-xl p-4 mb-4 m-5 bg-gray-100">
                  <p className="font-serif text-3xl">{conn.user1_username === user ? conn.user2_username : conn.user1_username}</p>
                  <p className='font-thin'>Connected</p>
                </div>
                </Link>
              ))}
            </>
          )}
          {selectedTab === 'requested' && (
            <>
              
              {requestedConnections.map((conn) => (
                <Link to={`/profile/${conn.user2_username}`}>
                <div key={conn.id} className="border border-gray-300 rounded-xl p-4 mb-4 m-5 bg-gray-100">
                  <p className="font-serif text-3xl"> {conn.user1_username === user ? conn.user2_username : conn.user1_username}</p>
                  <p className='font-thin'>Requested</p>
                </div>
                </Link>
              ))}
            </>
          )}
          {selectedTab === 'requestsForYou' && (
            <>
              
              {connectionRequests.map((conn) => (
                 <Link to={`/profile/${conn.user1_username}`}>
                <div key={conn.id} className="border border-gray-300 rounded-xl p-4 mb-4 m-5 bg-gray-100">
                 
                  <p className="font-serif text-3xl">{conn.user1_username}</p>
                  <p className='font-thin'>Request for you</p>
                 
                  </div>
                  </Link>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionsList;
