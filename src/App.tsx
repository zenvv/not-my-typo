import { useState } from "react";
import TypingTest from "./features/typing-test/TypingTest";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import IntroSplash from "./components/layout/IntroSplash";
import { AppearanceProvider } from "./context/AppearanceContext";
import { TestSettingsProvider } from "./context/TestSettingsContext";
import { SoundProvider } from "./context/SoundContext";
import { CaretProvider } from "./context/CaretContext";
import { StatsDisplayProvider } from "./context/StatsDisplayContext";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <AppearanceProvider>
      <TestSettingsProvider>
        <SoundProvider>
          <CaretProvider>
            <StatsDisplayProvider>
              <TooltipProvider>
                {!introDone && <IntroSplash onDone={() => setIntroDone(true)} />}
                <div className="flex flex-col items-center justify-center w-full h-screen bg-linear-to-t from-card via-background to-background">
                  <div className="flex flex-col items-center justify-center w-full h-full max-w-5xl">
                    <Navbar />
                    <main className="flex-1 w-full h-full my-8">
                      <TypingTest />
                    </main>
                    <Footer />
                  </div>
                </div>
              </TooltipProvider>
            </StatsDisplayProvider>
          </CaretProvider>
        </SoundProvider>
      </TestSettingsProvider>
    </AppearanceProvider>
  );
}

export default App;
