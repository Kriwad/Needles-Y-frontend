

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Loader2 } from "lucide-react"

const Modal = ({
  isOpen,
  isClosed,
  onSubmit,
  title: modalTitle,
  submitText,
  formData,
  handleInputChange,
  readOnly = false,
  modalType,
  isProcessingFiles,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const disableSubmitButton = isProcessingFiles || isSubmitting

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      await onSubmit(e)
      setIsSubmitting(false)
    } catch (error) {
      console.log("error:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-xl bg-white shadow-2xl border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">{modalTitle}</CardTitle>
          <Button variant="ghost" size="icon" onClick={isClosed} className="h-8 w-8 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                readOnly={readOnly}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                readOnly={readOnly}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                placeholder="What's on your mind?"
              />
            </div>

            {modalType !== "edit" && modalType !== "delete" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Images
                  </Label>
                  <div className="relative  ">
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      multiple
                      readOnly={readOnly}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video" className="text-sm font-medium text-gray-700">
                    Videos
                  </Label>
                  <div className="relative">
                    <Input
                      id="video"
                      type="file"
                      name="video"
                      onChange={handleInputChange}
                      multiple
                      accept="video/*"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {isProcessingFiles && (
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
                <span className="text-sm text-blue-600">Processing files...</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={isClosed} className="px-6">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={disableSubmitButton}
                className={`px-6 min-w-[100px] ${
                  modalType === "delete"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {modalType === "delete" ? "Deleting..." : "Creating..."}
                  </div>
                ) : (
                  submitText
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Modal
