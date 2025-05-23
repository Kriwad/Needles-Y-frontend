import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";

import { Heart, MessageCircle} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown";
import Navbar from "../Modals/Navbar";

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrash,
  
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../Modals/Modal";

import { formatDistanceToNow, set } from "date-fns";


function Home() {
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectPost, setSelectPost] = useState(null);
  const [search, setSearch] = useState("");
  const [likedPost , setLikedPost] = useState({})
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    video: null,
  });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedimage] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleLike= async (postID)=>{
    try{
      await api.post(`/api/user/post/like/${postID}/`)
      await fetchPosts()
    }catch(error){
      console.log("error:",error)
    }
    
    setLikedPost((prev)=>({
      ...prev,
      [postID]: !prev[postID] 
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: null,
      video: null,
    });
    setSelectPost(null);
  };

  // handels image opening
  const handleImageClick = (imageUrl) => {
    setSelectedimage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedimage(null);
    setImageModalOpen(false);
  };

  // handles posting modal
  const handleOpenModal = () => {
    resetForm();
    setModal(true);
  };
  const handleCloseModel = () => {
    resetForm();
    setModal(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };


  // handles creating a post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] instanceof FileList) {
        for (let i = 0; i < formData[key].length; i++) {
          formDataToSend.append(`${key}`, formData[key][i]);
        }
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    try {
      await api.post("/api/user/post/", formDataToSend);
      await fetchPosts(); // Refresh the posts list
      handleCloseModel(); // Close the modal
      
     
    } catch (error) {
      console.log("error:", error);
      handleCloseModel(); // Close the modal even if there's an error
    }
  };

  // handels edit modal
  const handleEditOpenModal = (post) => {
    setEditModal(true);
    setSelectPost(post);
    setFormData({
      title: post.title,
      content: post.content,
    });
  };
  const handleEditCloseModal = () => {
    setEditModal(false);
    resetForm();
  };

  // handels editing of a post
  const handleEdit = async (e) => {
    if (!selectPost) return;
    e.preventDefault();
    const formDataToSend = new FormData();
    

    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    if (formData.video) {
      formDataToSend.append("video", formData.video);
    }

    try {
      await api.put(`/api/user/post/edit/${selectPost.id}/`, formDataToSend);
      handleEditCloseModal();
      await fetchPosts();
      
    } catch (error) {
      console.log("error");
    }
  };

  

  // handles delete modal
  const handleDeleteOpenModal = (post) => {
    setDeleteModal(true);
    setSelectPost(post);
    setFormData({
      title: post.title,
      content: post.content,
    });
  };

  const handleDeleteCloseModal = async () => {
    setDeleteModal(false);
  };

  const handleDelete = async (e) => {
    if (!selectPost) return;
    e.preventDefault();
    try {
      await api.delete(`/api/user/post/edit/${selectPost.id}/`, formData);
      await fetchPosts();
      handleDeleteCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await api.get("/api/user/current/");
      setUser(user.data);
      console.log(user.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/user/post/list/");
      setPosts(response.data);

      const likedPostObject = {}
      response.data.forEach(post => {
        if(post.is_liked){
          likedPostObject[post.id]= true;
        }
      });
      setLikedPost(likedPostObject)

      console.log(response.data);
    } catch (error) {
      console.log("Problem fetching your data:", error);
    }
  };
  return (
    <>
      <div className="w-1vh h-1vh bg-zinc-200">
        <Navbar
          
       
          onOpenModal={handleOpenModal}
        />

        {/* Post List Display */}
        <div className="container pt-[60px] mx-auto ">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              No Needles found. Add one!
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className=" rounded-lg  transition-shadow">
                <div className="container flex justify-center  mx-auto">
                  <Card key={post.id} style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'}} className="mw-full max-w-2xl mx-0 px-0 rounded-lg overflow-hidden mb-[18px]  w-full">
                    <CardHeader className="flex  flex-row items-center  justify-between space-y-0 ">
                      <div className="flex items-center gap-3 pl-5  ">
                        <Avatar className="h-10 w-10  " >
                          <AvatarImage
                            src={
                              post.user.image ||
                              "/placeholder.svg? height=40&width=40"
                            }
                            alt={post.user.username}
                          />
                          <AvatarFallback  onClick={()=> navigate(`/profile/${post.user.id}`)} >
                            {post.user.fullname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p
                            className="text-sm p-0 font-bold  hover:underline cursor-pointer "
                            onClick={() => navigate(`profile/${post.user.id}`)}
                            
                          >
                            {post.user.username}
                          </p>
                          <p className="text-xs text-center font-extralight text-muted-foreground">
                            {post.created_at &&
                              formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                              })}
                          </p>
                        </div>
                      </div>
                      {user && user.username === post.user.username && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8">
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                className="h-4 w-4"
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditOpenModal(post)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOpenModal(post)}
                              className="text-red-600"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="mr-2"
                              />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardHeader>
                    <CardContent className=" mb-0 pb-0 h-auto px-0">
                      <h3 className="text-lg pl-5 font-semibold mt-2">
                        {post.title}
                      </h3>
                      <p className="text-sm w-[95%] pl-5 text-muted-foreground whitespace-pre-wrap mt-1 break-words">
                        {post.content}
                      </p>
                      {post.images && post.images.length > 0 &&(
                      <div className="h-auto" >  
                        {post.images.map((imageItem , index)=>(
                            <img 
                            key={`image : ${index}`}
                            src={imageItem.image}
                            onClick={() => handleImageClick(imageItem.image)}
                            className="mt-2 px-0 w-[100%]  h-auto  max-h-[500px] rounded-s"
                            alt=""
                          />
                        ))}
                         
                      </div>
                      
                        
                      )}
                      {post.videos && post.videos.length > 0 &&(
                      <div className="h-auto" >
                        {post.videos.map((videoItem , index)=>(
                        <video controls className="mt-2 px-0 w-full rounded-s h-auto">
                          <source key = {`video : ${index}`} src={videoItem.video} type="video/mp4" />
                            Your browser does not support the video tag
                        </video>
                      ))}
                        
                        </div>
                        
                        
                        
                      )}
                      <div className="pt-2 mt-5  flex justify-end border-t-2  border-slate-300">
                        <div className="flex items-center" >
                          {post.like_count > 0 &&<span onClick={()=>navigate(`/liked/${post.id}/`)} className=" text-center text-s text-slate-600 font-semibold hover:cursor-pointer hover:text-gray-600" >Liked by {post.like_count}</span> }
                            <button onClick={()=>handleLike(post.id)}  className=" text-primary ">
                              <Heart  className={` size-5 mr-8 ml-1 ${post.is_liked ? 'text-red-600 fill-red-500':'text-gray-600 fill-transparent' }`  } />
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
                </div>
              </div>
            ))
          )}
        </div>

        {imageModalOpen && selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleCloseImageModal}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={selectedImage}
                alt=""
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                onClick={handleCloseImageModal}
                className="absolute top-90-p[']\78
                /l.,8-790643c2x1fzResx right-2 text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={modal}
          isClosed={handleCloseModel}
          onSubmit={handleSubmit}
          title="Create a New Needle"
          submitText="Create"
          formData={formData}
          handleInputChange={handleInputChange}
          modalType="submit"
        />

        <Modal
          isOpen={editModal}
          isClosed={handleEditCloseModal}
          onSubmit={handleEdit}
          title="Edit Needle"
          submitText="Update"
          formData={formData}
          handleInputChange={handleInputChange}
          modalType="edit"
        />

        <Modal
          isOpen={deleteModal}
          onSubmit={handleDelete}
          isClosed={handleDeleteCloseModal}
          title="Delete Needle"
          submitText="Delete"
          formData={formData}
          handleInputChange={handleInputChange}
          readOnly={true}
          modalType="delete"
        />
      </div>
    </>
  );
}

export default Home;
