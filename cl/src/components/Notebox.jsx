import React , {useState}from 'react'

function Notebox({isOpen, onClose , onSave}) {
    const [notes , setNotes]= useState("")

    const handleSave= ()=>{
        if(notes.trim()){
            onSave(notes);
            setNotes("");
            onClose();
        }
    }

    if(!isOpen) return null;
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1f1f1f] p-6 rounded-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Add Notes</h2>
        <textarea
          className="w-full h-32 p-2 rounded bg-[#2b2b2b] text-white border border-gray-600 resize-none"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-gray-500 px-4 py-2 rounded-full hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#ff9b22] text-black border-[#ff9b22] hover:bg-[#ff8922] px-6 py-2 border duration-200 rounded-full font-bold font-Onest"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notebox
