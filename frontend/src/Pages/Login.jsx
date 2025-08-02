import React, { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

<<<<<<< HEAD
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    localStorage.setItem("token", response.data.token);
    toast.success("Login Successfull");
    navigate("/");
  } catch (error) {
    console.log(error);
    const msg = error?.response?.data?.message || "Login failed";
    toast.error(msg);
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/login", {
          withCredentials: true,
        }, {
          email,
          password
        })
        toast.success("Login Successfull");
        setRedirect(true);
        navigate("/");

    } catch (error) {
        console.log(error);
        toast.error("Login failed");
    }
>>>>>>> c3208eb517c798c926f2a1b48f7968365ac6536d
  }
};


  return (
    <div className='bg-gradient-to-r from-white-700 to-white-800 h-screen'>
      <div className='items-center flex justify-center h-screen text-white container mx-auto'>
        {/* Header */}
        <header className='absolute top-0 left-0 w-full flex items-center justify-between p-5'>
          <div className='flex items-center space-x-2'>
            <MapPin className="h-8 w-8 text-blue-600" />
            <Link to={"/"} className="text-xl font-bold text-gray-900">CivicTrack</Link>
          </div>
          <div className='flex items-center space-x-4'>
                <Link
                    to={"/"}
                    className="bg-black text-white border border-black rounded-md py-2 px-4 hover:bg-gray-800"
                >
                    Home
                </Link>
            </div>
        </header>

        {/* Login Form */}
        <div className='bg-gray-500 w-[500px] rounded-lg shadow-lg p-8 mt-20'>
          <h2 className='text-2xl font-bold text-center mb-4'>
            Welcome to <span className='text-orange-500'>CivicTrack</span>
          </h2>
          <p className='text-center text-gray-400 mb-6'>Login to access the website</p>

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor="email" className='text-gray-400 mb-2'>Email</label>
              <input 
                type="text" 
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@gmail.com'
                required
                className='w-full p-3 rounded-md bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="password" className='text-gray-400 mb-2'>Password</label>
              <input 
                type="text" 
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='******'
                required
                className='w-full rounded-md bg-gray-700 border border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <button type='submit' className='w-full bg-orange-500 py-3 px-6 hover:bg-blue-600 text-white rounded-md transition'>
                 Signin
            </button>  
            <div className="text-center py-2 text-gray-800">
                Don't have an account? <Link className="underline text-black" to={'/register'}>Register Now</Link>
            </div> 
        </form>
        </div>
        
      </div>
    </div>
  );
}

export default Login;