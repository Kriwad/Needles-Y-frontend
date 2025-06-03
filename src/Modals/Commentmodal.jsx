"use client"

import { useEffect, useState } from "react"
import api from "../api"

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Card } from "@/Components/ui/card"

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
        <Card className="max-w-xl w-full flex items-center rounded-lg">
          <Avatar className="mr-[10px] ml-[10px]">
            <AvatarImage src={currentUser?.image || "/placeholder.svg"} />
            <AvatarFallback>{currentUser?.username?.[0]}</AvatarFallback>
          </Avatar>

          <form onSubmit={handleSubmit} className="flex flex-1 items-center">
            <textarea
              name="editcommentcontent"
              onInput={(e) => {
                e.target.style.height = "auto"
                e.target.style.height = e.target.scrollHeight + "px"
              }}
              value={form.commentcontent}
              onChange={onChange}
              className="flex-1 px-3 py-2 rounded-md overflow-hidden focus:outline-none resize-none min-h-[40px]"
              rows="1"
              placeholder="Edit comment..."
            ></textarea>
            <div className="ml-2 mr-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-2
                  text-white
                  rounded-lg
                  font-semibold
                  text-sm
                  tracking-wide
                  flex items-center justify-center
                  transition-all
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  shadow-lg
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 hover:shadow-xl"
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                onClick={isCLosed}
                className="
                  px-4 py-2
                  text-gray-700
                  bg-gray-100
                  hover:bg-gray-200
                  rounded-lg
                  font-medium
                  text-sm
                  transition-colors
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-500
                  focus:ring-offset-2
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )
    } else if (modalType === "delete") {
      return (
        <div className="space-y-4 bg-white p-6 rounded-2xl text-center shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">Are you sure you want to delete this comment?</p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={isCLosed}
              disabled={isSubmitting}
              className="
                px-6 py-3
                text-gray-700
                bg-gray-100
                hover:bg-gray-200
                rounded-lg
                font-medium
                text-sm
                transition-colors
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-gray-500
                focus:ring-offset-2
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className={`
                px-6 py-3
                text-white
                rounded-lg
                font-semibold
                text-sm
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                shadow-lg
                flex items-center justify-center
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500 hover:shadow-xl"
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={isCLosed}>
      <div onClick={(e) => e.stopPropagation()}>{rendermodalcontent()}</div>
    </div>
  )
}

export default Commentmodal
