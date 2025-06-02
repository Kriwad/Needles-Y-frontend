import React, { useEffect, useState } from "react";
import api from "../api";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
function Commentmodal({
  isOpen,
  isCLosed,
  onSubmit,
  form,
  onChange,
  modalType,
  readOnly = false,
}) {
  const [currentUser, setCurrentUser] = useState({
    id: "",
    username: "",
    fullname: "",
    image: "",
  });
  const fetchUser = async () => {
    const userID = localStorage.getItem("user_id");
    try {
      const response = await api.get(`api/user/profile/${userID}/`);
      setCurrentUser(response.data);
      console.log(currentUser);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  if (!isOpen) {
    return null;
  }
  return (
    <Card className="mt-[30px] fixed bottom-0 max-w-lg w-full flex items-center rounded-md">
      <Avatar className="mr-[10px] ml-[10px]">
        <AvatarImage src={currentUser?.image} />
        <AvatarFallback>
          
            {currentUser?.username?.[0]}

        </AvatarFallback>
      </Avatar>
      <div>
        <form onSubmit={onSubmit} className="flex flex-1 items-center">
          <textarea
            name="commentcontent"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            value={form.commentcontent}
            onChange={onChange}
            className="flex-1 px-3 py-2 rounded-md overflow-hidden focus:outline-none resize-none min-h-[40px]"
            rows="1"
            placeholder="Type your comment..."
          ></textarea>
          <div className="ml-2 mr-2">
            <button
              className="
                      px-4 py-2
                      bg-blue-600
                      text-white
                      rounded-lg
                      font-semibold
                      text-sm
                      tracking-wide
                      flex items-center justify-center
                      transition-colors
                      duration-200
                      hover:bg-blue-700
                      active:bg-blue-800
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-400
                      focus:ring-opacity-75
                    "
              type="submit"
            >
              send
            </button>
            <button type="button" onClick={isCLosed}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default Commentmodal;
