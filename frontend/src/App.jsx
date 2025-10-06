import React, { useContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Settings from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import ResetPass from './pages/ResetPass';
import { Toaster } from "react-hot-toast";
import { AppContext } from './context/AppContext';
import { Loader } from 'lucide-react';
const App = () => {
  const { authUser, checkAuth, isChecking,theme } = useContext(AppContext);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(()=>{
    console.log(authUser);
  },[authUser]);

  if (isChecking && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path='/signup' element={!authUser?<Signup />:<Navigate to={"/"}/>} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
        <Route path='/reset' element={!authUser ? <ResetPass /> : <Navigate to={"/"} />}/>
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App