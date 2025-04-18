"use client"

import type React from "react"
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import CreatePost from "./CreatePost"
import PostList from "./PostsList"
import { Search, Filter, Plus, X } from "lucide-react"

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isOnlineSearch, setIsOnlineSearch] = useState("any")
  const [isPaidSearch, setIsPaidSearch] = useState("any")
  const [isNewPostCreated, setIsNewPostCreated] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleIsOnlineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOnlineSearch(event.target.value)
  }

  const handleIsPaidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPaidSearch(event.target.value)
  }

  const toggleCreatePost = () => {
    if (!user) {
      navigate("/login")
      return
    }
    setShowCreatePost(!showCreatePost)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlePostCreated = () => {
    setIsNewPostCreated(true)
    setTimeout(() => {
      setIsNewPostCreated(false)
      setShowCreatePost(false)
    }, 3000)
  }

  // Close create post form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showCreatePost && !target.closest(".create-post-container")) {
        setShowCreatePost(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCreatePost])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Gig</h1>
          <p className="text-gray-600">Discover opportunities or create your own gig</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              type="text"
              placeholder="Search for gigs..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  value={isOnlineSearch}
                  onChange={handleIsOnlineChange}
                >
                  <option value="any">Any Location</option>
                  <option value="yes">Remote Only</option>
                  <option value="no">In-Person Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  value={isPaidSearch}
                  onChange={handleIsPaidChange}
                >
                  <option value="any">Any Payment Type</option>
                  <option value="yes">Paid Only</option>
                  <option value="no">Unpaid/Volunteer</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              onClick={toggleCreatePost}
            >
              {showCreatePost ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Gig
                </>
              )}
            </button>
          </div>
        </div>

        {isNewPostCreated && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center animate-fadeIn">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Your gig has been successfully created!</p>
            </div>
          </div>
        )}

        {showCreatePost && (
          <div className="create-post-container bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a New Gig</h2>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        )}

        <PostList searchTerm={searchTerm} isOnlineSearch={isOnlineSearch} isPaidSearch={isPaidSearch} />
      </div>
    </div>
  )
}

export default Home
