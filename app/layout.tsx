import AppShell from "./components/AppShell";
import Sidebar from "./components/Sidebar";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { UIProvider } from "./context/UIContext";
import QrTableReader from "./components/QrTableReader";
import MobileSidebarWrapper from "./components/MobileSidebarWrapper";
import "./globals.css";
import BackgroundCarousel from "./components/BackgroundCarousel";
import { SettingsProvider } from "./context/SettingsContext";
import CallWaiterButton from "./components/CallWaiterButton";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased backdrop-blur-xl">
        <ThemeProvider>
          <SettingsProvider>
            <LanguageProvider>
              <CartProvider>
                <UIProvider>
                  <QrTableReader />
                
                {/* Fixed Navbar - Customer ወይም Staff (URL ተመስርቶ ራሱ ይመርጣል) */}
                   <AppShell />

                <div className="flex h-screen w-screen overflow-hidden">

                  {/* ሳይድባር - Mobile ላይ overlay drawer, Desktop ላይ static */}
                  <MobileSidebarWrapper>
                    <Sidebar />
                  </MobileSidebarWrapper>

                  {/* የቀኝ በኩል አጠቃላይ ክፍል (ማሸብለል የሌለበት) */}
                  <div className="app-main-shell flex-1 flex flex-col h-full relative bg-slate-100 backdrop-blur-[2px] bg-cover bg-center w-full">
                      <BackgroundCarousel />
                   
                    {/* የጀርባ ምስል ከለላ (Overlay) */}
                    <div className="app-overlay absolute inset-0 bg-gray-950/70 backdrop-blur-[2px] pointer-events-none"></div>

                    {/* ማሸብለል የሚችለው ዋናው የገጽ ኮንቴንት ብቻ */}
                    <main className="flex-1 pt-8 overflow-y-auto relative z-10">
                      {children}
                    </main>
                    <CallWaiterButton />
                  </div>
                </div>
                </UIProvider>
              </CartProvider>
            </LanguageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}