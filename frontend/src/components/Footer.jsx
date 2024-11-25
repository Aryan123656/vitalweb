import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          {/* <img className='mb-5 w-40' src={assets.logo} alt="" /> */}
          <p className='text-primary text-3xl mb-7'>Vital Web</p>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>VitalWeb is a cutting-edge hospital management system designed to streamline operations, improve patient care, and enhance administrative efficiency.VitalWeb simplifies healthcare workflows, ensuring a smarter, faster, and more efficient hospital experience.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91-9643539965</li>
            <li>vitalweb@gmail.com</li>
          </ul>
        </div>

      </div>



    </div>
  )
}

export default Footer
