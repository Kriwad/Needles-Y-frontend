import React, { useEffect } from 'react'
import { useRef , useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {User , Send , XCircle}from "lucide-react"
import { Button } from '../components/ui/button'
import api from '../api'

function CommentInput({  replyID , currentUser , replyUsername ,refreshComment , handleCancelReply, postId , handleKeyPress}) {
    const textareaRef = useRef(null)
    
    const [comment , setComment]= useState({
        post_id : "",
        commentcontent : ""
    })
    const [isSubmitting , setIsSubmitting] =useState(false)
    const handleInputChange=(e)=>{
        const {name , value }  = e.target;
        setComment((prev)=>({
            ...prev, [name]: value 
    }))}
    const resetComment = ()=>{

        setComment({commentcontent : ""})
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    const newformData = new FormData()
    
    newformData.append("post_id", postId)
    newformData.append("commentcontent", comment.commentcontent)

    try {
      await api.post(`/api/user/post/comment/${postId}/`, newformData)
      
      resetComment()
      refreshComment()
      if (handleCancelReply) handleCancelReply()
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  console.log(replyID)
  console.log(replyUsername)
 
  return (
     <div className="max-w-2xl mx-auto p-4">

        {replyID && replyUsername &&(
            <div className='text-sm gap-5 text-gray-600 flex items-center' >
              

                <Button variant = "ghost" size ="sm" onClick={handleCancelReply}className="h-6 px-2 text-blue-600 hover:bg-blue-50 " ><XCircle/></Button>
                <div>
                     Replying to <span className='font-semibold ml-1' >
                    @{replyUsername}
                </span>
                    
                </div>
               
            </div>
        )}
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
                value={comment.commentcontent}
                onChange={handleInputChange}
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
              disabled={isSubmitting }
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
            <span>{comment.commentcontent.length}/500</span>
          </div>
        </div>
  )
}

export default CommentInput