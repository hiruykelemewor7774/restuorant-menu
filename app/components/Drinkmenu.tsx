
'use client'


import { useState } from 'react'
import MenuCard, { MenuItem } from '../components/MenuCard'


const categories = ['Hot Drink', 'Cold Drink', 'Soft Drink' ,'Alcohol'] as const
type Category = (typeof categories)[number]


const drinks: Record<Category, MenuItem[]> = {
  'Hot Drink': [
    { name: 'Coffee',    price: '$3', image: '/image/coffee.Webp', href: '/drink/coffee' },
    { name: 'Tea',       price: '$2', image: '/image/tea.Webp',    href: '/drink/tea' },
    { name: 'Macchiato', price: '$3', image: '/image/makiyato.Webp', href: '/drink/macchiato' },
  ],
  'Cold Drink': [
    { name: 'Fresh Juice', price: '$4', image: '/image/juice.Webp',     href: '/drink/juice' },
    { name: 'Iced Coffee', price: '$4', image: '/image/iced-coffee.Webp', href: '/drink/iced-coffee' },
    { name: 'Milkshake',   price: '$5', image: '/image/milkshake.Webp',  href: '/drink/milkshake' },
  ],
  'Soft Drink': [
    { name: 'Coca Cola', price: '$2', image: '/image/coca.Webp',  href: '/drink/cola' },
    { name: 'Sprite',    price: '$2', image: '/image/sprite.Webp', href: '/drink/sprite' },
    { name: 'Water',     price: '$1', image: '/image/water.Webp',  href: '/drink/water' },
  ],
  'Alcohol':
  [
    { name: 'draft', price: '$2', image: '/image/draft.Webp',  href: '/drink/draft' },
    { name: 'giorgis',    price: '$2', image: '/image/sprite.Webp', href: '/drink/gioris' },
    { name: 'castle',     price: '$1', image: '/image/water.Webp',  href: '/drink/castle' },
  ],
}


export default function DrinkPage() {
  const [active, setActive] = useState<Category>('Hot Drink')


  return (
    <main className="max-w-6xl mx-auto px-6 py-0">
      <h1 className="text-4xl font-bold mb-3 pt-25">Drinks</h1>


      <div className="flex gap-4 mb-8 ">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`rounded-full px-5 py-2 font-semibold transition-colors  ${
              active === category
                ? 'bg-amber-500 text-black'
                : 'border hover:bg-gray-100 hover:text-black '
            }`}
          >
            {category}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {drinks[active].map((item) => (
          <MenuCard key={item.name} item={item} />
        ))}
      </div>
    </main>
  )
}
