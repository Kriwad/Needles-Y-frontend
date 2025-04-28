import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider, createBrowserRouter, createRoutesFromElements , Route, Navigate} from 'react-router-dom'

import Login from './Pages/Login.jsx'
import RegisterAndLogout from './Pages/RegisterAndLogout.jsx'
import ProtectedRoute from './Pages/ProtectedRoutes.jsx'

import Home from './Pages/Home.jsx'
import Profile from './Pages/Profile.jsx'
import Liked from './Pages/Liked.jsx'
import Comment from './Pages/Comment.jsx'

function Logout(){
  localStorage.clear()
  return <Navigate to = "/login/"  />
 }


const router = createBrowserRouter(
  createRoutesFromElements(
   <>
  
   <Route path = "/" element = {<ProtectedRoute>
       <Home />
    </ProtectedRoute>}/>
    
    <Route path="login/" element={<Login />} /> 
    <Route path="logout/" element={<Logout />} /> 
    <Route path="register/" element={<RegisterAndLogout />} />
    <Route path="profile/:userId/" element={<Profile />} /> 
    <Route path="comment/:todoId/" element={<Comment />} /> 
    <Route path="liked/:todoId/" element={<Liked />} /> 
    
    
    
    
   </> 
    
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
