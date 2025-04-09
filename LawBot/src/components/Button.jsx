import React from 'react'

export const Button = ({text, size}) => {
  return (
    <button className={`btn ${size}`} style={{backgroundColor:'#653F21'}} >{text}</button>
  )
}
