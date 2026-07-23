'use client'


import { useState } from 'react'
import MenuCard, { MenuItem } from './MenuCard'


const categories = ['Traditional', 'Fast Food', 'Grill', 'Breakfast', 'Dessert'] as const
type Category = (typeof categories)[number]


const foods: Record<Category, MenuItem[]> = {
  'Traditional': [
    { name: 'Doro',   price: '80 Birr', image: '/image/doro.jpg',   href: '/food/doro' },
    { name: 'Firfir', price: '25 Birr', image: '/image/firfir.jpg', href: '/food/firfir' },
    { name: 'Kitfo',  price: '72 Birr', image: '/image/kitfo.jpg',  href: '/food/kitfo' },
  ],
  'Fast Food': [
    { name: 'Pizza',  price: '50 Birr', image: '/image/pizza.jpg',  href: '/food/pizza' },
    { name: 'Pasta',  price: '25 Birr', image: '/image/pasta.jpg',  href: '/food/pasta' },
    { name: 'Burger', price: '65 Birr', image: '/image/burger.jpg', href: '/food/burger' },
  ],
  'Grill': [
    { name: 'Tibs',        price: '60 Birr',  image: '/image/tibs.Webp',   href: '/food/tibs' },
    { name: 'Grilled Fish', price: '90 Birr', image: '/image/fish.jpg',    href: '/food/grilled-fish' },
  ],
  'Breakfast': [
    { name: 'Ful',    price: '30 Birr', image: '/image/ful.jpg',    href: '/food/ful' },
    { name: 'Chechebsa', price: '35 Birr', image: '/image/chechebsa.jpg', href: '/food/chechebsa' },
  ],
  'Dessert': [
    { name: 'Cake',      price: '40 Birr', image: '/image/cake.jpg',      href: '/food/cake' },
    { name: 'Ice Cream', price: '30 Birr', image: '/image/icecream.jpg',  href: '/food/ice-cream' },
  ],
}


export default function FoodMenu() {
  const [active, setActive] = useState<Category>('Traditional')


  return (
    <main className="max-w-6xl mx-auto px-6 py-2">
      <h1 className="text-4xl font-bold mb-2">Food</h1>
      <p className="mb-8">Whatever you want you can order</p>


      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`rounded-full px-5 py-2 font-semibold transition-colors ${
              active === category
                ? 'bg-amber-500 text-black'
                : 'border hover:bg-gray-100 hover:text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods[active].map((item) => (
          <MenuCard key={item.name} item={item} />
        ))}
      </div>
    </main>
  )
}
