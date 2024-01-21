import React from 'react'

type Props = {
    className?: string
    children?: React.ReactNode
}

const WeekBlock = ({className, children}: Props) => {
  return (
    <div className={`text-center border rounded-md ${className}`}>{children}</div>
  )
}

export default WeekBlock