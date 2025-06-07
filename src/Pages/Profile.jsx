
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2, User, Clock, Settings, Camera } from "lucide-react"
import Navbar from "../Modals/Navbar"
import Modal from "../Modals/Modal"
import UsernameModal from "../Modals/UsernameModal"
import api from "../api"

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()

  // States
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    image: null,
    bio: "",
  })

  const [currentUser, setCurrentUser] = useState("")
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    video: null,
  })

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = async (postID) => {
    try {
      await api.post(`api/user/post/like/${postID}/`)
      await fetchPosts()
    } catch (error) {
      console.log("error:", error)
    }
  }

  // Input handlers
  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // API calls
  const fetchUser = async () => {
    try {
      const response = await api.get(`api/user/profile/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("api/user/current/")
      setCurrentUser(response.data.id)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await api.get(`api/user/profile/posts/${userId}`)
      setPosts(response.data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file") {
      setUser((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Form submissions
  const handleCreatePost = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    for (const key in formData) {
      if (formData[key] instanceof FileList) {
        for (let i = 0; i < formData[key].length; i++) {
          formDataToSend.append(`${key}`, formData[key][i])
        }
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    }

    try {
      await api.post(`api/user/post/`, formDataToSend)
      await fetchPosts()
      setShowCreateModal(false)
      setFormData({ title: "", content: "", image: null, video: null })
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleEditPost = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formDataToSend = new FormData()

    formDataToSend.append("title", formData.title)
    formDataToSend.append("content", formData.content)
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }
    if (formData.video) {
      formDataToSend.append("video", formData.video)
    }
    try {
      await api.put(`/api/user/post/edit/${selectedPost.id}/`, formDataToSend)
      await fetchPosts()
      setShowEditModal(false)
      setSelectedPost(null)
    } catch (error) {
      console.error("Error updating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async (e) => {
    e.preventDefault()
    try {
      await api.delete(`/api/user/post/edit/${selectedPost.id}/`)
      await fetchPosts()
      setShowDeleteModal(false)
      setSelectedPost(null)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleProfileEdit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append("fullname", user.fullname)
    formDataToSend.append("username", user.username)
    formDataToSend.append("bio", user.bio)
    if (user.image instanceof File) {
      formDataToSend.append("image", user.image)
    }

    try {
      await api.patch(`api/user/profile/${userId}/`, formDataToSend)
      setProfileUpdated((prev) => !prev)
      await fetchUser()
      await fetchCurrentUser()
      await fetchPosts()
      setShowProfileModal(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCurrentUser()
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onOpenModal={() => setShowCreateModal(true)} profileUpdated={profileUpdated} />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-lg mx-auto">
   
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
            <div className="md:col-span-1">
              <Card className="sticky top-24 overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          
                <div className="relative h-32 bg-blue-500 ">
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

           
                <CardContent className="relative px-6 pb-6">
        
                  <div className="flex justify-start -mt-12 mb-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                        <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.fullname} />
                        <AvatarFallback className="bg-blue-500  text-white text-2xl">
                          <User className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                      {user && user.id === currentUser && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white shadow-md"
                          onClick={() => setShowProfileModal(true)}
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

        
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-bold text-gray-900">{user?.fullname}</h1>
                      {user && user.id === currentUser && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full hover:bg-gray-100"
                          onClick={() => setShowProfileModal(true)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-md text-gray-600">@{user?.username}</p>
                    <p className="text-gray-700 text-sm">{user?.bio || "No bio provided"}</p>

                    <div className="pt-4 border-t border-gray-100">
                    
                    </div>

                    {user && user.id === currentUser && (
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full mt-2 bg-blue-600 "
                      >
                        Create Post
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Posts */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
                <span className="text-sm text-gray-500">{posts.length} posts</span>
              </div>

              {posts.length === 0 ? (
                <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
                      <p className="text-gray-500">
                        {user && user.id === currentUser ? "Share your first thought!" : "No posts to show"}
                      </p>
                    </div>
                    {user && user.id === currentUser && (
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 "
                      >
                        Create your first post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarImage src={post.user.image || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{post.user.username}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>

                        {user && currentUser === user.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPost(post)
                                  setFormData({
                                    title: post.title,
                                    content: post.content,
                                    image: null,
                                    video: null,
                                  })
                                  setShowEditModal(true)
                                }}
                                className="text-blue-600 focus:text-blue-600"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Post
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPost(post)
                                  setShowDeleteModal(true)
                                }}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {post.title && <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>}

                      {post.content && (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                      )}

                      {post.images && post.images.length > 0 && (
                        <div className="space-y-2">
                          {post.images.map((imageItem, index) => (
                            <div key={`image-${index}`} className="relative group overflow-hidden rounded-xl">
                              <img
                                src={imageItem.image || "/placeholder.svg"}
                                className="w-full h-auto max-h-96 object-cover transition-transform group-hover:scale-105"
                                alt=""
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {post.videos && post.videos.length > 0 && (
                        <div className="space-y-2">
                          {post.videos.map((videoItem, index) => (
                            <video
                              key={`video-${index}`}
                              controls
                              className="w-full h-auto max-h-96 object-cover rounded-xl"
                            >
                              <source src={videoItem.video} type="video/mp4" />
                            </video>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className="gap-2 hover:text-red-500"
                          >
                            <Heart
                              className={`h-4 w-4 transition-all ${
                                post.is_liked ? "text-red-500 fill-red-500" : "text-gray-600"
                              }`}
                            />
                            {post.like_count > 0 && <span className="text-sm font-medium">{post.like_count}</span>}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/comment/${post.id}/`)}
                            className="gap-2 hover:text-blue-500"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {post.comment_count > 0 && (
                              <span className="text-sm font-medium">{post.comment_count}</span>
                            )}
                          </Button>
                        </div>

                        {post.like_count > 0 && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => navigate(`/liked/${post.id}/`)}
                            className="text-xs text-gray-500 p-0 h-auto hover:text-gray-700"
                          >
                            Liked by {post.like_count}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UsernameModal
        isOpen={showProfileModal}
        isClosed={() => setShowProfileModal(false)}
        onSubmit={handleProfileEdit}
        title="Edit Profile"
        submitText="Save Changes"
        formData={user}
        handleInputChange={handleProfileChange}
        modalType="edit"
      />

      <Modal
        isOpen={showCreateModal}
        isClosed={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
        title="Create New Post"
        submitText="Create Post"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="submit"
      />

      <Modal
        isOpen={showEditModal}
        isClosed={() => setShowEditModal(false)}
        onSubmit={handleEditPost}
        title="Edit Post"
        submitText="Update Post"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="edit"
      />

      <Modal
        isOpen={showDeleteModal}
        isClosed={() => setShowDeleteModal(false)}
        onSubmit={handleDeletePost}
        title="Delete Post"
        submitText="Delete Post"
        formData={formData}
        handleInputChange={handleFormChange}
        readOnly={true}
        modalType="delete"
      />
    </div>
  )
}

export default Profile
