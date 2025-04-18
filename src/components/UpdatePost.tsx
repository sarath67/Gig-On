"use client"

import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { Save, ArrowLeft } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  username: string
  created_at: string
  isOnline: string
  isPaid: boolean
}

const UpdatePost: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category_name, setCategoryName] = useState("")
  const [isOnline, setIsOnline] = useState<string>("")
  const [isPaid, setIsPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://gig-onapi.sarath-s2022cse.workers.dev/posts/${id}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1234",
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPost(data.results[0])
          setTitle(data.results[0].title)
          setContent(data.results[0].content)
          setCategoryName(data.results[0].category_name || "hackathons")
          setIsOnline(data.results[0].isOnline)
          setIsPaid(data.results[0].isPaid)
        } else {
          setError("Error fetching post details")
          console.error("Error fetching post:", await response.text())
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
        console.error("Error fetching post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content || !isOnline) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`https://gig-onapi.sarath-s2022cse.workers.dev/posts/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
        body: JSON.stringify({ title, content, category_name, isOnline, isPaid }),
      })
      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/")
        }, 1500)
      } else {
        setError("Error updating post")
        console.error("Error updating post:", await response.text())
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error updating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
            <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (user !== post.username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Authorized</h2>
            <p className="text-gray-600 mb-6">You are not authorized to edit this post.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Gig</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
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
                <p className="font-medium">Gig updated successfully!</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  type="text"
                  placeholder="Give your gig a clear title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="content"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Describe the gig in detail"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    value={category_name}
                    onChange={(e) => setCategoryName(e.target.value)}
                  >
                    <option value="hackathons">Hackathons</option>
                    <option value="home decor">Home Decor</option>
                    <option value="Photography">Photography</option>
                    <option value="Writing">Writing</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Event Planning">Event Planning</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="acting">Acting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="isOnline" className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    id="isOnline"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    value={isOnline}
                    onChange={(e) => setIsOnline(e.target.value)}
                  >
                    <option value="any">Either</option>
                    <option value="yes">Remote</option>
                    <option value="no">In-Person</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="isPaid"
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                />
                <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                  This is a paid opportunity
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Gig
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePost
