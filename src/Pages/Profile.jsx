

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
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    image: null,
    video: null,
  });
  const [likedPost , setIsLikedPost] = useState({})


  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);


  const handleLike = (postID)=>{
    setIsLikedPost((prev)=> ({
      ...prev,
      [postID] : !prev[postID] || false
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
  //handles close profile
 

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

  const fetchTodos = async () => {
    try {
      const response = await api.get(`api/user/profile/todos/${userId}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Form submissions
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title" , formData.title)
    formDataToSend.append("goal" , formData.goal)
    if (formData.image){
      formDataToSend.append("image" , formData.image)

    }
    if (formData.video){
      formDataToSend.append("video" , formData.video)
    }

    try {
      await api.post(`api/user/todo/`, formDataToSend);
      await fetchTodos();
      setShowCreateModal(false);
      setFormData({ title: "", goal: "", image: null, video: null });
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title" , formData.title)
    formDataToSend.append("goal" , formData.goal)
    if (formData.image){
      formDataToSend.append("image" , formData.image)

    }
    if (formData.video){
      formDataToSend.append("video" , formData.video)
    }
    try {
      await api.put(`/api/user/todo/edit/${selectedTodo.id}/`, formDataToSend);
      await fetchTodos();
      setShowEditModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/api/user/todo/edit/${selectedTodo.id}/`);
      await fetchTodos();
      setShowDeleteModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("fullnaame" , user.fullname)
    formDataToSend.append("username" , user.username)
    formDataToSend.append("bio" , user.bio)
    if (user.image instanceof File){
      formDataToSend.append("image" , user.image)

    }

    try {
      await api.put(`api/user/profile/${userId}/`, formDataToSend);
      await fetchUser();
      
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
    fetchTodos();
  }, []);

  return (
    <div className="w-1vh h-1vh bg-zinc-200">
      <Navbar onOpenModal={() => setShowCreateModal(true)} />
      
      {/* Profile Card */}
      <div className="container mx-auto mb-5">
        <Card className="w-full border-2 max-w-4xl mx-auto rounded-md">
          <div className="relative h-48 bg-gradient-to-r from-slate-300 to-slate-300">
            <Avatar
              className="absolute top-10 left-24 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 border-4 border-white"
              onClick={user && user.id === currentUser ? () => navigate("/") : undefined}
            >
              <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.fullname} />
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

      {/* Todos List */}
      <div className="container mx-auto">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos found.</p>
        ) : (
          todos.map(todo => (
            <Card key={todo.id} className="max-w-4xl mx-auto mb-4 border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={todo.user.image || "/placeholder.svg"} />
                    <AvatarFallback>{todo.user.fullname[0]}</AvatarFallback>
                  </Avatar>
                  <div  >
                    <p className="font-semibold">{todo.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(todo.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {user && currentUser === user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedTodo(todo);
                        setFormData({ title: todo.title, goal: todo.goal });
                        setShowEditModal(true);
                      }}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedTodo(todo);
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

              <CardContent>
                <h3 className="text-lg mt-5 font-semibold">{todo.title}</h3>
                <p className="text-gray-700 mt-2">{todo.goal}</p>
                {todo.image && (
                  <img src={todo.image} alt="" className="mt-4 rounded-lg w-full" />
                )}
                {todo.video && (
                  <video controls className="mt-4 rounded-lg w-full">
                    <source src={todo.video} type="video/mp4" />
                  </video>
                )}
                <div className="flex justify-end mr-5 gap-9 mt-4">
                  <button onClick={()=>handleLike(todo.id)} className= "text-primary" ><Heart className={`h-5 w-5 ${likedPost[todo.id] ? "text-red-600 fill-red-500 ": " text-gray-500 fill-transparent " }`}/></button>
                  <button className="" ><MessageCircle className="h-5 w-5" /></button>
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
        onSubmit={handleCreateTodo}
        title="Create New Todo"
        submitText="Create"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="submit"
      />

      <Modal
        isOpen={showEditModal}
        isClosed={() => setShowEditModal(false)}
        onSubmit={handleEditTodo}
        title="Edit Todo"
        submitText="Update"
        formData={formData}
        handleInputChange={handleFormChange}
        modalType="edit"
      />

      <Modal
        isOpen={showDeleteModal}
        isClosed={() => setShowDeleteModal(false)}
        onSubmit={handleDeleteTodo}
        title="Delete Todo"
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