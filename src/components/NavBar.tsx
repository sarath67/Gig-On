"use client"

import type React from "react"
import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { Home, User, Users, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react"

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    navigate("/login")
    setIsMobileMenuOpen(false)
  }

  const handleSignup = () => {
    navigate("/signup")
    setIsMobileMenuOpen(false)
  }

  const handleProfile = () => {
    navigate(`/profile/${user}`)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const handleConnections = () => {
    navigate(`/connections/`)
    setIsMobileMenuOpen(false)
  }

  const handleHome = () => {
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white overflow-y-auto z-50">
        <div className="h-full flex flex-col justify-between">
          <div className="py-6 px-6">
            <div onClick={() => navigate("/")} className="flex items-center mb-10 cursor-pointer">
              <span className="text-2xl font-bold ml-2 whitespace-nowrap">Gig-On</span>
            </div>
            <nav className="space-y-1">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
              >
                <Home className="w-5 h-5 mr-3" />
                <span className="font-medium">Home</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to={`/profile/${user}`}
                    className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/connections"
                    className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span className="font-medium">Connections</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span className="font-medium">Login</span>
                  </button>
                  <button
                    onClick={handleSignup}
                    className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition duration-200"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    <span className="font-medium">Sign up</span>
                  </button>
                </>
              )}
            </nav>
          </div>
          <div className="p-6">
            <div className="text-sm text-indigo-200">© {new Date().getFullYear()} Gig-On</div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-900 text-white z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
            <span className="text-xl font-bold">Gig-On</span>
          </div>
          <button onClick={toggleMobileMenu} className="p-2 rounded-md hover:bg-white/10">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-b from-indigo-900 to-purple-900 z-40 pt-16 animate-fadeIn">
          <nav className="p-4 space-y-1">
            <button
              onClick={handleHome}
              className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Home</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
                >
                  <User className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={handleConnections}
                  className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span className="font-medium">Connections</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={handleSignup}
                  className="w-full flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10"
                >
                  <UserPlus className="w-5 h-5 mr-3" />
                  <span className="font-medium">Sign up</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Content Padding for Mobile */}
      <div className="md:hidden h-14"></div>

      {/* Content Padding for Desktop */}
      <div className="hidden md:block md:ml-64"></div>
    </>
  )
}

export default Navbar
