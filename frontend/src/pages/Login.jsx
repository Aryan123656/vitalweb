import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();



      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    
  }
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>Login</p>
        <p>Please log in to book appointment</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border  rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <div className='border  h-10 flex justify-between w-full items-center rounded   focus-within:border-black focus-within:ring-1 focus-within:ring-black'>

          <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full h-full p-2 border-none outline-none rounded' type={showPass ? "text" : "password"} required />
          <p
              onClick={() => setShowPass(!showPass)}
              className="relative  right-3 cursor-pointer"
            >
              {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </p>
          </div>
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>Login</button>
        <p>Create an new account? <span className='text-primary underline cursor-pointer' onClick={(e)=>navigate('/signUp')}>Click here</span></p>
        
      </div>
    </form>
  )
}
export default Login