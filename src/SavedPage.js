import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SavedPage({ savedMods, toggleSave }) {
  const [allMods, setAllMods] = useState([]);

  useEffect(() => {
    fetch("/mods_data.json")
      .then((res) => res.json())
      .then((data) => {
        setAllMods(data);
      });
  }, []);

  const filteredMods = allMods.filter((mod) => savedMods.has(mod.id));
  const lastEra = localStorage.getItem("lastVisitedEra") || "all";

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black font-futura uppercase">
      <h2
  className="text-5xl font-bold font-futura text-black tracking-tight mb-6"
  style={{ textShadow: "2px 2px 0 #D3D3D3" }}
      >
        SAVED MODS
      </h2>

      <div className="flex gap-4 mb-6">
        <Link to="/" className="text-black-600 font-normal font-futura hover:text-black-800">
          ← BACK TO HOME
        </Link>
        <Link to={`/era/${lastEra}`} className="text-black-600 font-normal font-futura hover:text-black-800">
         ← BACK TO ERA
</Link>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {filteredMods.map((mod) => (
          <div
            key={mod.id}
            className="relative bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleSave(mod.id);
                }}
                className="text-lg rounded-full w-8 h-8 flex items-center justify-center shadow bg-black text-white"
                title="Unsave"
              >
                ✕
              </button>
            </div>

            <a
              href={mod.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`/thumbnails/${mod.id}.png`}
                alt={mod.title}
                className="w-full aspect-square object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-bold">{mod.title}</h3>
              <p className="text-sm">{mod.author}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedPage;
