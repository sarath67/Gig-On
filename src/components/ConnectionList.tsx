"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Link } from "react-router-dom"
import { User, UserCheck, UserPlus, Users } from "lucide-react"

interface Connection {
  id: number
  user1_username: string
  user2_username: string
  status: number
}

const ConnectionsList: React.FC = () => {
  const { user } = useContext(AuthContext)
  const [connections, setConnections] = useState<Connection[]>([])
  const [requestedConnections, setRequestedConnections] = useState<Connection[]>([])
  const [connectionRequests, setConnectionRequests] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"connected" | "requested" | "requestsForYou">("connected")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/connections/${user}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer 1234",
        },
      })
      if (response.ok) {
        const data = await response.json()
        const userConnections = data.results.filter((conn: Connection) => conn.status === 1)
        const userRequestedConnections = data.results.filter(
          (conn: Connection) => conn.status === 0 && conn.user1_username === user,
        )
        const userConnectionRequests = data.results.filter(
          (conn: Connection) => conn.status === 0 && conn.user2_username === user,
        )
        setConnections(userConnections)
        setRequestedConnections(userRequestedConnections)
        setConnectionRequests(userConnectionRequests)
      } else {
        setError("Error fetching connections")
        console.error("Error fetching connections:", await response.text())
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error fetching connections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (tab: "connected" | "requested" | "requestsForYou") => {
    setSelectedTab(tab)
  }

  const acceptConnection = async (connectionId: number) => {
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
        body: JSON.stringify({ status: 1 }),
      })

      if (response.ok) {
        // Refresh connections after accepting
        fetchConnections()
      }
    } catch (error) {
      console.error("Error accepting connection:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Network</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  selectedTab === "connected"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => handleTabChange("connected")}
              >
                <div className="flex items-center justify-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  <span>Connected</span>
                  {connections.length > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {connections.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  selectedTab === "requested"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => handleTabChange("requested")}
              >
                <div className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>Sent</span>
                  {requestedConnections.length > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {requestedConnections.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  selectedTab === "requestsForYou"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => handleTabChange("requestsForYou")}
              >
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Received</span>
                  {connectionRequests.length > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {connectionRequests.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {selectedTab === "connected" && (
                  <>
                    {connections.length === 0 ? (
                      <div className="text-center py-10">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          You don't have any connections yet. Start connecting with other users to build your network.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {connections.map((conn) => (
                          <Link
                            to={`/profile/${conn.user1_username === user ? conn.user2_username : conn.user1_username}`}
                            key={conn.id}
                          >
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition duration-200">
                              <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 rounded-full p-2">
                                  <User className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    @{conn.user1_username === user ? conn.user2_username : conn.user1_username}
                                  </h3>
                                  <p className="text-sm text-gray-500">Connected</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {selectedTab === "requested" && (
                  <>
                    {requestedConnections.length === 0 ? (
                      <div className="text-center py-10">
                        <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          You haven't sent any connection requests that are still pending.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {requestedConnections.map((conn) => (
                          <Link to={`/profile/${conn.user2_username}`} key={conn.id}>
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition duration-200">
                              <div className="flex items-center gap-3">
                                <div className="bg-yellow-100 rounded-full p-2">
                                  <User className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">@{conn.user2_username}</h3>
                                  <p className="text-sm text-gray-500">Request sent</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {selectedTab === "requestsForYou" && (
                  <>
                    {connectionRequests.length === 0 ? (
                      <div className="text-center py-10">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          You don't have any pending connection requests from other users.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {connectionRequests.map((conn) => (
                          <div
                            key={conn.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition duration-200"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-green-100 rounded-full p-2">
                                <User className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <Link
                                  to={`/profile/${conn.user1_username}`}
                                  className="font-medium text-gray-900 hover:text-indigo-600"
                                >
                                  @{conn.user1_username}
                                </Link>
                                <p className="text-sm text-gray-500">Wants to connect</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => acceptConnection(conn.id)}
                                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-200"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionsList
