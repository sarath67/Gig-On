"use client"

import type React from "react"
import { useState, useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Check } from "lucide-react"

interface CreatePostProps {
  onPostCreated: () => void
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryName, setCategoryName] = useState("hackathons")
  const [isOnline, setIsOnline] = useState("")
  const [isPaid, setIsPaid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const username = user ? user : ""

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryName(event.target.value)
  }

  const handleIsOnlineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOnline(event.target.value)
  }

  const handleIsPaidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaid(event.target.checked)
  }

  const handleSubmit = async () => {
    if (!title || !content || !isOnline) {
      return // Add validation feedback if needed
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("https://gig-onapi.sarath-s2022cse.workers.dev/posts", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
        body: JSON.stringify({ title, content, username, categoryName, isOnline, isPaid }),
      })

      if (response.ok) {
        console.log("Post created successfully")
        onPostCreated()
        // Reset form
        setTitle("")
        setContent("")
        setCategoryName("hackathons")
        setIsOnline("")
        setIsPaid(false)
      } else {
        console.error("Error creating post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
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
          onChange={handleTitleChange}
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
          onChange={handleContentChange}
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
            value={categoryName}
            onChange={handleCategoryChange}
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
            onChange={handleIsOnlineChange}
          >
            <option value="">Select location type</option>
            <option value="yes">Remote</option>
            <option value="no">In-Person</option>
            <option value="any">Either</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isPaid"
          type="checkbox"
          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={isPaid}
          onChange={handleIsPaidChange}
        />
        <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
          This is a paid opportunity
        </label>
      </div>

      <div className="pt-4">
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              Creating...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Create Gig
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CreatePost
