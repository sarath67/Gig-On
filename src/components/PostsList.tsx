"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, ChevronRight } from "lucide-react"

interface Post {
  id: number
  title: string
  content: string
  username: string
  created_at: string
  isOnline: string
  isPaid: boolean
}

interface PostListProps {
  searchTerm: string
  isOnlineSearch: string
  isPaidSearch: string
}

const PostList: React.FC<PostListProps> = ({ searchTerm, isOnlineSearch, isPaidSearch }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [searchTerm, isOnlineSearch, isPaidSearch, posts])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const API_BASE_URL =
      import.meta.env.DEV
        ? "/api"
        : "https://gig-onapi.sarath-s2022cse.workers.dev"

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data.results)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts
    if (searchTerm.length > 0) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (isOnlineSearch !== "any") {
      filtered = filtered.filter(
        (post) =>
          (isOnlineSearch === "yes" && post.isOnline === "yes") || (isOnlineSearch === "no" && post.isOnline === "no"),
      )
    }
    if (isPaidSearch !== "any") {
      filtered = filtered.filter(
        (post) => (isPaidSearch === "yes" && post.isPaid) || (isPaidSearch === "no" && !post.isPaid),
      )
    }
    setFilteredPosts(filtered)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No gigs found</h3>
        <p className="text-gray-500">Try adjusting your search filters or create a new gig.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Gigs</h2>
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id} className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
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
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${post.username}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      @{post.username}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <span className="text-sm font-medium text-indigo-600 flex items-center">
                  View details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostList
