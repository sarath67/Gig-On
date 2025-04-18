"use client"

import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { Calendar, MapPin, DollarSign, Edit, Trash2, AlertTriangle, ArrowLeft } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  username: string
  created_at: string
  isOnline: boolean
  isPaid: boolean
}

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useContext(AuthContext)
  const [post, setPost] = useState<Post | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1234",
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPost(data.results[0])
        } else {
          console.error("Error fetching post:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching post:", error)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      })
      if (response.ok) {
        setDeleteSuccess(true)
        setTimeout(() => {
          setDeleteSuccess(false)
          navigate("/")
        }, 1500)
      } else {
        console.error("Error deleting post:", await response.text())
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all gigs
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.isOnline ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <MapPin className="h-4 w-4 mr-1" />
                  Remote
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <MapPin className="h-4 w-4 mr-1" />
                  In-Person
                </span>
              )}
              {post.isPaid ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Unpaid
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center text-gray-500 mb-6">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                Posted on{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <Link
                to={`/profile/${post.username}`}
                className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition duration-200"
              >
                Posted by @{post.username}
              </Link>
            </div>

            {user === post.username && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                <Link
                  to={`/update/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Gig
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Gig
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
              <div className="flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Gig</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this gig? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div
            className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-fadeIn"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
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
              <p className="font-medium">Gig deleted successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
