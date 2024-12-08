import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'
import nodemailer from 'nodemailer';


const appointmentCount = async (req, res) => {
    try {
        const { slotDate, docId, userId } = req.body;

        // Ensure required fields are provided
        if (!slotDate || !docId) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: slotDate or email" 
            });
        }

        // Count appointments for the doctor on the specific date
        const count = await appointmentModel.countDocuments({
            docId, // Assuming email refers to the doctor's ID
            slotDate: slotDate,
            userId: userId
        });

        if (count >= 5) {
            return res.status(200).json({
                success: false,
                message: "Maximum appointments reached for the day"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment available for the day"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)



        
        if (isMatch) {




            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }
        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select("-password")
        delete docData.slots_booked
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
         await newAppointment.save()
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})


const sendEmail=async function(email,resetToken){

    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Reset Password',
        html:`
        <p>Password Reset Request</p>
        <p>Your OTP is ${resetToken}</p>
        <p>This otp will expires in 5 minutes</p>`
    }

    await transporter.sendMail(mailOptions);     
}

const forgotPassword = async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'Enter Valid Email'});
        }
        const resetToken = crypto.randomInt(100000,999999).toString();
        const hashedResetToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken=hashedResetToken;
        user.resetPasswordExpires=Date.now()+(10*60*1000);
        await user.save();
        await sendEmail(email,resetToken);
        return res.json({
            success:true
        })


    }catch(err){
        return res.json({ success: false, message: err.message});
    }
}


const resetPassword = async(req,res)=>{
    try{
        const {email,otp,newPass}=req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                message:"Invalid Email",
                success:false
            })
        }

        const valid = await bcrypt.compare(otp,user.resetPasswordToken);
        if(!valid||Date.now()>user.resetPasswordExpires){
            return res.json({
                success:false,
                message:"Invalid OTP OR OTP HAS EXPIRED"
            })
        }

        user.password=await bcrypt.hash(newPass,10);
        await user.save();
        return res.json({
            success:true,
            message:"PASSWORD CHANGED SUCCESSFULLY"
        })

    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    forgotPassword,
    resetPassword,
    appointmentCount
}







