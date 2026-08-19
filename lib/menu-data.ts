
export type MenuItem = {
  name: string;
  price: string;
  image: string;
};

export const foodMenu: Record<string, MenuItem[]> = {
  Traditional: [
    { name: "Doro", price: "80 Birr", image: "/image/doro.Webp" },
    { name: "Firfir", price: "25 Birr", image: "/image/firfir.Webp" },
    { name: "Kitfo", price: "72 Birr", image: "/image/kitfFo.Webp" },
  ],
  "Fast Food": [
    { name: "Pizza", price: "50 Birr", image: "/image/pizza.Webp" },
    { name: "Pasta", price: "25 Birr", image: "/image/pasta.Webp" },
    { name: "Burger", price: "65 Birr", image: "/image/burger.Webp" },
  ],
  Grill: [
    { name: "Tibs", price: "60 Birr", image: "/image/tibs.Webp" },
    { name: "Grilled Fish", price: "90 Birr", image: "/image/fish.Webp" },
  ],
  Breakfast: [
    { name: "Ful", price: "30 Birr", image: "/image/ful.Webp" },
    { name: "Chechebsa", price: "35 Birr", image: "/image/chechebsa.Webp" },
  ],
  Dessert: [
    { name: "Cake", price: "40 Birr", image: "/image/cake.Webp" },
    { name: "Ice Cream", price: "30 Birr", image: "/image/icecream.Webp" },
  ],
};

export const drinkMenu: Record<string, MenuItem[]> = {
  "Hot Drink": [
    { name: "Coffee", price: "$3", image: "/image/coffee.Webp" },
    { name: "Tea", price: "$2", image: "/image/tea.Webp" },
    { name: "Macchiato", price: "$3", image: "/image/makiyato.Webp" },
  ],
  "Cold Drink": [
    { name: "Fresh Juice", price: "$4", image: "/image/juice.Webp" },
    { name: "Iced Coffee", price: "$4", image: "/image/iced-coffee.Webp" },
    { name: "Milkshake", price: "$5", image: "/image/milkshake.Webp" },
  ],
  "Soft Drink": [
    { name: "Coca Cola", price: "$2", image: "/image/coca.Webp" },
    { name: "Sprite", price: "$2", image: "/image/sprite.Webp" },
    { name: "Water", price: "$1", image: "/image/water.Webp" },
  ],
  Alcohol: [
    { name: "Draft", price: "$2", image: "/image/draft.Webp" },
    { name: "Giorgis", price: "$2", image: "/image/sprite.Webp" },
    { name: "Castle", price: "$1", image: "/image/water.Webp" },
  ],
};

export const roomMenu: MenuItem[] = [
  { name: "One Bed", price: "500 Birr / night", image: "/image/onebed.Webp" },
  { name: "Two Bed", price: "800 Birr / night", image: "/image/twobed.Webp" },
  { name: "Three Bed", price: "1200 Birr / night", image: "/threebed.Webp" },
  { name: "Family Suite", price: "2000 Birr / night", image: "/image/family.Webp" },
];