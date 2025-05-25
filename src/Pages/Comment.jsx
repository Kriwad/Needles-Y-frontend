import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Modal from "../Modals/Modal";
import Navbar from "../Modals/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown";
import { Heart, MessageCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow, set } from "date-fns";
import {
  faEllipsisV,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { EraserIcon } from "lucide-react";
function Comment() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [currentUser , setCurrentUser] = useState("");
  const [postData, setPostData] = useState([]);
  const [comment , setComment] = useState([]);
  const [form , setForm] = useState({
    commentcontent :"",
    post_id : ""
  })
  const resetForm = ()=>{
    setForm((prev)=>{
       const newState = {...prev , commentcontent : "" }
       console.log(newState.commentcontent)
       return newState
    })
  }
  const handleCommentInput = (e)=>{
    setForm((prev)=>({
        ...prev , commentcontent: e.target.value
    }))
    console.log(form.commentcontent)
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const newformData = new FormData()
    
    newformData.append("post_id", postId);
    newformData.append("commentcontent", form.commentcontent)
    try{
        await api.post(`/api/user/comment/create/${postId}/`, newformData )
        resetForm()
        await fetchComment()

    }
    catch(error){
        console.log(error)
    }

  }
  const handleKeyDown = (e)=>{
    
    if (e.key === "Enter" && !e.shifKey){
        e.preventDefault;
        handleSubmit(e)
    }
  }

  const fetchComment = async ()=>{
    try{
        const response = await api.get(`api/user/comment/get/${postId}`)
        setComment(response.data)
        console.log(response.data)
    }
    catch(error){
        console.log(error)
    }
  }
  const fetchPostData = async () => {
    try {
      const res = await api.get(`api/user/list/post/comment/${postId}/`);
      setPostData(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async (postID) => {
    try {
      await api.post(`/api/user/post/like/${postID}/`);
      fetchPostData();
    } catch (error) {
      console.log(error);
    }
  };
  const userid = JSON.parse(localStorage.getItem("user_id"));
  console.log(userid);

  const fetchCurrentUser = async ()=>{
    try{
        const response = await api.get(`/api/user/current/`)
        setCurrentUser(response.data)
        console.log(response.data)
    }
    catch(error){
        "error:" , error
    }
  }

  useEffect(() => {
    fetchPostData();
    fetchCurrentUser();
  }, []);
  return (
    <div className="  w-full h-[100%] bg-zinc-200">
      <Navbar />

      <div className=" rounded-lg pt-[70px]  flex justify-center  transition-shadow">
        <div className="w-full max-w-2xl">
          <Card
            style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)" }}
            className="mw-full max-w-2xl mx-0 px-0 rounded-lg overflow-hidden w-full"
          >
            <CardHeader className="flex  flex-row items-center  justify-between mx-5 space-y-4 ">
              {/* Left Side: Avatar + Username + Date */}
              <div className="flex gap-2">
                <Avatar className="h-10 w-10  ">
                  <AvatarImage src={postData?.user?.image} />
                  <AvatarFallback
                    onClick={() => navigate(`/profile/${postData.user.id}`)}
                  >
                    {postData?.user?.username[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <h2
                    onClick={() => navigate(`/profile/${postData.user.id}`)}
                    className="text-sm font-bold hover:underline cursor-pointer"
                  >
                    {postData?.user?.username}
                  </h2>
                  <p className="text-xs font-extralight text-gray-500">
                    {postData?.created_at &&
                      formatDistanceToNow(new Date(postData.created_at), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
              </div>

              <div>
                {userid === postData?.user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="h-4 w-4"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {/* Right Side: Dropdown (if user is the owner) */}
            </CardHeader>
            <CardContent className="mb-0 pb-0 h-auto px-0">
              {/* Content Section: Title, content, Images */}

              {postData.title && (
                <h1 className="text-lg pl-5 font-semibold mt-2">
                  {postData.title}
                </h1>
              )}

              {postData.content && (
                <h1 className="text-sm w-[95%] pl-5 text-muted-foreground whitespace-pre-wrap mt-1 break-words">
                  {postData.content}
                </h1>
              )}

              {postData.images?.length > 0 &&
                postData.images.map((image) => (
                  <div className="h-auto" key={`image-${image.id}`}>
                    <img
                      src={image.image}
                      className="mt-2 px-0 w-[100%]  h-auto  max-h-[500px] rounded-s"
                      alt="Comment Image"
                    />
                  </div>
                ))}
              {postData.videos?.length > 0 &&
                postData.videos.map((video) => (
                  <CardContent key={`videos-${video.id}`} type="video/mp4">
                    <video controls src={video.video}></video>
                  </CardContent>
                ))}

              <div className="pt-2 mt-5  flex justify-end border-t-2  border-slate-300">
                <div className="flex items-center">
                  {postData.like_count > 0 && (
                    <span
                      onClick={() => navigate(`/liked/${postData.id}`)}
                      className=" text-center text-s text-slate-600 font-semibold hover:cursor-pointer hover:text-gray-600"
                    >
                      Liked by {postData.like_count}
                    </span>
                  )}
                  <button onClick={() => handleLike(postData.id)}>
                    <Heart
                      className={`size-5 mr-8 ml-1  ${
                        postData.is_liked
                          ? "text-red-600 fill-red-500 "
                          : `text-gray-600 fill-transparent `
                      }`}
                    ></Heart>
                  </button>

                  <button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => navigate(`/comment/${post.id}/`)}
                  >
                    <MessageCircle className="mr-7 size-5" />
                  </button>
                </div>
              </div>
            </CardContent>
                {/* <div className="bg-red-400 flex h-[auto] mt-[30px] px-5 pt-5" >
                    <div className="bg-green-400 mb-5 w-[100%] mx-[10px]" >
                        wkdw
                    </div>
                        
                    <Heart>
                    </Heart>

                </div> */}

          </Card>

          <div className="mt-5 relative">
            <Card className="p-0 mb-[6px] px-10 rounded-md">
              {/* Relative wrapper for absolute layout */}
              <div className="relative min-h-[60px]">
                {/* Avatar absolutely positioned at bottom-left */}
                <div className="absolute bottom-2 left-0">
                  <Avatar>
                    <AvatarImage src={currentUser?.image} />
                    <AvatarFallback>
                      <button
                        onClick={() =>
                          navigate(`/profile/${currentUser?.user?.id}`)
                        }
                      >
                        {currentUser?.username?.[0]}
                        
                      </button>
                    </AvatarFallback>
                  </Avatar>
                </div>
                <form onSubmit={handleSubmit} >
                    <div className="flex" >
                        <textarea
                        name = "commentcontent"
                        onKeyDown={handleKeyDown}
                        onInput={(e)=>{
                            e.target.style.height= "auto"
                            e.target.style.height= e.target.scrollHeight + "px"
                        }}
                        value = {form.commentcontent}
                        onChange={handleCommentInput}
                        className="w-full pl-14 pr-3 py-2 rounded-md overflow-hidden focus:outline-none resize-none min-h-[40px]"
                        rows="1"
                        placeholder="Type your comment..."
                        ></textarea>
                        <button type = 'submit'>
                            send
                        </button>
                    </div>
                    
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
