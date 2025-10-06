import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { Bot, Plus, Search, Users } from 'lucide-react';

const Sidebar = () => {
    const { getUsers, users, setUsers, searchUser, selectedUser, setSelectedUser, isUserLoading, onlineUsers, isSearching } = useContext(AppContext);
    const [searchmail, setSearchmail] = useState("");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
    const onlineFriendsCount = users.filter(user => onlineUsers.includes(user._id)).length;

    const filteredUsers = showOnlineOnly ? users.filter(user => (onlineUsers.includes(user._id))) : users;

    useEffect(() => {
        getUsers();
    }, []);

    const handleSearch = async () => {
        if (!searchmail) return;
        searchUser(searchmail.trim());
        setSearchmail("");
    }

    if (isUserLoading && isSearching) return <SidebarSkeleton />

    return (
        <aside className="h-full w-15 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className='border-b border-base-300 w-full p-5 flex flex-col gap-3'>
                <div className='flex justify-start items-center gap-3'>
                    <Users className="size-6" />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </div>
                <div className='flex items-center justify-between gap-3 max-lg:hidden'>
                    <div className='flex items-center gap-2 border border-gray-400 py-1 px-3 rounded-2xl '>
                        <Search className='size-5' />
                        <input type="text" value={searchmail} onChange={e => setSearchmail(e.target.value)} className='bg-base-100 w-4/5 h-6 outline-none flex items-center text-start' placeholder='Search friends' />
                    </div>
                    <button onClick={handleSearch}>
                        <Plus className='size-5' />
                    </button>
                </div>
                {/* online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineFriendsCount} online)</span>
                </div>
            </div>
            <button onClick={() => setSelectedUser("#")} className={`w-full p-3 flex items-center gap-4 ${selectedUser !== "#" && "hover:bg-base-200"} transition-colors ${selectedUser === "#" ? "bg-base-300 ring-1 ring-base-300" : ""}`} pl-5>
                <Bot className='text-primary size-9' />
                <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">Jima ai</div>
                </div>
            </button>
            <div className='overflow-y-auto w-full'>
                {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 ${selectedUser?._id !== user._id && "hover:bg-base-200"} transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-8 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar;