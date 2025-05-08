import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const EnterOTP = () => {
  const navigate = useNavigate();
  const params = useParams();
  const email = params.email;
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Missing email. Please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      const res = await axios.post(
        "https://chat-application-u5dm.onrender.com/api/auth/verifyOtp",
        { email, otp },
        { withCredentials: true }
      );

      if (res.data.boolean) {
        toast.success("OTP verified successfully");
        navigate(`/changePassword/${email}`);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={4}
          placeholder="Enter 4-digit OTP"
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

export default EnterOTP;
