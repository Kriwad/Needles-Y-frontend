import React from 'react'
import { useState , useEffect  } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Card , CardContent , CardHeader } from '../Components/ui/card'
import  {Avatar, AvatarImage, AvatarFallback} from '../Components/ui/avatar'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
function Liked() {
  const {todoId} = useParams()
  const [users , setUser]= useState([])
  const navigate = useNavigate()
  const fetchLikeUser = async ()=>{
    try{
    const response =  await api.get(`api/user/todo/like/${todoId}/`)
    setUser(response.data)
    console.log(response.data)
    
    }catch{
      console.log("error:" , error)
    }
  };
  useEffect(() => {
    fetchLikeUser();
  }, [todoId]);
  return (
  
  <>
    <nav className='w-full p-3 bg-white border-b-2 border-gray-300 text-start  ' >
      <div className='flex felx-col' >
        <button className='hover:text-gray-400 ' onClick={()=> navigate(-1)} >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <p className='mx-10 font-bold ' >People who reacted</p>
      </div>

      </nav>
      {users.map((item)=>(
        <div key={item.id} className=' w-full flex justify-start  ' >
            <Card key={item.id} onClick={()=> navigate(`/profile/${item.user.id}`)} className=" w-full border-b-2  border-gray-300  border-1 pt-[10px] pb-[10px] overflow-hidden pl-10   hover:bg-gray-300 transition-all duration-[250]">
              <CardContent className="flex flex-row  items-center justify-start space-y-0 pb-2 ">
                <Avatar className="h-10 w-10" >
                  <AvatarImage src={item.user.image}>
                    
                  </AvatarImage>
                  <AvatarFallback>
                    {item.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col' >
                  <p className='text-sm p-0 font-semibold mx-5 hover:underline cursor-pointer'  >{item.user.username}</p>

                </div>
              </CardContent>
              
            </Card>
        </div>
      ))}
      
  </>
    

  )
}

export default Liked