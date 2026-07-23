
import FoodMenu from "./components/FoodMenu";
import Drinkmenu from "./components/Drinkmenu"
import RoomMenu from "./components/RoomMenu";
export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="ml-18 mr-18 pt-20 text-center bg-[url('/image/food1.Webp')] bg-cover bg-center rounded-4xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
     
        <h1 className="text-4xl">
          <span className="text-amber-300 text-9xl font-bold">Welcome</span>
        </h1>
        <h2 className="text-3xl mt-4">To Digital Food Menu</h2>
       
        <p className="text-amber-400 mt-4">Choose a category from the menu above.</p>
        </section>
       
        <FoodMenu/>
        <Drinkmenu/>
        <RoomMenu/>
    </main>
  )
}
