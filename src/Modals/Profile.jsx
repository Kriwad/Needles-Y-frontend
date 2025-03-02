import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil } from "@fortawesome/free-solid-svg-icons"

const ProfileHeader = ({ user }) => {
  return (
    <Card className="w-[500px] relative">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Here is your public information, you can edit it</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="absolute bottom-5 left-[90px] transform -translate-x-10 translate-y-1/2 flex items-center">
          <Avatar className="w-[150px] h-[150px] border-4 border-white">
            <AvatarImage src={user?.image || "/placeholder.svg?height=128&width=128"} alt={user?.fullname} />
            <AvatarFallback>{user?.fullname?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {user && user.id && user.id.toString() === localStorage.getItem("user_id") && (
            <button
              onClick={() => {
                /* Add functionality to edit profile */
              }}
              className="ml-2 p-2 bg-white rounded-full text-gray-600 hover:text-black"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          )}
        </div>
        <div className="mt-24 ml-2">
          <h2 className="text-2xl font-bold">{user?.fullname}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <p className="mt-4">{user?.bio || "No bio provided."}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileHeader

