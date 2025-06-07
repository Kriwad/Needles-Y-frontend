
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import api from "../api"

import Commentmodal from "../Modals/Commentmodal"
import Modal from "../Modals/Modal"
import Navbar from "../Modals/Navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart,User , MessageCircle, MoreHorizontal, Edit3, Trash2, Send, Smile, Clock, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"


function UltimateComment() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [posteditModal , setposteditModal]= useState(false)
  const [postdeleteModal , setpostdeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [postData, setPostData] = useState({})
  const [comments, setComment] = useState([])
  const [postform , setPostForm] = useState({
    'title': "",
    "content": "",
    "image": null,
    "video": null
  })
  const [postcommentform, setpostcommentForm] = useState({
    commentcontent: "",
    post_id: "",
  })
  const [editcommentform, seteditcommentForm] = useState({
    commentcontent: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshComment, setrefreshComment] = useState(0)
  const [selectedComment, setSelectedComment] = useState(null)
  const [postLike , setPostLike] = useState({})
  const [commentLikes, setCommentLikes] = useState({})
  const textareaRef = useRef(null)

  const resetpostcommentForm = () => {
    setpostcommentForm((prev) => ({
      ...prev,
      commentcontent: "",
    }))
  }
  const resetFormData = ()=>{
    setPostForm({
      title : "",
      content : "",
      image : null,
      video : null,
    })
  }
  const handlePostEditOpenModal = ()=>{
    setposteditModal(true)
    setPostForm({
      title: postData.title,
      content : postData.content,
      image : null,
      video : null

    })
  }
  const handlePostEditCloseModal = ()=>{
    setposteditModal(false)
    resetFormData()
  }
  
  const handleposteditInput = (e)=>{
    const {name , value} = e.target;
    setPostForm((prev)=>({
      ...prev, [name]: value
    }))
  }
  const handlepostEdit =async(e)=>{
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("title", postform.title)
    formdata.append("content" , postform.content)
    try{
      await api.patch(`/api/user/post/edit/${postId}/`,formdata)
      await fetchPostData()
      handlePostEditCloseModal()
    }catch(error){
      console.log(error)
    }
  }
  const handlePostDeleteOpenModal = ()=>{
    setpostdeleteModal(true)
    setPostForm({
      title: postData.title,
      content : postData.content

    })
  }
  const handlePostDeleteCloseModal = ()=>{
    setpostdeleteModal(false)

  }
  const handlepostDelete = async(e)=>{

    e.preventDefault()
    try{

      await api.delete(`/api/user/post/edit/${postId}/`);
      handlePostDeleteCloseModal()
      navigate("/")

    }catch(error){
      console.log(error)
    }

  }

  const handleEditOpenModal = (comment) => {
    setEditModal(true)
    setSelectedComment(comment)
    seteditcommentForm((prev) => ({
      ...prev,
      commentcontent: comment.commentcontent,
    }))
  }

  const handleEditCloseModal = () => {
    setEditModal(false)
    setSelectedComment(null)
    seteditcommentForm({ commentcontent: "" })
  }

  const handleCommentEdit = async (e) => {
    if (!selectedComment) return
    e.preventDefault()

    const formData = new FormData()
    formData.append("commentcontent", editcommentform.commentcontent)
    try {
      await api.patch(`/api/user/edit/comment/${selectedComment.id}/`, formData)
      await fetchComment()
      handleEditCloseModal()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteOpenModal = (comment) => {
    setDeleteModal(true)
    setSelectedComment(comment)
  }

  const handleDeleteCloseModal = () => {
    setDeleteModal(false)
    setSelectedComment(null)
  }

  const handleCommentDeletion = async (e) => {
    e.preventDefault()
    try {
      await api.delete(`/api/user/edit/comment/${selectedComment.id}/`)
      setrefreshComment((prev) => prev + 1)
      handleDeleteCloseModal()
    } catch (error) {
      console.log(error)
    }
  }

  const handleCommentInput = (e) => {
    setpostcommentForm((prev) => ({
      ...prev,
      commentcontent: e.target.value,
    }))
  }

  const handleCommentEditInput = (e) => {
    seteditcommentForm((prev) => ({
      ...prev,
      commentcontent: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || !postcommentform.commentcontent.trim()) return

    setIsSubmitting(true)
    const newformData = new FormData()
    newformData.append("post_id", postId)
    newformData.append("commentcontent", postcommentform.commentcontent)

    try {
      await api.post(`/api/user/post/comment/${postId}/`, newformData)
      resetpostcommentForm()
      setrefreshComment((prev) => prev + 1)
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const fetchComment = async () => {
    try {
      const response = await api.get(`api/user/post/comment/${postId}`)
      setComment(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPostData = async () => {
    try {
      const res = await api.get(`api/user/list/post/comment/${postId}/`)
      setPostData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLike = async (postID) => {
    setPostLike((prev)=>!prev)
    try {
      await api.post(`/api/user/post/like/${postID}/`)
      fetchPostData()
    } catch (error) {
      setPostLike((prev)=>!prev)
      console.log(error)
    }
  }

  const handleCommentLike = async (commentID) => {
   
    setCommentLikes((prev) => ({
      ...prev,
      [commentID]: !prev[commentID],
    }))

    try {
      await api.post(`/api/user/comment/like/${commentID}/`)
      await fetchComment()
    } catch (error) {
      // Revert optimistic update on error
      setCommentLikes((prev) => ({
        ...prev,
        [commentID]: !prev[commentID],
      }))
      console.log(error)
    }
  }

  const userid = JSON.parse(localStorage.getItem("user_id"))

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get(`/api/user/current/`)
      setCurrentUser(response.data)
    } catch (error) {
      console.log("error:", error)
    }
  }

  useEffect(() => {
    fetchPostData()
    fetchCurrentUser()
    fetchComment()
  }, [refreshComment])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="pt-20 pb-32 px-4">
        <div className="max-w-lg mx-auto">
          {/* Main Post Card */}
          <Card className="mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarImage src={postData?.user?.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-500  text-white font-semibold">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                   
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => navigate(`/profile/${postData.user?.id}`)}
                    >
                      {postData?.user?.username}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {postData?.created_at && formatDistanceToNow(new Date(postData.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {userid === postData?.user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={()=>handlePostEditOpenModal()} className="text-blue-600 focus:text-blue-600">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>handlePostDeleteOpenModal()}  className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {postData.title && <h2 className="text-xl font-bold text-gray-900 mb-3">{postData.title}</h2>}

              {postData.content && (
                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{postData.content}</p>
              )}

              {postData.images?.length > 0 && (
                <div className="grid gap-2 mb-4">
                  {postData.images.map((image, index) => (
                    <div key={`image-${image.id}`} className="relative group overflow-hidden rounded-xl">
                      <img
                        src={image.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-auto max-h-96 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              )}

              {postData.videos?.length > 0 && (
                <div className="grid gap-2 mb-4">
                  {postData.videos.map((video) => (
                    <div key={`video-${video.id}`} className="relative rounded-xl overflow-hidden">
                      <video controls src={video.video} className="w-full h-auto max-h-96 object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(postData.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
                  >
                    <Heart
                      className={`h-5 w-5 transition-all group-hover:scale-110 ${
                        postData.is_liked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span className="font-medium">{postData.like_count || 0}</span>
                  </button>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{comments.length}</span>
                  </div>

                 
                </div>

                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>
                
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Be the first to share your thoughts and get the discussion going!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="group relative animate-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-3 p-4 rounded-2xl hover:bg-gray-50/80 transition-all duration-200">
                        <Avatar className="h-9 w-9 ring-2 ring-gray-100 flex-shrink-0">
                          <AvatarImage
                            src={comment?.user?.image || "/placeholder.svg"}
                            className="cursor-pointer"
                            onClick={() => navigate(`/profile/${comment.user.id}`)}
                          />
                          <AvatarFallback
                            className="bg-blue-500  text-white text-sm font-medium cursor-pointer"
                            onClick={() => navigate(`/profile/${comment.user.id}`)}
                          >
                             <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-2xl px-4 py-3 relative">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4
                                  className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                                  onClick={() => navigate(`/profile/${comment.user.id}`)}
                                >
                                  {comment.user.username}
                                </h4>
                                <p className="text-gray-700 mt-1 leading-relaxed break-words">
                                  {comment.commentcontent}
                                </p>
                              </div>

                              {comment?.user?.id === currentUser.id && (
                                <div className="ml-3 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-200">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      <DropdownMenuItem
                                        onClick={() => handleEditOpenModal(comment)}
                                        className="text-blue-600 focus:text-blue-600"
                                      >
                                        <Edit3 className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteOpenModal(comment)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-2 ml-1">
                            <span className="text-xs text-gray-500 font-medium">
                              {formatDistanceToNow(new Date(comment.created_at || Date.now()), { addSuffix: true })}
                            </span>

                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors group"
                            >
                              <Heart
                                className={`h-3 w-3 transition-all group-hover:scale-110 ${
                                  comment.is_comment_liked || commentLikes[comment.id]
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                              {comment.comment_like_count > 0 && (
                                <span className="font-medium">{comment.comment_like_count}</span>
                              )}
                            </button>

                            <button className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="max-w-2xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-gray-100 flex-shrink-0">
              <AvatarImage src={currentUser?.image || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-500  text-white text-sm font-medium">
                 <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                name="commentcontent"
                value={postcommentform.commentcontent}
                onChange={handleCommentInput}
                onKeyPress={handleKeyPress}
                onInput={(e) => {
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                }}
                disabled={isSubmitting}
                placeholder="Write a thoughtful comment..."
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 min-h-[48px] max-h-[120px]"
                rows="1"
              />

              
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !postcommentform.commentcontent.trim()}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700  text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm">Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span className="text-sm font-medium">Send</span>
                </div>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>{postcommentform.commentcontent.length}/500</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Commentmodal
        isOpen={editModal}
        onChange={handleCommentEditInput}
        isCLosed={handleEditCloseModal}
        form={editcommentform}
        onSubmit={handleCommentEdit}
        title={"Edit comment"}
        modalType={"edit"}
      />
      <Commentmodal
        isOpen={deleteModal}
        readOnly={true}
        isCLosed={handleDeleteCloseModal}
        form={editcommentform}
        onSubmit={handleCommentDeletion}
        title={"Delete comment"}
        modalType={"delete"}
      />
      <Modal
        isOpen= {posteditModal}
        formData={ postform}
        isClosed={handlePostEditCloseModal}
        onSubmit={handlepostEdit}
        handleInputChange={handleposteditInput}
        title="Edit Post"
        submitText="Update Post"
        modalType="edit"

      
      />
      <Modal
        isOpen= {postdeleteModal}
        formData={postData}
        isClosed={handlePostDeleteCloseModal}
        onSubmit={handlepostDelete}
        title="Delete Post"
        submitText="Delete Post"
        modalType="delete"

      
      />
    </div>
  )
}

export default UltimateComment
