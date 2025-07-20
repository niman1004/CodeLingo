import React  , {useId} from 'react'

const Input = React.forwardRef(function Input(
  {label , 
  type= 'text' , className="" , ...props
} , ref){
const id= useId()
  return(
<div className='w-full'>
 {label && ( <label htmlFor={id}
 className='inline-block text-white font-Onest mb-1 pl-1'
 >{label}</label>

 )}

 <input
  type={type} 
  ref={ref}
  {...props}
  id={id}
  className={`px-3 py-2 font-Onest  rounded-lg bg-[#1f1f1f] text-white outline-white focus:bg-gray-800 duration-200
    border border-gray-200 w-full ${className}`}
 />

</div>

  )

} )

export default Input