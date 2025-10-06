import { createContext, useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from "react-hot-toast";

// Create a new React context to be used by components.
export const AppContext = createContext();

// Define the provider component that will wrap the application.
export const AppContextProvider = (props) => {

    // --- URL MANAGEMENT ---

    // Base URL for the backend from environment variables
    const backend_base_url = import.meta.env.MODE==="development" ?import.meta.env.VITE_BACKEND_URL:"";

    // URL specifically for API calls, with the "/api" prefix
    const backend_api_url = `${backend_base_url}/api`;

    // --- STATE MANAGEMENT ---

    // Authentication States
    const [authUser, setAuthUser] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    // Socket.IO State
    const [socket, setSocket] = useState(null);

    // --- SOCKET.IO FUNCTIONS ---

    // Function to establish a new Socket.IO connection
    const connectSocket = async (user) => {
        // Guard clause: Only connect if a user is provided and no socket is already connected
        if (!user || socket?.connected) return;

        // Connect to the BASE URL, not the API URL
        const newSocket = io(backend_base_url, {
            query: {
                userId: user._id
            }
        });

        newSocket.connect();

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
            console.log(userIds);
        });

        setSocket(newSocket);
    };

    // Function to disconnect the socket and clear its state
    const disconnectSocket = async () => {
            socket.disconnect();
            setSocket(null);
    };

    // --- AUTHENTICATION FUNCTIONS ---

    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get(`${backend_api_url}/auth/check`, { withCredentials: true });
            setAuthUser(response.data);
            await connectSocket(response.data);
        } catch (error) {
            console.log("Error in checkAuth function", error.message);
            setAuthUser(null);
        } finally {
            setIsChecking(false);
        }
    }, [backend_api_url]);

    const login = async (data) => {
        setIsLoggingIn(true);
        try {
            const user = await axios.post(`${backend_api_url}/auth/login`, data, { withCredentials: true });
            setAuthUser(user.data);
            await connectSocket(user.data);
            toast.success("LoggedIn successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const signup = async (data) => {
        setIsSigningUp(true);
        try {
            const res = await axios.post(`${backend_api_url}/auth/signup`, data, { withCredentials: true });
            setAuthUser(res.data);
            await connectSocket(res.data);
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsSigningUp(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${backend_api_url}/auth/logout`, {}, { withCredentials: true });
            setAuthUser(null);
            setUsers([]);
            setAi([]);
            setMessages([]);
            setSelectedUser(null);
            await disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed due to network error");
        }
    };

    const updateProfile = async (data) => {
        setIsUpdatingProfile(true);
        try {
            const res = await axios.put(`${backend_api_url}/auth/update-profile`, data, { withCredentials: true });
            setAuthUser(res.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const resetPass = async (data) => {
        setIsResetting(true);
        try {
            const res = await axios.post(`${backend_api_url}/auth/reset-pass`, data, { withCredentials: true });
            setAuthUser(res.data);
            await connectSocket(res.data);
            toast.success("Password reset successful");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsResetting(false);
        }
    };

    // --- THEME MANAGEMENT ---

    const [theme, setTheme] = useState(localStorage.getItem("chat-theme") || "coffee");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const changeTheme = (color) => {
        localStorage.setItem("chat-theme", color);
        setTheme(color);
    };

    // --- CHAT STATE & FUNCTIONS ---

    const [messages, setMessages] = useState([]);
    const [ai, setAi] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const getMessages = async (userId) => {
        setIsMessagesLoading(true);
        try {
            const res = await axios.get(`${backend_api_url}/message/get-msg/${userId}`, { withCredentials: true });
            setMessages(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsMessagesLoading(false);
        }
    };

    //in socket.io everything happens in publisher-subscriber manner

    const subscribeToMessages=()=>{
        if(!selectedUser)return;
        socket.on("newMessage",(newMessage)=>{
            setMessages((prev)=>([...prev,newMessage]));
        });
    }

    const unsubscribeFromMessages=()=>{
        socket.off("newMessage");
    }

    const getUsers = async () => {
        setIsUsersLoading(true);
        try {
            const res = await axios.get(`${backend_api_url}/message/users`, { withCredentials: true });
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error(error.response.data.message);
            setUsers([]);
        } finally {
            setIsUsersLoading(false);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const res = await axios.post(`${backend_api_url}/message/send-msg/${selectedUser._id}`, messageData, { withCredentials: true });
            setMessages((prevMessages) => ([...prevMessages, res.data]));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const searchUser = async (email) => {
        setIsSearching(true);
        try {
            const newUserResponse = await axios.post(`${backend_api_url}/message/search`, { email }, { withCredentials: true });
            const foundUser = newUserResponse.data;
            setUsers((prevUsers) => {
                const userExists = prevUsers?.some(user => user._id === foundUser._id);
                return userExists ? prevUsers : [foundUser, ...prevUsers];
            });
            setSelectedUser(foundUser);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsSearching(false);
        }
    };

    // --- AI CHAT FUNCTIONS ---

    const askAi = async (prompt) => {
        const tempId = Date.now();
        const optimisticMessage = { _id: tempId, prompt: prompt, response: null };
        setAi((prev) => [...prev, optimisticMessage]);
        setIsAiLoading(true);
        try {
            const res = await axios.post(`${backend_api_url}/message/askAi`, { prompt }, { withCredentials: true });
            setAi((prev) => prev.map((chat) => chat._id === tempId ? res.data : chat));
        } catch (error) {
            toast.error(error.response?.data?.message || "AI failed to respond.");
            setAi((prev) => prev.filter((chat) => chat._id !== tempId));
        } finally {
            setIsAiLoading(false);
        }
    };

    const getAi = async () => {
        setIsAiLoading(true);
        try {
            const res = await axios.get(`${backend_api_url}/message/getAi`, { withCredentials: true });
            setAi(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch AI chat");
            setAi([]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- CONTEXT PROVIDER VALUE ---

    const value = {
        authUser, setAuthUser, authIsLoading: isChecking,
        login, isLoggingIn,
        signup, isSigningUp,
        logout,
        updateProfile, isUpdatingProfile,
        resetPass, isResetting,
        checkAuth,
        theme, changeTheme,
        messages, users, selectedUser, setSelectedUser, onlineUsers,
        isUsersLoading, isMessagesLoading,
        getMessages, getUsers, sendMessage, searchUser, isSearching,
        ai, getAi, askAi, isAiLoading,subscribeToMessages,unsubscribeFromMessages
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};