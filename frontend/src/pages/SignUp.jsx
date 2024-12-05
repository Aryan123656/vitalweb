import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function SignUp() {
  const navigate = useNavigate();
  const { token, setToken, backendUrl, alphaRegex, emailRegex } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!alphaRegex.test(name)) {
      toast.error("Enter a valid name");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        password,
        email,
      });
      console.log(res);
      if (res.data.success === true) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error occurred while signing up");
    }
  };

  return (
    <form
      className="flex items-center justify-center h-[80vh]"
      onSubmit={onSubmitHandler}
    >
      <div className="flex flex-col gap-3 justify-between items-start py-5 px-10 border w-[45vh] rounded-xl shadow-lg">
        <div className="font-semibold text-xl">Create Account</div>
        <p className="text-sm">Please sign up to book an appointment</p>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="border w-full p-2 rounded focus:border-black"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border w-full p-2 rounded focus:border-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        
        <div className="flex flex-col gap-2 items-start w-full ">
          <label htmlFor="password">Password</label>
          <div className="border rounded w-full  h-10 flex justify-between  items-center  focus-within:border-black focus-within:ring-1 focus-within:ring-black ">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="w-full h-full p-2 border-none outline-none rounded"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              onClick={() => setShowPass(!showPass)}
              className=" mr-3 right-3 cursor-pointer"
            >
              {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start w-full">
          <label htmlFor="cpassword">Confirm Password</label>
          <div className="border w-full h-10 rounded flex items-center relative focus-within:border-black focus-within:ring-black focus-within:ring-1">
            <input
              type={showCPass ? "text" : "password"}
              id="cpassword"
              className="w-full h-full p-2 border-none outline-none rounded"
              onChange={(e) => setCpassword(e.target.value)}
            />
            <p
              onClick={() => setShowCPass(!showCPass)}
              className="absolute right-3 cursor-pointer"
            >
              {showCPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </p>
          </div>
        </div>

        <button className="w-full bg-primary rounded-md text-white text-base py-3 mt-4">
          Create Account
        </button>

        <p
          className="text-primary underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login Here
        </p>
      </div>
    </form>
  );
}

export default SignUp;
