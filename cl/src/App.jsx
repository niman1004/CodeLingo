import { useState } from 'react'

import './App.css'
import Header from './components/header/Header'
import { Outlet } from 'react-router-dom'
//bg-[#f6f6f6]
function App() {
  

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-black'>
      <div className='w-full block'>
        <Header/>
        <main className='mt-[80px]'>
          <Outlet/>
        </main>

      </div>

    </div>
  )
}

export default App
