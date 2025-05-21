"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"
import api from "../api"

export default function RegisterAndLogout() {
  const [data, setData] = useState({
    email: "",
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    password: "",
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      console.log("Sending data to API:", data)
      await api.post("/api/user/register/", {
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.firstname,
        middle_name: data.middlename,
        last_name: data.lastname,
      },{
        headers: {Authorization : undefined}
      })

      setSuccess("Registration successful! Please proceed to login.")
      setTimeout(() => navigate("/login"), 2000)
    } catch(error){
      if (error.response && error.response.data){
        const errorData = error.response.data;
        let errorMessage = "";

        if (errorData.username){
          errorMessage +=  `Username: ${errorData.username}\n`
        }
        if (errorData.password){
          errorMessage += `Password: ${errorData.password}\n`
        }
        if (errorMessage ===" " && typeof errorData === 'object'){
          errorMessage = "Validation failed. Please check your information.";
        }
        if (errorMessage === ""  && typeof errorData === 'string'){
          errorMessage = errorData
        }
        setError(errorMessage)

      }else {
        setError("An unexpected error has occured")}
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        {error &&(
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}
        {success &&(
          <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="First Name"
                value={data.firstname}
                onChange={(e) => setData({ ...data, firstname: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Last Name"
                value={data.lastname}
                onChange={(e) => setData({ ...data, lastname: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">
              Middle Name (Optional)
            </label>
            <input
              id="middlename"
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Middle Name"
              value={data.middlename}
              onChange={(e) => setData({ ...data, middlename: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Choose a username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  )
}

