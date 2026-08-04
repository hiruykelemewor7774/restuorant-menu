import FoodMenu from "./components/FoodMenu";
import Drinkmenu from "./components/Drinkmenu";
import RoomMenu from "./components/RoomMenu";

export default function Home() {
  return (
    <div className="m-0">
      {/* የ Welcome ፎቶ ሴክሽን - background ከ body ስለሚመጣ ተጨማሪ bg አያስፈልገውም */}
      <section className="relative pt-0 ml-0 w-full min-h-screen text-center flex flex-col items-center justify-center shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-amber-300 text-7xl md:text-9xl font-bold">Welcome</span>
          </h1>
          <h2 className="text-3xl mt-4 text-white">To Digital Food Menu</h2>
          <p className="text-amber-400 mt-4">Choose a category from the menu above.</p>
        </div>
      </section>

      {/* የሜኑ ዝርዝሮች - background ከ body ስለሚመጣ transparent ሆነው ይታያሉ */}
      <FoodMenu />
      <Drinkmenu />
      <RoomMenu />
    </div>
  );
}