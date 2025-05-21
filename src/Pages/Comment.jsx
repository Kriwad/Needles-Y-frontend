import React from 'react'
import { useState  } from 'react'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from "../api";
import Modal from '../Modals/Modal'
import Navbar from '../Modals/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuContent , DropdownMenuItem , DropdownMenuTrigger} from "@/Components/ui/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow ,set} from "date-fns";
import { faEllipsisV , faEdit , faTrash } from "@fortawesome/free-solid-svg-icons";
function comment() {



    const {postId} = useParams()
    const [commentData , setCommentData] = useState([])
    const fetchComment = async ()=>{
        try{
            const res = await api.get(`api/user/list/post/comment/${postId}/`)
            setCommentData(res.data)
            console.log(res.data);
    }
        catch(err){
            console.log(err)
        }
    }
    const userid = JSON.parse(localStorage.getItem('user_id'))
    console.log(userid);

    useEffect(() => {
        fetchComment()
    }, [])
    return (
        <div className='  w-1vh h-1vh bg-zinc-200'>
            <Navbar />  
            
            
            
            <div className="flex w-full h-full items-center">
                <div className='flex w-full justify-center items-center' >
                    <Card className="mw-full border-solid border-2  max-w-2xl mx-auto rounded-md overflow-hidden mb-2 w-full">
                        <CardHeader>
                        
                        {/* Top Section: Avatar, Username, Date, Dropdown */}
                        <div className="flex justify-between items-start">
                            
                            {/* Left Side: Avatar + Username + Date */}
                            <div className="flex gap-2">
                            <Avatar>
                                <AvatarImage src={commentData?.user?.image} />
                                <AvatarFallback>
                                {commentData?.user?.username[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <h2 className="text-sm font-bold hover:underline cursor-pointer">
                                {commentData?.user?.username}
                                </h2>
                                <p className="text-xs font-extralight text-gray-500">
                                {commentData?.created_at && 
                                    formatDistanceToNow(new Date(commentData.created_at), { addSuffix: true })
                                }
                                </p>
                            </div>
                            </div>

                            {/* Right Side: Dropdown (if user is the owner) */}
                            {userid === commentData?.user?.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <button>
                                    <FontAwesomeIcon icon={faEllipsisV} className="h-4 w-4" />
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

                        {/* Content Section: Title, Goal, Images */}
                        <div className="mt-4 flex flex-col gap-2">
                            {commentData.title && (
                            <CardContent>{commentData.title}</CardContent>
                            )}

                            {commentData.goal && (
                            <CardContent>{commentData.goal}</CardContent>
                            )}

                            {commentData.images?.length > 0 && commentData.images.map((image) => (
                            <CardContent key={`image-${image.id}`}>
                                <img
                                src={image.image}
                                className="mt-2 w-[100%] h-[350px] rounded-lg"
                                alt="Comment Image"
                                
                                />
                            </CardContent>
                            ))}
                            {commentData.videos?.length> 0 && commentData.videos.map(video =>(
                                <CardContent key={`videos-${video.id}`} type="video/mp4">
                                    <video controls src={video.video}></video>
                                </CardContent>
                            ))}
                        </div>

                        </CardHeader>
                    </Card>
                </div>
                
            </div>

            
            
            
            
            

        </div>
  )

} 

export default comment