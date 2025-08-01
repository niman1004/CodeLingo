import React, { useState } from 'react'
import {Star , NotebookText} from 'lucide-react'
import {Link} from 'react-router-dom'
import ViewNotes from './ViewNotes';

function Questionbox({title  , link , tags , revise , difficulty, createdAt , notes}) {

  const dateSolved= new Date(createdAt);
  const formattedDate= dateSolved.toLocaleDateString("en-GB")
  const difficultyColors={
    easy: 'text-green-500',
    medium:'text-yellow-500',
    hard: 'text-red-500'
  }

  //for the notes box
  const [openNotes , setOpenNotes]= useState(false)
 
  
  return (

    <div className="bg-[#1f1f1f] w-3/4 text-white p-4 rounded-lg shadow-md flex flex-col relative">
      {revise && 
      (
        <div className="absolute top-2 right-2 text-yellow-400 ">
          <Star fill="currentColor" className="w-5 h-5" /> 
        </div>
      )
      }

      <div className="flex flex-row justify-between items-start">
        <div className="ml-3">
          <Link className="text-2xl font-semibold hover:underline " to={link} >{title}</Link>
          <div className="text-gray-400 text-sm mt-1">
            {tags.map((tag) => `#${tag} `)}
          </div>
           <div className="text-gray-400 text-sm mt-1">
            Solved on: {formattedDate}
          </div>
          <div className={`${difficultyColors[difficulty]} text-sm mt-1`}>
            {difficulty}
          </div>
        </div>
      </div>
      
      {notes && (
        <div className='flex mr-4 mb-2'>
           <button
            type="button"
            onClick={() => setOpenNotes(!openNotes)}
            className=" text-[#ff9b22] px-4 py-1 rounded-full font-semibold"
          >
         <NotebookText size={30} />
          </button>

         
        </div>
      )}
       <ViewNotes
          notes={notes}
          notesOpen={openNotes}
          />
    </div>
  )
}

export default Questionbox
