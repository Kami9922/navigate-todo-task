import React from 'react'
import TodoItem from './TodoItem'
import { Routes, Route } from 'react-router-dom'

const RoutesTodo = () => {
  return (
    <div>
      <Routes>
        <Route path='/task/:id' element={<TodoItem />} />
        <Route path='/task/:id' element={<TodoItem />} />
        <Route path='/task/:id' element={<TodoItem />} />
      </Routes>
    </div>
  )
}

export default RoutesTodo
