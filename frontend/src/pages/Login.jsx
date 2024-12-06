import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const onOtpSubmit = async () => {
    try {
      if(newPass!=confPass){
        toast.error("Passwords do not match");
        return;
      }
      const res = await axios.post(`${backendUrl}/api/user/reset-password`,{
        email: forgotEmail,
        otp,
        newPass
      });
      console.log(res);
      if(res.data.success==true){
        toast.success("Password changed successfully");
        setShowOtp(false);
        setShowForgotPass(false);
      }
      else{
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const onForgotPasswordSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email: forgotEmail }
      );
      if (data.success) {
        toast.success("OTP sent to your email.");
        setShowForgotPass(false);
        setShowOtp(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">Login</p>
          <p>Please log in to book an appointment</p>
          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <div className="border h-10 flex justify-between w-full items-center rounded focus-within:border-black focus-within:ring-1 focus-within:ring-black">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full h-full p-2 border-none outline-none rounded"
                type={showPass ? "text" : "password"}
                required
              />
              <p
                onClick={() => setShowPass(!showPass)}
                className="relative right-3 cursor-pointer"
              >
                {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </p>
            </div>
          </div>
          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
            Login
          </button>
          <p>
            Create a new account?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={(e) => navigate("/signUp")}
            >
              Click here
            </span>
          </p>
          <p
            className="text-red-400 underline cursor-pointer"
            onClick={() => setShowForgotPass(true)}
          >
            Forgot Password
          </p>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPass && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <p className="text-lg font-semibold">Forgot Password</p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="border rounded w-full p-2 mt-2"
              placeholder="Enter your email"
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowForgotPass(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onForgotPasswordSubmit}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showOtp && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <p className="text-lg font-semibold">Enter OTP</p>
            <input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded w-full p-2 mt-2"
              placeholder="Enter OTP"
              required
            />
            <p className="text-lg font-semibold mt-3">New Password</p>
            <input
              type="password"
              onChange={(e) => setNewPass(e.target.value)}
              className="border rounded w-full p-2 mt-2"
              placeholder="Enter New Password"
              required
            />

            <p className="text-lg font-semibold mt-3">Confirm New Password</p>
            <input
              type="password"
              onChange={(e) => setConfPass(e.target.value)}
              className="border rounded w-full p-2 mt-2"
              placeholder="Confirm New Password"
              required
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onOtpSubmit}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
