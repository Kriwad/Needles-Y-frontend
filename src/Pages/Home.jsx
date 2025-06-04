

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import imageCompression from "browser-image-compression"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2, User, Clock, X, ImageIcon } from "lucide-react"
import Navbar from "../Modals/Navbar"
import Modal from "../Modals/Modal"
import api from "../api"

function Home() {
  const [modal, setModal] = useState(false)
  const [user, setUser] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectPost, setSelectPost] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: [],
    video: [],
  })
  const [isProcessingFiles, setIsProcessingFiles] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedimage] = useState(null)
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const handleLike = async (postID) => {
    try {
      await api.post(`/api/user/post/like/${postID}/`)
      await fetchPosts()
    } catch (error) {
      console.log("error:", error)
    }
  }

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      if (name === "image" && files.length > 0) {
        setIsProcessingFiles(true)
        console.log("Image input detected. Number of files selected:", files.length)
        const processedFiles = []
        const MODERATE_DIMENSION_CAP = 1920

        for (let i = 0; i < files.length; i++) {
          const originalFile = files[i]
          let currentProcessedFile = originalFile

          try {
            const originalFileSizeMB = originalFile.size / 1024 / 1024
            let targetSizeMB
            let compressionQuality
            let currentMaxWidthOrHeight = undefined
            if (originalFileSizeMB >= 5) {
              targetSizeMB = originalFileSizeMB * 0.7
              compressionQuality = 0.75
              currentMaxWidthOrHeight = MODERATE_DIMENSION_CAP
            } else if (originalFileSizeMB > 2 && originalFileSizeMB < 4) {
              targetSizeMB = originalFileSizeMB * 0.75
              compressionQuality = 0.8
              currentMaxWidthOrHeight = undefined
            } else {
              targetSizeMB = originalFileSizeMB * 0.9
              compressionQuality = 1.0
              currentMaxWidthOrHeight = undefined
            }
            const option = {
              maxSizeMB: targetSizeMB,
              maxWidthOrHeight: currentMaxWidthOrHeight,
              useWebWorker: true,
              fileType: originalFile.type,
              quality: compressionQuality,
              alwaysKeepResolution: false,
            }
            console.log(`Processing image : ${i + 1} original image : ${originalFile.size / 1024 / 1024}MB`)
            const compressedResult = await imageCompression(originalFile, option)
            console.log(`Processed image : ${i + 1} , size : ${currentProcessedFile.size / 1024 / 1024}MB`)
            if (compressedResult instanceof Blob) {
              currentProcessedFile = new File([compressedResult], originalFile.name, {
                type: compressedResult.type,
                lastModified: originalFile.lastModified,
              })
              console.log(`Compression successfull for image {i+!}. Converted Blob to file`)
            } else {
              console.error(`Error Processed file ${i + 1}is neither a blob or a file type`)
              console.log(`- Faiing back to original file.`)
              currentProcessedFile = originalFile
            }
          } catch (error) {
            console.error(`Image processing (compression) failed for file ${i + 1} (${originalFile.name}):`, error)
            console.log(`  - Falling back to original file.`)
            currentProcessedFile = originalFile
          }
          processedFiles.push(currentProcessedFile)
        }
        setIsProcessingFiles(false)
        console.log(`All files processed. Number of files in processedFiles: ${processedFiles.length}`)
        console.log(processedFiles)
        setFormData((prevState) => ({
          ...prevState,
          [name]: processedFiles,
        }))
      } else if (name === "video" && files.length > 0) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: Array.from(files),
        }))
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: [],
      video: [],
    })
    setSelectPost(null)
  }

  const handleImageClick = (imageUrl) => {
    setSelectedimage(imageUrl)
    setImageModalOpen(true)
  }

  const handleCloseImageModal = () => {
    setSelectedimage(null)
    setImageModalOpen(false)
  }

  const handleOpenModal = () => {
    resetForm()
    setModal(true)
  }

  const handleCloseModel = () => {
    resetForm()
    setModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isProcessingFiles) {
      console.log("Files are being processed")
      return
    }
    const formDataToSend = new FormData()
    for (const key in formData) {
      if (Array.isArray(formData[key]) && formData[key].every((item) => item instanceof File)) {
        for (let i = 0; i < formData[key].length; i++) {
          formDataToSend.append(key, formData[key][i])
        }
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    }
    try {
      console.log("Sending FormData:", formDataToSend)
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0] + ", " + pair[1])
      }

      await api.post("/api/user/post/", formDataToSend)
      await fetchPosts()
      handleCloseModel()
    } catch (error) {
      console.log("error:", error)
    }
  }

  const handleEditOpenModal = (post) => {
    setEditModal(true)
    setSelectPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      image: [],
      video: [],
    })
  }

  const handleEditCloseModal = () => {
    setEditModal(false)
    resetForm()
  }

  const handleEdit = async (e) => {
    if (!selectPost) return
    e.preventDefault()
    const formDataToSend = new FormData()

    formDataToSend.append("title", formData.title)
    formDataToSend.append("content", formData.content)
    if (formData.images) {
      formDataToSend.append("image", formData.images)
    }
    if (formData.videos) {
      formDataToSend.append("video", formData.videos)
    }

    try {
      await api.put(`/api/user/post/edit/${selectPost.id}/`, formDataToSend)
      handleEditCloseModal()
      await fetchPosts()
    } catch (error) {
      console.log("error")
    }
  }

  const handleDeleteOpenModal = (post) => {
    setDeleteModal(true)
    setSelectPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      image: [],
      video: [],
    })
  }

  const handleDeleteCloseModal = async () => {
    setDeleteModal(false)
    resetForm()
  }

  const handleDelete = async (e) => {
    if (!selectPost) return
    e.preventDefault()
    try {
      await api.delete(`/api/user/post/edit/${selectPost.id}/`)
      await fetchPosts()
      handleDeleteCloseModal()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const user = await api.get("/api/user/current/")
      setUser(user.data)
      console.log(user.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/user/post/list/")
      setPosts(response.data)
    } catch (error) {
      console.log("Problem fetching your data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onOpenModal={handleOpenModal} />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          {posts.length === 0 ? (
            <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
                  <p className="text-gray-500">Be the first to share something amazing!</p>
                </div>
                <Button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create your first post
                </Button>
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
                      <Avatar className="h-11 w-11 ring-2 ring-gray-100">
                        <AvatarImage src={post.user.image || "/placeholder.svg"} alt={post.user.username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-semibold text-gray-900 hover:text-blue-600"
                          onClick={() => navigate(`profile/${post.user.id}`)}
                        >
                          {post.user.username}
                        </Button>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {post.created_at &&
                            formatDistanceToNow(new Date(post.created_at), {
                              addSuffix: true,
                            })}
                        </div>
                      </div>
                    </div>

                    {user && user.username === post.user.username && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditOpenModal(post)}
                            className="text-blue-600 focus:text-blue-600"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteOpenModal(post)}
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

                  {post.content && <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>}

                  {post.images && post.images.length > 0 && (
                    <div className="space-y-2">
                      {post.images.map((imageItem, index) => (
                        <div key={`image-${index}`} className="relative group overflow-hidden rounded-xl">
                          <img
                            src={imageItem.image || "/placeholder.svg"}
                            onClick={() => handleImageClick(imageItem.image)}
                            className="w-full h-auto max-h-96 object-cover cursor-pointer transition-transform group-hover:scale-105"
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
                          Your browser does not support the video tag
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
                        {post.comment_count > 0 && <span className="text-sm font-medium">{post.comment_count}</span>}
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

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseImageModal}
              className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={modal}
        isClosed={handleCloseModel}
        onSubmit={handleSubmit}
        title="Create New Post"
        submitText="Create Post"
        formData={formData}
        handleInputChange={handleInputChange}
        modalType="submit"
        isProcessingFiles={isProcessingFiles}
      />

      <Modal
        isOpen={editModal}
        isClosed={handleEditCloseModal}
        onSubmit={handleEdit}
        title="Edit Post"
        submitText="Update Post"
        formData={formData}
        handleInputChange={handleInputChange}
        modalType="edit"
      />

      <Modal
        isOpen={deleteModal}
        onSubmit={handleDelete}
        isClosed={handleDeleteCloseModal}
        title="Delete Post"
        submitText="Delete Post"
        formData={formData}
        handleInputChange={handleInputChange}
        readOnly={true}
        modalType="delete"
      />
    </div>
  )
}

export default Home
