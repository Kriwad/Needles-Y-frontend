"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {

     
      

      const res = await api.post("/api/token/",{username : username , password: password})
      
      localStorage.setItem(ACCESS_TOKEN, res.data.access)
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

      
      const userRes = await api.get(`api/user/current/`, {
        headers: { Authorization: `Bearer ${res.data.access}` },
      })
      
      localStorage.setItem("user_id", userRes.data.id)
      localStorage.setItem("fullname", userRes.data.fullname)
      localStorage.setItem("username", userRes.data.username)
      localStorage.setItem("image", userRes.data.image)
      console.log(userRes.data)
      navigate("/")
      

    } catch (error) {
  
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password. Please try again.")
      } else if (error.response && error.response.status === 400) {
        setError("Please enter a valid username and password.")
      } else {
        setError("Something went wrong. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
   

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-1 text-3xl font-bold text-center text-gray-800">Sign In</h1>
        <p className="mb-8 text-sm text-center text-gray-600">To the Point</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          {error && <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to Needles?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

