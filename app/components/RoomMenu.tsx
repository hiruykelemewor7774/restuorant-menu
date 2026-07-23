import Link from 'next/link'
import Image from 'next/image'


type Room = {
  name: string
  price: string
  image: string
  href: string
  features: string[]
}


const rooms: Room[] = [
  {
    name: 'One Bed',
    price: '500 Birr / night',
    image: '/image/onebed.jpg',
    href: '/room/one-bed',
    features: ['1 Single Bed', 'Free Wi-Fi', 'Private Bathroom', 'TV'],
  },
  {
    name: 'Two Bed',
    price: '800 Birr / night',
    image: '/image/twobed.jpg',
    href: '/room/two-bed',
    features: ['2 Beds', 'Free Wi-Fi', 'Air Conditioning', 'Breakfast Included'],
  },
  {
    name: 'Three Bed',
    price: '1200 Birr / night',
    image: '/image/threebed.jpeg',
    href: '/room/three-bed',
    features: ['3 Beds', 'Free Wi-Fi', 'Balcony', 'Mini Fridge', 'Breakfast Included'],
  },
  {
    name: 'Family Suite',
    price: '2000 Birr / night',
    image: '/image/family.jpg',
    href: '/room/family-suite',
    features: ['4 Beds', 'Living Room', 'Kitchen', 'Air Conditioning', 'City View'],
  },
]


export default function RoomMenu() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-2">
      <h1 className="text-4xl font-bold mb-2">Rooms</h1>
      <p className="text-amber-400 mb-8">Choose the room that fits your stay.</p>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.name}
            className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-48 w-full">
              <Image src={room.image} alt={room.name} fill className="object-cover" />
            </div>


            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-amber-500 font-bold mt-1">{room.price}</p>


              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {room.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>


              <Link
                href={room.href}
                className="mt-4 inline-block rounded-full bg-amber-500 px-5 py-2 text-center font-semibold text-black transition-colors hover:bg-amber-600"
              >
                Choose
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}