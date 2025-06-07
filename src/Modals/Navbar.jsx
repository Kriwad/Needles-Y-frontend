

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Plus, Menu, LogOut } from "lucide-react"
import api from "../api"

const Navbar = ({ onOpenModal, profileUpdated }) => {
  const { userId } = useParams()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const isProfilePage = userId ? location.pathname === `/profile/${userId}` : false
  const hideButton = location.pathname.startsWith("/comment/")

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    id: "",
    image: "",
  })

  const fetchUser = async () => {
    const userID = localStorage.getItem("user_id")
    try {
      const res = await api.get(`api/user/profile/${userID}/`)
      setUserData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [profileUpdated])

  const handleLogout = (e) => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("username")
    localStorage.removeItem("fullname")
    localStorage.removeItem("user_id")
    navigate("/login/")
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold b-blue-600  bg-clip-text text-transparent hover:bg-blue-700 hover: transition-all"
            >
              NeedlesY
            </button>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!hideButton && (
              <Button
                onClick={onOpenModal}
                size="icon"
                className="bg-blue-600  hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            {userData && (
              <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-full p-2 transition-colors"
                onClick={() => {
                  if (!isProfilePage) {
                    navigate(`/profile/${userData.id}`)
                  }
                }}
              >
                <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                  <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.fullname} />
                  <AvatarFallback className="bg-blue-500  text-white text-sm">
                    {userData.fullname[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 hover:text-gray-900">{userData.username}</span>
              </div>
            )}

            <Button onClick={handleLogout} variant="outline" className="border-gray-200 hover:bg-gray-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between h-16">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold bg-blue-600 bg-clip-text text-transparent"
          >
            NeedlesY
          </button>

          <div className="flex-1 max-w-xs mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="pl-10 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!hideButton && (
              <Button
                onClick={onOpenModal}
                size="icon"
                className="h-9 w-9 bg-blue-600  hover:bg-blue-700 hover: text-white rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex-1 pt-6">
                    {userData && (
                      <div
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-6"
                        onClick={() => {
                          if (!isProfilePage) {
                            navigate(`/profile/${userData.id}`)
                          }
                        }}
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                          <AvatarImage src={userData.image || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500  text-white">
                            {userData.fullname[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold text-gray-900">{userData.username}</h2>
                          <p className="text-sm text-gray-500">View Profile</p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-gray-200 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
