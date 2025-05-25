

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEdit, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import { Heart, MessageCircle } from "lucide-react";

import Navbar from "../Modals/Navbar";
import Modal from "../Modals/Modal";
import UsernameModal from "../Modals/UsernameModal";
import api from "../api";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
 

  // States
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    image: null,
    bio: "",
  });
  
  const [currentUser , setCurrentUser] = useState("")
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    video: null,
  });
  const [likedPost , setIsLikedPost] = useState({})


  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUpdated , setProfileUpdated] = useState(false)

  const handleLike = async (postID)=>{
    try{
      await api.post(`api/user/post/like/${postID}/`)
      await fetchPosts()
    }catch(error){
      console.log("error:" , error)
    }
    setIsLikedPost((prev)=> ({
      ...prev,
      [postID] : !prev[postID] 
    }))
  }

  // Input handlers
  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file"){
      setFormData((prev)=>({
        ...prev , [name] : files[0]
      }))
    }else{
      setFormData((prev)=>({
        ...prev , [name]: value,
      }))
    }
  };

  

 

  // API calls
  const fetchUser = async () => {
    try {
      const response = await api.get(`api/user/profile/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const fetchCurrentUser = async ()=>{
    try {
      const response = await api.get('api/user/current/');
      setCurrentUser(response.data.id)
    }catch(error){
      console.log("error" , error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await api.get(`api/user/profile/posts/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, files } = e.target;
   
    if (type === "file"){
      setUser((prev)=>({
        ...prev , [name] : files[0]
      }))
    }else{
      setUser((prev)=>({
        ...prev , [name]: value,
      }))
    }
    
  };
  // Form submissions
  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData){
      if (formData[key] instanceof FileList){
        for (let i = 0 ; i < formData[key].length ; i++){
          formDataToSend.append(`${key}`,formData[key][i])
        }
      }else if (formData[key]) {
        formDataToSend.append(key , formData[key])
      }
    }

    try {
      await api.post(`api/user/post/`, formDataToSend);
      await fetchPosts();
      setShowCreateModal(false);
      setFormData({ title: "", content: "", image: null, video: null });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append("title" , formData.title)
    formDataToSend.append("content" , formData.content)
    if (formData.image){
      formDataToSend.append("image" , formData.image)

    }
    if (formData.video){
      formDataToSend.append("video" , formData.video)
    }
    try {
      await api.put(`/api/user/post/edit/${selectedPost.id}/`, formDataToSend);
      await fetchPosts();
      setShowEditModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/api/user/post/edit/${selectedPost.id}/`);
      await fetchPosts();
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("fullname" , user.fullname)
    formDataToSend.append("username" , user.username)
    formDataToSend.append("bio" , user.bio)
    if (user.image instanceof File){
      formDataToSend.append("image" , user.image)

    }

    try {
      await api.patch(`api/user/profile/${userId}/`, formDataToSend)
      setProfileUpdated(prev => !prev);
      await fetchUser();
      await fetchCurrentUser();
      await fetchPosts();
      setShowProfileModal(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
    fetchPosts();
  }, []);

  return (
    <div className="w-[100%] h-[100%] bg-zinc-200">
      <Navbar onOpenModal={() => setShowCreateModal(true)} profileUpdated={profileUpdated} />
      
      {/* Profile Card */}
      <div className="container mx-auto border-b-[20px]">
        <Card  style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'}} className="w-full  max-w-lg mx-auto rounded-md">
          <div className="relative h-48 bg-slate-300">
            <Avatar
              className="absolute top-10 left-24 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 border-4 border-white"
              onClick={user && user.id === currentUser ? () => navigate("/") : undefined}
            >
              <AvatarImage className=" h- " src={user?.image || "/placeholder.svg"} alt={user?.fullname} />
              <AvatarFallback>{user?.fullname?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <CardContent className="pt-20 px-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold">{user?.fullname}</h1>
                <p className="text-xl text-gray-600">@{user?.username}</p>
              </div>
              {user && user.id === currentUser && (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-gray-600 hover:text-black"
                >
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              )}
            </div>
            <p className="text-gray-700">{user?.bio || "No bio provided"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="container mx-auto">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          posts.map(post => (
            <Card key={post.id} style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'}} className="max-w-lg mx-auto px-0 mb-[18px] rounded-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3 pl-5">
                  <Avatar className="h-10 w-10  ">
                    <AvatarImage src={post.user.image || "/placeholder.svg"} />
                    <AvatarFallback>{post.user.fullname[0]}</AvatarFallback>
                  </Avatar>
                  <div  >
                    <p className="font-semibold">{post.user.username}</p>
                    <p className="text-xs font-extralight text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {user && currentUser === user.id && (
                  <DropdownMenu  >
                    <DropdownMenuTrigger>
                      <FontAwesomeIcon className="pr-5" icon={faEllipsisV} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedPost(post);
                        setFormData({ title: post.title, content: post.content });
                        setShowEditModal(true);
                      }}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedPost(post);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>

              <CardContent className=" h-auto px-0 " >
                <h3 className="text-lg mt-5 pl-5 font-semibold">{post.title}</h3>
                <p className="text-gray-700 pl-5 mt-2">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="h-auto ">
                    {post.images.map((imageItem , index)=>(
                      <img key={`image: ${index}`} src={imageItem.image} alt=""className="mt-2 px-0 w-full h-auto max-h-[600px] object-contain rounded-s" />
                    ))}
                  </div>
                  
                )}
                {post.videos && post.videos.length > 0 && (
                  <div>
                    {post.videos.map((videoItem , index)=>(
                      <video controls className="mt-2 px-0 w-full h-auto max-h-[600px] object-contain rounded-s">
                        <source key={`video:${index}`} src={videoItem.video} type="video/mp4" />
                      </video>
                    ))}
                  </div>
                  
                  
                )}
                <div className=" pt-2 mt-5 flex justify-end border-t-2  border-slate-300
                 ">
                  <div className="flex items-center" >
                    {post.like_count > 0 &&<span onClick={()=>navigate(`/liked/${post.id}/`)} className="mr-1 text-center text-s text-slate-600 font-semibold hover:cursor-pointer hover:text-gray-400" >Liked by {post.like_count}</span> }
                      <button onClick={()=>handleLike(post.id)}  className="  text-primary ">
                        <Heart  className={` size-5  mr-8 ml-1 ${post.is_liked ? 'text-red-600 fill-red-500':'text-gray-600 fill-transparent' }`  } />
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
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <UsernameModal
        isOpen={showProfileModal}
        isClosed={()=> setShowProfileModal(false)}
        onSubmit={handleProfileEdit}
        title="Edit Profile"
        submitText="Save"
        formData={user}
        handleInputChange={handleProfileChange}
        modalType="edit"
      />

      <Modal
        isOpen={showCreateModal}
        isClosed={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
        title="Create New Post"
        submitText="Create"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="submit"
      />

      <Modal
        isOpen={showEditModal}
        isClosed={() => setShowEditModal(false)}
        onSubmit={handleEditPost}
        title="Edit Post"
        submitText="Update"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="edit"
      />

      <Modal
        isOpen={showDeleteModal}
        isClosed={() => setShowDeleteModal(false)}
        onSubmit={handleDeletePost}
        title="Delete Post"
        submitText="Delete"
        formData={formData}
        handleInputChange={handleFormChange}
        readOnly={true}
        modalType="delete"
      />
    </div>
  );
}

export default Profile;