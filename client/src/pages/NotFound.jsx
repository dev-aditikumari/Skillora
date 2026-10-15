import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      <p>404-pAGE NOT FOUND</p>
      <Link to = '/login'>Go home</Link>
      
    </div>
  )
}

export default NotFound
