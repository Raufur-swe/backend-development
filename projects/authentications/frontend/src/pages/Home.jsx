
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen bg-sky-300 flex items-center justify-center ' >
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-5xl text-center font-medium' >Wlcome full stack advance autentication (mern)</h1>
      <p>for start click bellow</p>
      <Link to='/registration'>
      <button className='bg-green-500 px-4 py-2 text-center cursor-pointer' >Start</button>
      </Link> 
      </div>
    </div>
  )
}

export default Home