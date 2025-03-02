import React from "react";

const UsernameModal = ({
  isOpen,
  isClosed,
  onSubmit,
  title: modalTitle,
  handleInputChange,
  formData,
  modalType,
  submitText, 
  readOnly = false,
}) =>{
    if (!isOpen) return null;
    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{modalTitle}</h2>
            <button
              onClick={isClosed}
              className="text-gray-500 hover:text-gray-700 "
            >
              &times;
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                FullName
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                readOnly={true}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <textarea
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                rows="4"
                readOnly={readOnly}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                readOnly={readOnly}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
              type = "file"
                name="image"
                onChange={handleInputChange}
                accept="image/"
                multiple
                readOnly={readOnly}
               
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></input>
            </div>
  
            <div className="flex justify-end">
              <button
                type="submit"
                
                className={modalType === "delete" ? "bg-red-600 rounded-md text-white px-4 py-2 hover:bg-red-900" : "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"}
              >
                {submitText}
              </button>
              
            </div>
          </form>
        </div>
      </div>
    
    
    
    
    
    )
}

export default UsernameModal;
