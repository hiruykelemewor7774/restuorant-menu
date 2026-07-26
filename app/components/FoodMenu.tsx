'use client'


import { useState } from 'react'
import MenuCard, { MenuItem } from './MenuCard'


const categories = ['Traditional', 'Fast Food', 'Grill', 'Breakfast', 'Dessert'] as const
type Category = (typeof categories)[number]


const foods: Record<Category, MenuItem[]> = {
  'Traditional': [
    { name: 'Doro',   price: '80 Birr', image: '/image/doro.Webp',   href: '/food/doro' },
    { name: 'Firfir', price: '25 Birr', image: '/image/firfir.Webp', href: '/food/firfir' },
    { name: 'Kitfo',  price: '72 Birr', image: '/image/kitfFo.Webp',  href: '/food/kitfo' },
  ],
  'Fast Food': [
    { name: 'Pizza',  price: '50 Birr', image: '/image/pizza.Webp',  href: '/food/pizza' },
    { name: 'Pasta',  price: '25 Birr', image: '/image/pasta.Webp',  href: '/food/pasta' },
    { name: 'Burger', price: '65 Birr', image: '/image/burger.Webp', href: '/food/burger' },
  ],
  'Grill': [
    { name: 'Tibs', price: '60 Birr',  image: '/image/tibs.Webp', href: '/food/tibs' },
    { name: 'Grilled Fish', price: '90 Birr', image: '/image/fish.Webp', href: '/food/grilled-fish' },
  ],
  'Breakfast': [
    { name: 'Ful', price: '30 Birr', image: '/image/ful.Webp', href: '/food/ful' },
    { name: 'Chechebsa', price: '35 Birr', image: '/image/chechebsa.Webp', href: '/food/chechebsa' },
  ],
  'Dessert': [
    { name: 'Cake', price: '40 Birr', image: '/image/cake.Webp', href: '/food/cake' },
    { name: 'Ice Cream', price: '30 Birr', image: '/image/icecream.Webp', href: '/food/ice-cream' },
  ],
}


export default function FoodMenu() {
  const [active, setActive] = useState<Category>('Traditional')


  return (
    <main className="max-w-6xl mx-auto px-6 py-2">
      <h1 className="text-4xl font-bold mb-2 pt-25">Food</h1>
      <p className="mb-3">Whatever you want you can order</p>


      <div className="flex flex-wrap gap-4 mb-8 rounded-2xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:scale-105
    hover:bg-white/10">
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
