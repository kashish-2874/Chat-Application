import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
  const params = useParams();
  const email = params.email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault() ; 
        if(newPassword != confirmPassword) {
            toast.error("Please enter same password");
        }
        else {
            try {
                console.log(email ) ; 
                const func_1 = async () => { 
                    const res = await axios.post("https://chat-application-u5dm.onrender.com/api/auth/reset-password",{email,newPassword},{withCredentials:true});
                    if(res.data.boolean){
                        toast.success(res.data.message);
                        navigate("/login");
                    }
                    else{
                        toast.error(res.data.message);
                    }
                }
                func_1() ; 
            } catch (error) {
                console.log("error: ",error);
                toast.error("internal server error");
            }
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          
          placeholder="Enter new Password"
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          
          placeholder="Confirm new Password"
          className="border px-4 py-2 rounded"
          required 
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Verify
        </button>
      </form>
    </div>

  );
};

export default ChangePassword;
