"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import PublicAPi from "../../PublicAPi"

export default function Register() {
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
      await PublicAPi.post("/api/user/register/", {
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.firstname,
        middle_name: data.middlename,
        last_name: data.lastname,
      })

      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data
        let errorMessage = ""

        if (errorData.username) {
          errorMessage += `Username: ${errorData.username}\n`
        }
        if (errorData.password) {
          errorMessage += `Password: ${errorData.password}\n`
        }
        if (errorMessage === "" && typeof errorData === "object") {
          errorMessage = "Validation failed. Please check your information."
        }
        if (errorMessage === "" && typeof errorData === "string") {
          errorMessage = errorData
        }
        setError(errorMessage)
      } else {
        setError("An unexpected error has occurred")
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
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Join NeedlesY</CardTitle>
          <p className="text-gray-600 mt-2">Create your account and start sharing</p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="First name"
                  value={data.firstname}
                  onChange={(e) => setData({ ...data, firstname: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Last name"
                  value={data.lastname}
                  onChange={(e) => setData({ ...data, lastname: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="middlename" className="text-sm font-medium text-gray-700">
                Middle Name (Optional)
              </Label>
              <Input
                id="middlename"
                type="text"
                placeholder="Middle name"
                value={data.middlename}
                onChange={(e) => setData({ ...data, middlename: e.target.value })}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                required
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                  placeholder="Create a password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
