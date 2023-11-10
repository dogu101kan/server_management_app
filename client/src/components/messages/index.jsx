import React from 'react'

export const Messages = ({messages}) => {
  return (
    <div>
        {
            messages.map((data, index)=>(
              
                <p key={index}>{data.message}</p>
            ))
        }
    </div>
  )
}

