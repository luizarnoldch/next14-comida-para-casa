import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='h-[50px] bg-blue-500 w-full items-center fixed'>
        <div className='container flex justify-around mx-auto h-full'>
            {/* Logo App */}
            <Image
                src="/icons/food.svg"
                width={40}
                height={40}
                alt='logo'
            />
            {/* Navigation Link */}
            <ul className='flex gap-8 items-center '>
                <Link href="/">Home</Link>
                <Link href="/platos">Platos</Link>
                <Link href="/calendario">Calendario</Link>
            </ul>
            {/* Login */}
            <Image
                src="/icons/person.svg"
                width={40}
                height={40}
                alt='logo'
            />
        </div>
        
    </nav>
  )
}

export default Navbar