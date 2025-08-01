import React from 'react'

function ViewNotes({notes , notesOpen }) {
   
    if(!notesOpen) return null
  return (

    <div className='text-white text-sm m-1 p-1 border-solid border-gray-500'>
      {notes}
   
    
           </div>
  )
}

export default ViewNotes
