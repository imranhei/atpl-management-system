import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'

const UserLayout = () => {

  return (
    <div className="flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout