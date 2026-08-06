import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased backdrop-blur-xl">
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <div className="flex h-screen w-screen overflow-hidden">

                {/* ሳይድባር */}
                <aside className="h-screen sticky top-0 overflow-y-auto w-64 shrink-0 z-20">
                  <Sidebar />
                </aside>

                {/* የቀኝ በኩል አጠቃላይ ክፍል (ማሸብለል የሌለበት) */}
                <div className="flex-1 flex flex-col h-full relative bg-[url('/image/restaurant.Webp')] backdrop-blur-xl bg-cover bg-center">

                  {/* የጀርባ ምስል ከለላ (Overlay) */}
                  <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px] pointer-events-none"></div>

                  {/* Fixed Navbar (ከላይ ቋሚ ሆኖ የሚቀመጥ) */}
                  <div className="w-full z-50 shrink-0">
                   <Navbar />
                  </div>

                  {/* ማሸብለል የሚችለው ዋናው የገጽ ኮንቴንት ብቻ */}
                  <main className="flex-1 px-6 py-8 overflow-y-auto relative z-10">
                    {children}
                  </main>

                </div>

              </div>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}