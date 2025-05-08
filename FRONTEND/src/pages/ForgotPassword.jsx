import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom' ; 
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate() ; 
  const [email, setEmail] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await axios.post("https://chat-application-u5dm.onrender.com/api/auth/forgot-password", { email : email}, {withCredentials:true}); // Adjust endpoint as needed
      if(res.data.boolean){
        toast.success("Otp sent successfully !");
        navigate(`/enterOtp/${email}`) ; 

      }
      else{
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Internal server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-4">Enter your valid gmail</h2>
      
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Send OTP
        </button>
     </form>
    </div>
  );
};

export default ForgotPassword;
