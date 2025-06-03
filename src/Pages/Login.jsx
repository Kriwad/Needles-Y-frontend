"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"
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
      const res = await api.post("/api/token/", { username: username, password: password })

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
      console.error("Full error object:", error)
      console.error("Response data:", error.response?.data)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to NeedlesY  </CardTitle>
          <p className="text-gray-600 mt-2">Sign in to continue to NeedlesY</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to NeedlesY?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Join now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
