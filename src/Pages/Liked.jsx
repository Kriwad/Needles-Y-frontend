"use client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart } from "lucide-react"

function Liked() {
  const { postId } = useParams()
  const [users, setUser] = useState([])
  const navigate = useNavigate()

  const fetchLikeUser = async () => {
    try {
      const response = await api.get(`api/user/post/like/${postId}/`)
      setUser(response.data)
      console.log(response.data)
    } catch (error) {
      console.log("error:", error)
    }
  }

  useEffect(() => {
    fetchLikeUser()
  }, [postId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h1 className="text-lg font-semibold text-gray-900">People who reacted</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-6">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reactions yet</h3>
            <p className="text-gray-500">Be the first to show some love!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((item) => (
              <Card
                key={item.id}
                onClick={() => navigate(`/profile/${item.user.id}`)}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                    <AvatarImage src={item.user.image || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {item.user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {item.user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{item.user.fullname || "User"}</p>
                  </div>
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Liked
