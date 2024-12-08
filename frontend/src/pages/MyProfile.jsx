// // import React, { useContext } from "react";
// // import { AppContext } from "../context/AppContext";
// // const MyProfile = () => {
// //     const { userData } = useContext(AppContext);
// //     return userData ? (
// //         <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
// //             <img className="w-36 rounded" src={userData.image} alt={`${userData.name}'s profile`} />
// //             <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>
// //             <hr className="bg-[#ADADAD] h-[1px] border-none" />
// //            <div>
// //                 <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
// //                 <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
// //                     <p className="font-medium">Email id:</p>
// //                     <p className="text-blue-500">{userData.email}</p>
// //                     <p className="font-medium">Phone:</p>
// //                     <p className="text-blue-500">{userData.phone}</p>
// //                     <p className="font-medium">Address:</p>
// //                     <p className="text-gray-500">
// //                         {userData.address.line1} <br /> {userData.address.line2}
// //                     </p>
// //                 </div>
// //             </div>
// //             <div>
// //                 <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
// //                 <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
// //                     <p className="font-medium">Gender:</p>
// //                     <p className="text-gray-500">{userData.gender}</p>
// //                     <p className="font-medium">Birthday:</p>
// //                     <p className="text-gray-500">{userData.dob}</p>
// //                 </div>
// //             </div>
// //         </div>
// //     ) : null;
// // };
// // export default MyProfile;

// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { assets } from '../assets/assets'

// const MyProfile = () => {

//     const [isEdit, setIsEdit] = useState(false)

//     const [image, setImage] = useState(false)

//     const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

//     // Function to update user profile data using API
//     const updateUserProfileData = async () => {

//         try {

//             const formData = new FormData();

//             formData.append('name', userData.name)
//             formData.append('phone', userData.phone)
//             formData.append('address', JSON.stringify(userData.address))
//             formData.append('gender', userData.gender)
//             formData.append('dob', userData.dob)

//             image && formData.append('image', image)

//             const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

//             if (data.success) {
//                 toast.success(data.message)
//                 await loadUserProfileData()
//                 setIsEdit(false)
//                 setImage(false)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     return userData ? (
//         <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

//             {isEdit
//                 ? <label htmlFor='image' >
//                     <div className='inline-block relative cursor-pointer'>
//                         <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
//                         <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
//                     </div>
//                     <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
//                 </label>
//                 : <img className='w-36 rounded' src={userData.image} alt="" />
//             }

//             {isEdit
//                 ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
//                 : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
//             }

//             <hr className='bg-[#ADADAD] h-[1px] border-none' />

//             <div>
//                 <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
//                     <p className='font-medium'>Email id:</p>
//                     <p className='text-blue-500'>{userData.email}</p>
//                     <p className='font-medium'>Phone:</p>

//                     {isEdit
//                         ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
//                         : <p className='text-blue-500'>{userData.phone}</p>
//                     }

//                     <p className='font-medium'>Address:</p>

//                     {isEdit
//                         ? <p>
//                             <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
//                             <br />
//                             <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} /></p>
//                         : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
//                     }

//                 </div>
//             </div>
//             <div>
//                 <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
//                     <p className='font-medium'>Gender:</p>

//                     {isEdit
//                         ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
//                             <option value="Not Selected">Not Selected</option>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                         </select>
//                         : <p className='text-gray-500'>{userData.gender}</p>
//                     }

//                     <p className='font-medium'>Birthday:</p>

//                     {isEdit
//                         ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
//                         : <p className='text-gray-500'>{userData.dob}</p>
//                     }

//                 </div>
//             </div>
//             <div className='mt-10'>

//                 {isEdit
//                     ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Save information</button>
//                     : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit</button>
//                 }

//             </div>
//         </div>
//     ) : null
// }

// export default MyProfile

import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save 
} from 'lucide-react'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(null)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    if (!userData) return null;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center space-x-6">
                <div className="relative group">
                    {isEdit ? (
                        <label htmlFor='image' className="cursor-pointer">
                            <div className="relative">
                                <img 
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white group-hover:opacity-70 transition-opacity"
                                    src={image ? URL.createObjectURL(image) : userData.image} 
                                    alt={`${userData.name}'s profile`} 
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <img src={assets.upload_icon} alt="Upload" className="w-12 h-12" />
                                </div>
                            </div>
                            <input 
                                onChange={(e) => setImage(e.target.files[0])} 
                                type="file" 
                                id="image" 
                                hidden 
                            />
                        </label>
                    ) : (
                        <img 
                            className="w-40 h-40 rounded-full object-cover border-4 border-white" 
                            src={userData.image} 
                            alt={`${userData.name}'s profile`} 
                        />
                    )}
                </div>

                <div className="flex-grow text-white">
                    {isEdit ? (
                        <input 
                            className="bg-transparent border-b border-white text-4xl font-bold w-full text-white placeholder-white/70"
                            type="text" 
                            value={userData.name}
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your Name"
                        />
                    ) : (
                        <h1 className="text-4xl font-bold">{userData.name}</h1>
                    )}
                    <p className="text-white/80 mt-2">{userData.email}</p>
                </div>

                <div>
                    <button 
                        onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full flex items-center space-x-2 transition-colors"
                    >
                        {isEdit ? (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Profile
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-5 h-5 mr-2" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <User className="mr-3 text-blue-500" /> Contact Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Mail className="mr-3 text-blue-500" />
                            <span className="font-medium">{userData.email}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="mr-3 text-blue-500" />
                            {isEdit ? (
                                <input 
                                    className="bg-white border px-3 py-1 rounded w-full"
                                    type="text" 
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            ) : (
                                <span>{userData.phone}</span>
                            )}
                        </div>
                        <div className="flex items-start">
                            <MapPin className="mr-3 text-blue-500 mt-1" />
                            {isEdit ? (
                                <div className="w-full space-y-2">
                                    <input 
                                        className="bg-white border px-3 py-1 rounded w-full"
                                        type="text" 
                                        value={userData.address.line1}
                                        onChange={(e) => setUserData(prev => ({ 
                                            ...prev, 
                                            address: { ...prev.address, line1: e.target.value } 
                                        }))}
                                    />
                                    <input 
                                        className="bg-white border px-3 py-1 rounded w-full"
                                        type="text" 
                                        value={userData.address.line2}
                                        onChange={(e) => setUserData(prev => ({ 
                                            ...prev, 
                                            address: { ...prev.address, line2: e.target.value } 
                                        }))}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <span>{userData.address.line1}</span>
                                    <br />
                                    <span>{userData.address.line2}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <Calendar className="mr-3 text-blue-500" /> Basic Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <User className="mr-3 text-blue-500" />
                                <span className="font-medium">Gender</span>
                            </div>
                            {isEdit ? (
                                <select 
                                    className="bg-white border px-3 py-1 rounded"
                                    value={userData.gender}
                                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                >
                                    <option value="Not Selected">Not Selected</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <span>{userData.gender}</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Calendar className="mr-3 text-blue-500" />
                                <span className="font-medium">Birthday</span>
                            </div>
                            {isEdit ? (
                                <input 
                                    className="bg-white border px-3 py-1 rounded"
                                    type="date" 
                                    value={userData.dob}
                                    onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                />
                            ) : (
                                <span>{userData.dob}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile