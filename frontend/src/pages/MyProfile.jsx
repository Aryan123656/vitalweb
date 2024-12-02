import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
const MyProfile = () => {
    const { userData } = useContext(AppContext);
    return userData ? (
        <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
            <img className="w-36 rounded" src={userData.image} alt={`${userData.name}'s profile`} />
            <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>
            <hr className="bg-[#ADADAD] h-[1px] border-none" />
           <div>
                <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{userData.email}</p>
                    <p className="font-medium">Phone:</p>
                    <p className="text-blue-500">{userData.phone}</p>
                    <p className="font-medium">Address:</p>
                    <p className="text-gray-500">
                        {userData.address.line1} <br /> {userData.address.line2}
                    </p>
                </div>
            </div>
            <div>
                <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
                    <p className="font-medium">Gender:</p>
                    <p className="text-gray-500">{userData.gender}</p>
                    <p className="font-medium">Birthday:</p>
                    <p className="text-gray-500">{userData.dob}</p>
                </div>
            </div>
        </div>
    ) : null;
};
export default MyProfile;