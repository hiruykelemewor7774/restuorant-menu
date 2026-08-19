"use client";

import FoodMenu from "./components/FoodMenu";
import Drinkmenu from "./components/Drinkmenu";
import RoomMenu from "./components/RoomMenu";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="m-0">
      <section className="relative text-center text-amber-300 flex flex-col items-center justify-center shadow-lg pt-20">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-amber-500 text-7xl md:text-9xl font-bold">{t("welcome")}</span>
          </h1>
          <h2 className="text-3xl text-white">{t("subtitle")}</h2>
          <p className="text-amber-400 mt-40">{t("chooseCategory")}</p>
        </div>
      </section>
      <FoodMenu />
      <Drinkmenu />
      <RoomMenu />
    </div>
  );
}