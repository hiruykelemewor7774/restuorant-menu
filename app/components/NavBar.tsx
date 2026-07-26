
import Link from 'next/link'
import Image from 'next/image'
import { RiAdminFill } from "react-icons/ri";
const links = [
  { label: 'All', href: '/' },
  { label: 'Food', href: '/Food' },
  { label: 'Drink', href: '/drink' },
  { label: 'Room', href: '/room' },
  { label: <RiAdminFill  />, href:'/admin'}
]


const NavBar = () => {
  return (
    <nav className="flex items-center p-5  text-2xl pl-10 rounded-full fixed
    border border-white/10
    bg-white/10 
    px-8
    py-3
    shadow-xl
    z-50
    min-w-screen
    ">
      {/* backdrop-blur-xl */}
      <Link href="/campany" className='flex text-center space-x-2'>
        <Image src="/pizza.Webp" width={35} height={60} className="rounded-full" alt="Company logo"/>
        <span className='flex text-center text-yellow-300'>Kerami</span>
      </Link>
      <ul className="flex space-x-8 ml-auto pr-6">
        {links.map((l) => (
          <li key={l.href} className="px-4 py-2 rounded-full transition-colors duration-200 hover:bg-white hover:text-black">
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}


export default NavBar
