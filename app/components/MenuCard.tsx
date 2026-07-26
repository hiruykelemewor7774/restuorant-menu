import Link from 'next/link'
import Image from 'next/image'


export type MenuItem = {
  name: string
  price: string
  image: string
  href: string
}


export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Link
      href={item.href}
      className="block rounded-2xl border border-gray-200 overflow-hidden shadow-sm
      hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div className="relative h-48 w-full rounded-2xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:scale-105
    hover:bg-white/10">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-amber-500 font-bold mt-1">{item.price}</p>
      </div>
    </Link>
  )
}
