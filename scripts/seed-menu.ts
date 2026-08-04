import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const existing = await prisma.menuItem.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} menu items. Skipping seed.`);
    console.log("ካጠፋህ በኋላ እንደገና ልታስኬደው ከፈለግህ: npx prisma migrate reset");
    process.exit(0);
  }

  const foodItems = [
    { type: "Food", category: "Traditional", name: "Doro", price: "80 Birr", image: "/image/doro.Webp" },
    { type: "Food", category: "Traditional", name: "Firfir", price: "25 Birr", image: "/image/firfir.Webp" },
    { type: "Food", category: "Traditional", name: "Kitfo", price: "72 Birr", image: "/image/kitfFo.Webp" },
    { type: "Food", category: "Fast Food", name: "Pizza", price: "50 Birr", image: "/image/pizza.Webp" },
    { type: "Food", category: "Fast Food", name: "Pasta", price: "25 Birr", image: "/image/pasta.Webp" },
    { type: "Food", category: "Fast Food", name: "Burger", price: "65 Birr", image: "/image/burger.Webp" },
    { type: "Food", category: "Grill", name: "Tibs", price: "60 Birr", image: "/image/tibs.Webp" },
    { type: "Food", category: "Grill", name: "Grilled Fish", price: "90 Birr", image: "/image/fish.Webp" },
    { type: "Food", category: "Breakfast", name: "Ful", price: "30 Birr", image: "/image/ful.Webp" },
    { type: "Food", category: "Breakfast", name: "Chechebsa", price: "35 Birr", image: "/image/chechebsa.Webp" },
    { type: "Food", category: "Dessert", name: "Cake", price: "40 Birr", image: "/image/cake.Webp" },
    { type: "Food", category: "Dessert", name: "Ice Cream", price: "30 Birr", image: "/image/icecream.Webp" },
  ];

  const drinkItems = [
    { type: "Drink", category: "Hot Drink", name: "Coffee", price: "$3", image: "/image/coffee.Webp" },
    { type: "Drink", category: "Hot Drink", name: "Tea", price: "$2", image: "/image/tea.Webp" },
    { type: "Drink", category: "Hot Drink", name: "Macchiato", price: "$3", image: "/image/makiyato.Webp" },
    { type: "Drink", category: "Cold Drink", name: "Fresh Juice", price: "$4", image: "/image/juice.Webp" },
    { type: "Drink", category: "Cold Drink", name: "Iced Coffee", price: "$4", image: "/image/iced-coffee.Webp" },
    { type: "Drink", category: "Cold Drink", name: "Milkshake", price: "$5", image: "/image/milkshake.Webp" },
    { type: "Drink", category: "Soft Drink", name: "Coca Cola", price: "$2", image: "/image/coca.Webp" },
    { type: "Drink", category: "Soft Drink", name: "Sprite", price: "$2", image: "/image/sprite.Webp" },
    { type: "Drink", category: "Soft Drink", name: "Water", price: "$1", image: "/image/water.Webp" },
    { type: "Drink", category: "Alcohol", name: "Draft", price: "$2", image: "/image/draft.Webp" },
    { type: "Drink", category: "Alcohol", name: "Giorgis", price: "$2", image: "/image/sprite.Webp" },
    { type: "Drink", category: "Alcohol", name: "Castle", price: "$1", image: "/image/water.Webp" },
  ];

  const roomItems = [
    {
      type: "Room", category: "", name: "One Bed", price: "500 Birr / night", image: "/image/onebed.Webp",
      features: JSON.stringify(["1 Single Bed", "Free Wi-Fi", "Private Bathroom", "TV"]),
    },
    {
      type: "Room", category: "", name: "Two Bed", price: "800 Birr / night", image: "/image/twobed.Webp",
      features: JSON.stringify(["2 Beds", "Free Wi-Fi", "Air Conditioning", "Breakfast Included"]),
    },
    {
      type: "Room", category: "", name: "Three Bed", price: "1200 Birr / night", image: "/threebed.Webp",
      features: JSON.stringify(["3 Beds", "Free Wi-Fi", "Balcony", "Mini Fridge", "Breakfast Included"]),
    },
    {
      type: "Room", category: "", name: "Family Suite", price: "2000 Birr / night", image: "/image/family.Webp",
      features: JSON.stringify(["4 Beds", "Living Room", "Kitchen", "Air Conditioning", "City View"]),
    },
  ];

  await prisma.menuItem.createMany({
    data: [...foodItems, ...drinkItems, ...roomItems],
  });

  console.log(`✅ ${foodItems.length + drinkItems.length + roomItems.length} menu items ተፈጥረዋል`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});