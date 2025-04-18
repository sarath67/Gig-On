"use client"

import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import CreateConnectionButton from "./ConnectionButton"
import { User, Calendar, Edit, Trash2 } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  username: string
  created_at: string
  isOnline: string
  isPaid: boolean
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserPosts()
  }, [username])

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true)
    try {
      const response = await fetch(`https://gig-onapi.sarath-s2022cse.workers.dev/post/${username}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Bearer 1234",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data.results)
      } else {
        setError("Error fetching user posts")
        console.error("Error fetching user posts:", await response.text())
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error fetching user posts:", error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`https://gig-onapi.sarath-s2022cse.workers.dev/posts/${postId}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: "Bearer 1234",
        },
      })
      if (response.ok) {
        console.log("Post deleted successfully")
        // Reload posts after deleting the post
        const updatedPosts = posts.filter((post) => post.id !== postId)
        setPosts(updatedPosts)
      } else {
        console.error("Error deleting post:", await response.text())
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full p-1">
                  <div className="bg-white rounded-full p-1">
                    <User className="h-16 w-16 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">@{username}</h1>
                  <p className="text-gray-500">Member</p>
                </div>
              </div>

              {user !== username && user && (
                <div>
                  <CreateConnectionButton />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gigs by {username}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          {isLoadingPosts ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No gigs found</h3>
              <p className="text-gray-500">This user hasn't posted any gigs yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex space-x-2">
                        {post.isOnline === "yes" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Remote
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            In-Person
                          </span>
                        )}
                        {post.isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/posts/${post.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                      >
                        View Details
                      </Link>

                      {user === post.username && (
                        <>
                          <Link
                            to={`/update/${post.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
