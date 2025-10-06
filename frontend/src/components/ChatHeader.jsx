import { X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser,onlineUsers }=useContext(AppContext);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} className="mr-7 text-amber-500">
          <X className="size-5 font-extrabold" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;