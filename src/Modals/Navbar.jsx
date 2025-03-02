'use client';

import React, { useEffect, useState  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch ,faBars } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import { useLocation } from 'react-router-dom';
import api from '../api';



const Navbar = ({ onOpenModal }) => {
  const { userId } = useParams()
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation()
  const isProfilePage =  userId ? location.pathname === `/profile/${userId}` : false;

  const handleSearch = (e) => {
    setSearch(e.target.value);
   
  };
  const [userData , setUserData] = useState({
    username:"",
    fullname : "",
    id : "" , 
    image : ""
 
  })
  
  const fetchUser = async ()=>{
    const userID = localStorage.getItem("user_id")
    try{
      const res = await api.get(`api/user/profile/${userID}/`)
      setUserData(res.data)
      console.log(res.data)
    }catch(error){
      console.log(error)
    }
  }
  

  useEffect(()=> {
    fetchUser()
   },[])

  useEffect(() => {
    
    console.log("Updated userData:", userData);
  }, [userData]);
  
  const handleLogout = (e) => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    localStorage.removeItem("user_id");
    navigate("/login/");
  };

  return (
    <nav className="mb-0 items-center justify-between bg-black py-4 shadow-md">
      <div className="container mx-auto">
        {/* Desktop View */}
        <div className="hidden sm:flex items-center justify-between px-4">
          <div className="flex-shrink-0 mr-4">
            <span onClick={() => navigate("/")} className="text-2xl font-bold text-white cursor-pointer">
              NeedlesY
            </span>
          </div>

          <div className="flex-grow mx-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition duration-300"
              />
              <button>
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70"
                />
              </button>
            </div>
          </div>

          <div className="flex items-end justify-end gap-5 ">
            <button
              onClick={onOpenModal}
              className="w-10 h-10 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white transition duration-300 transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>

            {userData && (
              <div className="flex items-center space-x-2">
                <Avatar
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => {
                    if (!isProfilePage) {
                      navigate(`profile/${userData.id}`)
                    }
                  }}
                >
                  <AvatarImage src={userData.image || "/placeholder.svg?height=32&width=32"} alt={userData.fullname} />
                  <AvatarFallback>{userData.fullname[0]}</AvatarFallback>
                </Avatar>
                <span onClick={() => {
                            if (!isProfilePage) {
                              navigate(`profile/${userData.id}`)
                            }
                          }} className="text-white hover:underline cursor-pointer">{userData.username}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex justify-evenly gap-2">
          {/* Logo */}
          <div className="  flex-shrink-0">
            <span onClick={() => navigate("/")} className="text-xl font-bold text-white cursor-pointer">
              NeedlesY
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 gap-5 max-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search user"
                value={search}
                onChange={handleSearch}
                className="w-full px-3 py-1.5 rounded-full bg-zinc-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-sm" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-5">
            <button
              onClick={onOpenModal}
              className="w-8 h-8 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
            </button>

            <Sheet className= "" >
              <SheetTrigger asChild>
                <button className="w-8 h-8 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/50 transition duration-300 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBars} className="text-sm" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-zinc-200 sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    {userData && (
                      <div className="flex items-center space-x-2 mb-6">
                        <Avatar
                          className="h-10 w-10"
                          onClick={() => {
                            if (!isProfilePage) {
                              navigate(`profile/${userData.id}`)
                            }
                          }}
                        >
                          <AvatarImage
                            src={userData.image || "/placeholder.svg?height=40&width=40"}
                            alt={userData.fullname}
                          />
                          <AvatarFallback  >{userData.fullname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 onClick={() => {
                            if (!isProfilePage) {
                              navigate(`profile/${userData.id}`)
                            }
                          }} className="text-lg font-semibold">{userData.username}</h2>
                          <p className="text-sm text-gray-500">View Profile</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <button
                        onClick={handleLogout}
                        className="w-full bg-white text-black font-semibold border-solid border-black border-2 py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
