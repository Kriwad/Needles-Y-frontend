

import { useEffect, useState } from "react"
import api from "../api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Trash2 } from "lucide-react"

function Commentmodal({ isOpen, isCLosed, onSubmit, form, title, onChange, modalType, readOnly = false }) {
  const [currentUser, setCurrentUser] = useState({
    id: "",
    username: "",
    fullname: "",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUser = async () => {
    const userID = localStorage.getItem("user_id")
    try {
      const response = await api.get(`api/user/profile/${userID}/`)
      setCurrentUser(response.data)
      console.log(currentUser)
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchUser()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(e)
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (e) => {
    if (isSubmitting) return
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(e)
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const rendermodalcontent = () => {
    if (modalType === "edit") {
      return (
        <Card className="max-w-xl w-full bg-white shadow-2xl border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100 flex-shrink-0">
                <AvatarImage src={currentUser?.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <form onSubmit={handleSubmit} className="flex-1 space-y-3">
                <Textarea
                  name="editcommentcontent"
                  value={form.commentcontent}
                  onChange={onChange}
                  className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  placeholder="Edit your comment..."
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={isCLosed} disabled={isSubmitting} className="px-4">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )
    } else if (modalType === "delete") {
      return (
        <Card className="max-w-md w-full bg-white shadow-2xl border-0">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <Button type="button" variant="outline" onClick={isCLosed} disabled={isSubmitting} className="px-6">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={isCLosed}
    >
      <div onClick={(e) => e.stopPropagation()}>{rendermodalcontent()}</div>
    </div>
  )
}

export default Commentmodal
