"use client"

type Props = {
    className?: string
    children?: React.ReactNode
    onClick?: () => void
}

const Button = ({children, className, onClick}: Props) => {
  return (
    <button className={`bg-slate-300 rounded-md px-4 py-2 hover:bg-slate-400 active:bg-slate-500 ${className}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default Button