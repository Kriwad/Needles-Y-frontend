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
import { Car, Heart, MessageCircle } from "lucide-react";
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
  const [currentUser, setCurrentUser] = useState("");
  const [postData, setPostData] = useState([]);
  const [comments, setComment] = useState([]);
  const [form, setForm] = useState({
    commentcontent: "",
    post_id: "",
  });
  const resetForm = () => {
    setForm((prev) => {
      const newState = { ...prev, commentcontent: "" };
      console.log(newState.commentcontent);
      return newState;
    });
  };
  const handleCommentInput = (e) => {
    setForm((prev) => ({
      ...prev,
      commentcontent: e.target.value,
    }));
    console.log(form.commentcontent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newformData = new FormData();

    newformData.append("post_id", postId);
    newformData.append("commentcontent", form.commentcontent);
    try {
      await api.post(`/api/user/comment/create/${postId}/`, newformData);
      resetForm();
      await fetchComment();
    } catch (error) {
      console.log(error);
    }
  };
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !e.shifKey) {
  //     e.preventDefault;
  //     handleSubmit(e);
  //   }
  // };

  const fetchComment = async () => {
    try {
      const response = await api.get(`api/user/comment/get/${postId}`);
      setComment(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
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
  const handleComentLike = async (commentID)=>{
    try{
      await api.post(`/api/user/comment/like/${commentID}/`);
      await fetchComment()
    }catch(error){
      console.log(error)
    }
  }
  const userid = JSON.parse(localStorage.getItem("user_id"));
  console.log(userid);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get(`/api/user/current/`);
      setCurrentUser(response.data);
      console.log(response.data);
    } catch (error) {
      "error:", error;
    }
  };

  useEffect(() => {
    fetchPostData();
    fetchCurrentUser();
    fetchComment();
  }, []);
  return (
    <div className="  w-full h-[100%] bg-zinc-200">
      <Navbar />

      <div className=" rounded-lg pt-[70px]  flex justify-center  transition-shadow">
        <div className="w-full max-w-2xl">
          <Card
            style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)" }}
            className="mw-full  max-w-lg mx-0 px-0 rounded-lg overflow-hidden w-full"
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
            <CardContent className="pb-0 h-auto px-0">
              {/* Content Section: Title, content, Images */}

              {postData.title && (
                <h1 className="text-[15px] mt-[10px] mb-[10px] text-black  pl-5  ">
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
                      className={`size- mr-8 ml-1  ${
                        postData.is_liked
                          ? "text-red-600 fill-red-500 "
                          : `text-gray-600 fill-transparent `
                      }`}
                    ></Heart>
                  </button>
                  {postData.comment_count > 0 &&
                    <span className=" text-center text-s text-slate-600 font-semibold mr-[5px] hover:cursor-pointer hover:text-gray-600" >{postData.comment_count}</span>
                  }
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

            <div className="bg-neutral-200" >
              {comments === 0 ? (
                <p>Be the first one to comment</p>
              ) : (
                comments.map((comment) => (
                  <div key = {comment.id} className="mb-[10px] mt-[30px]  flex-col">
                    <div className="flex mt-2 flex-1 border-t-2 border-zinc-400" >

                    </div>
                    <Card className="p-0 border-none flex bg-neutral-200 items-center mt-[10px] rounded-md">
                      <Avatar className="mr-[10px] ml-[20px] ">
                        <AvatarImage
                          onClick={() =>
                            navigate(`/profile/${comment.user.id}`)
                          }
                          src={comment?.user?.image}
                        />
                        <AvatarFallback
                          onClick={() =>
                            navigate(`/profile/${comment.user.id}`)
                          }
                        >
                          {comment.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className=" flex-col flex-1 items-center min-w-0  rounded-md p-[8px] ">
                        <div>
                          <span
                            className=" font-bold "
                            onClick={() => {
                              navigate(`/profile/${comment.user.id}`);
                            }}
                          >
                            {comment.user.username}
                          </span>
                          <div className="break-words text-lg " key={comment.id}>
                            {comment.commentcontent}
                          </div>
                        </div>
                      </div>
                      {console.log(comment)}
                      <div className="flex items-center gap-2">
                        <span className=" text-center text-xs text-slate-600 font-semibold hover:cursor-pointer hover:text-gray-600" >{comment.comment_like_count}</span>
                        <button onClick={()=>handleComentLike(comment.id)} >
                            <Heart  className={`mr-[15px] size-4 ${
                              comment.is_comment_liked ? "text-red-600 fill-red-500 "
                          : `text-gray-600 fill-transparent `}`}></Heart>
                        </button>
                        
                      </div>
                    </Card>
                    <div className="ml-[60px] mt-[5px] font-bold text-sm text-zinc-500 ">
                      <span>Reply</span>
                    </div>
                    <div className="ml-[100px] font-bold text-sm text-zinc-500">
                      <span>View replies</span>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="mt-[30px] fixed bottom-0 max-w-lg w-full flex items-center rounded-md">
            <Avatar className='mr-[10px] ml-[10px]' >
              <AvatarImage src={currentUser?.image} />
              <AvatarFallback>
                <button onClick={() => navigate(`/profile/${currentUser.id}`)}>
                  {currentUser?.username?.[0]}
                </button>
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 items-center">
   
              <form onSubmit={handleSubmit} className="flex flex-1 items-center"> 
                <textarea
                  name="commentcontent"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  value={form.commentcontent}
                  onChange={handleCommentInput}
                  className="flex-1 px-3 py-2 rounded-md overflow-hidden focus:outline-none resize-none min-h-[40px]" 
                  rows="1"
                  placeholder="Type your comment..."
                >
                </textarea>
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
                </div>
              </form>
            </div>
          </Card>
          <div className="pb-[50px]"></div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
