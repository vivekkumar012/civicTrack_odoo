import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        {
          username,
          email,
          phone,
          phone, 
          password,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Signup Successfully");
      navigate("/login");
      
    } catch (error) {
      console.log(error);
      toast.error("Registration failed, try again later");
    }
  };

  return (
    <div className="bg-gradient-to-r from-white-700 to-grey-800 h-screen">
      <div className="flex items-center justify-center mx-auto container h-screen text-white">
        {/* Header */}
        <div>
          <header className="flex justify-between items-center absolute top-0 left-0 w-full p-5">
            <div className="flex items-center space-x-2">
              {/* <img src="" alt="" className="h-10 w-10 rounded-full" /> */}
              <Link to={"/"} className="text-2xl font-bold text-orange-500">
                CivicTrack
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={"/"}
                className="bg-black text-white border border-black rounded-md py-2 px-4 hover:bg-gray-800"
              >
               Home
              </Link>
            </div>
          </header>
        </div>
        <div className="w-[500px] shadow-lg bg-gray-400 rounded-lg p-8 mt-20">
          <h2 className="text-2xl font-bold text-center mb-4 text-orange-500">
            Sign Up
          </h2>
          <p className="text-xl font-semibold mb-4 text-center text-gray-400">
            Register for new User
          </p>
          <form onSubmit={handleSignup}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="text-gray-400">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Your Username"
                required
                className="w-full bg-gray-700 border border-gray-800 p-3 rounded-md"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@gmail.com"
                required
                className="w-full bg-gray-700 border border-gray-800 p-3 rounded-md"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="text-gray-400">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                className="w-full bg-gray-700 border border-gray-800 p-3 rounded-md"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                required
                className="w-full bg-gray-700 border border-gray-800 p-3 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 w-full px-6 py-3 rounded-md hover:bg-blue-600"
            >
              Signup
            </button>
            <div className="text-center py-2 text-gray-800">
                Already have a account? <Link className="underline text-black" to={'/login'}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
