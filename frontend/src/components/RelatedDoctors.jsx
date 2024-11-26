import React from 'react'
const RelatedDoctors = ({ speciality, docId }) => {



    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
        </div>
    )
}

export default RelatedDoctors