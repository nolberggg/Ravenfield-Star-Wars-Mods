import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EraPage from "./EraPage";
import SavedPage from "./SavedPage";

function App() {
  const eras = ["ALL","PREQUEL", "ORIGINAL", "SEQUEL", "OTHER"];
  const [savedMods, setSavedMods] = useState(new Set(JSON.parse(localStorage.getItem("savedMods") || "[]")));

  const toggleSave = (modId) => {
    const updated = new Set(savedMods);
    if (updated.has(modId)) {
      updated.delete(modId);
    } else {
      updated.add(modId);
    }
    setSavedMods(updated);
    localStorage.setItem("savedMods", JSON.stringify(Array.from(updated)));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen w-full bg-gray-100 text-white">
              {/* Top Bar */}
              <div className="w-full bg-gray-200 text-black px-6 py-3 flex justify-between items-center font-futura font-semibold text-sm tracking-wide uppercase">
                <div className="flex items-center gap-4">
                  <span>SW:RF Discord</span>
                  <a
                    href="https://discord.gg/TV4ZzytTna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-[#fbc914] transition"
                  >
                    Join
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span>Made by Nolberggg</span>
                  <a
                    href="https://www.youtube.com/@nolberggg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-[#fbc914] transition"
                  >
                    Subscribe!
                  </a>
                  <Link
                    to="/saved"
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-[#fbc914] transition"
                  >
                    Saved
                  </Link>
                </div>
              </div>

              {/* Hero Section */}
              <div
                className="h-[500px] bg-cover bg-center mx-[50px] my-10 rounded-xl shadow-lg flex items-center justify-center text-center"
                style={{
                  backgroundImage: "url('/images/hero.png')",
                }}
              >
                <h1 className="text-5xl md:text-7xl font-futura font-black bg-black bg-opacity-50 p-6 rounded-xl text-shadow">
                  RAVENFIELD STAR WARS MODS
                </h1>
              </div>

              {/* Trilogy Blocks */}
              <div className="px-[50px] pb-10">
                <div className="flex flex-col gap-y-4">
                  {eras.map((era) => (
                    <Link
                      key={era}
                      to={`/era/${era.toLowerCase()}`}
                      className="block group w-full h-[200px]"
                    >
                      <div className="relative w-full h-full rounded-xl overflow-hidden group-hover:ring-4 group-hover:ring-yellow-400 transition-all duration-700">
                        <img
                          src={`/images/eras/${era.toLowerCase()}.png`}
                          alt={era}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition duration-300 pointer-events-none rounded-xl" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 pointer-events-none rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <h2 className="text-black group-hover:text-white text-2xl font-futura font-extrabold transition-all duration-300 text-shadow group-hover:text-shadow-none">
                            <span
                              className="transition-all duration-300 group-hover:text-shadow-none"
                              style={{ textShadow: "1px 1px 2px white" }}
                            >
                              {era === "OTHER" ? "OTHER" :
                              era === "ALL" ? "ALL MODS" :
                              `${era} TRILOGY`}
                            </span>
                          </h2>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/era/:era" element={<EraPage savedMods={savedMods} toggleSave={toggleSave} />} />
        <Route path="/saved" element={<SavedPage savedMods={savedMods} toggleSave={toggleSave} />} />
      </Routes>
    </Router>
  );
}

export default App;
