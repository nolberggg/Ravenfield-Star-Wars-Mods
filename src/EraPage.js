import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function EraPage({ savedMods, toggleSave }) {
  const { era } = useParams();
  const [mods, setMods] = useState([]);
  const [viewMode, setViewMode] = useState("compact");
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("subs-desc");

  const normalizeType = (type) => {
    if (!type) return "Other";
    const t = type.toLowerCase();
    if (t.includes("map")) return "Maps";
    if (t.includes("vehicle")) return "Vehicles";
    if (t.includes("weapon")) return "Weapons";
    if (t.includes("skin")) return "Skins";
    if (t.includes("mutator")) return "Mutators";
    return t.charAt(0).toUpperCase() + t.slice(1)
  };

  useEffect(() => {
    localStorage.setItem("lastVisitedEra", era.toLowerCase()); // <-- add this here
  
    fetch("/mods_data.json")
      .then((res) => res.json())
      .then((data) => {
        if (era.toLowerCase() === "all") {
          setMods(
            data.map((mod) => ({
              ...mod,
              normalizedTypes: mod.contentTypes.flatMap((type) =>
                type.split(" ").map((t) => normalizeType(t.trim()))
                .filter(Boolean)
              ),
            }))
          );
          return;
        }
  
        const eraLetterMap = {
          prequel: "P",
          original: "O",
          sequel: "S",
          other: "Other",
        };
  
        const currentEraLetter = eraLetterMap[era.toLowerCase()];
  
        const filtered = data
          .filter((mod) => {
            if (!mod.era) return false;
            return mod.era
              .split(" ")
              .map((e) => e.trim().toLowerCase())
              .includes(currentEraLetter.toLowerCase());
          })
          .map((mod) => ({
            ...mod,
            normalizedTypes: mod.contentTypes
              .flatMap((type) => type.split(" "))
              .map((t) => normalizeType(t.trim()))
              .filter(Boolean),
          }));
  
        setMods(filtered);
      });
  }, [era]);

  const filteredMods = mods
    .filter(mod =>
      filterType === "All" || mod.normalizedTypes.includes(filterType)
    )
    .filter(mod =>
      mod.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "subs-asc") return a.currentSubscribers - b.currentSubscribers;
      if (sortOption === "subs-desc") return b.currentSubscribers - a.currentSubscribers;
      if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
      return 0;
    });
  const excludedTypes = ["-", "Mod", "Tools","Game"];
  const allTypes = Array.from(new Set(mods.flatMap(mod => mod.normalizedTypes)))
    .filter(type => !excludedTypes.includes(type));

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6 font-futura uppercase">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2
          className="text-5xl font-bold font-futura text-black tracking-tight"
          style={{ textShadow: "2px 2px 0 #D3D3D3" }}
        >
          {era} ERA MODS
        </h2>
        <div className="flex gap-2 flex-wrap items-center">
          <Link
            to="/saved"
            className="px-4 py-2 rounded-xl font-medium bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
          >
            SAVED MODS
          </Link>

          <div className="w-px h-6 bg-gray-400 mx-2 hidden sm:block" />

          <button
            onClick={() => setViewMode("compact")}
            className={`px-4 py-2 rounded-xl font-medium transition duration-200 ${viewMode === "compact" ? "bg-[#fbc914] text-black" : "bg-gray-700 text-white hover:bg-gray-600"}`}
          >
            COMPACT
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-xl font-medium transition duration-200 ${viewMode === "list" ? "bg-[#fbc914] text-black" : "bg-gray-700 text-white hover:bg-gray-600"}`}
          >
            LIST
          </button>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl font-medium bg-white text-black border border-gray-300 shadow-sm"
          >
            <option value="All">ALL TYPES</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-xl font-medium bg-white text-black border border-gray-300 shadow-sm"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded-xl font-medium bg-white text-black border border-gray-300 shadow-sm"
          >
            <option value="subs-desc">Subscribers (High → Low)</option>
            <option value="subs-asc">Subscribers (Low → High)</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
          </select>
          </div> 
        </div>

      <Link to="/" className="text-black-600 font-normal font-futura hover:text-black-800">← BACK TO HOME</Link>

      {viewMode === "compact" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8">
          {filteredMods.map((mod) => (
            <a
              key={mod.id}
              href={mod.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSave(mod.id);
                  }}
                  className={`text-lg rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors duration-200 ${
                    savedMods.has(mod.id) ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  title={savedMods.has(mod.id) ? "Saved" : "Save"}
                >
                  {savedMods.has(mod.id) ? "✔" : "+"}
                </button>
              </div>
              <img
                src={`/thumbnails/${mod.id}.png`}
                alt={mod.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white drop-shadow-sm">{mod.title}</h3>
                <p className="text-sm text-gray-300">{mod.author}</p>
                <p className="text-sm text-gray-300">
                  {mod.normalizedTypes.filter(type => !excludedTypes.includes(type)).join(", ")}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredMods.map((mod) => (
            <div
              key={mod.id}
              className="relative bg-white rounded-xl p-5 flex gap-5 items-start shadow-md hover:shadow-lg transition"
            >
              <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleSave(mod.id);
                }}
                className={`text-lg rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors duration-200 ${
                  savedMods.has(mod.id) ? "bg-black text-white" : "bg-white text-black"
                }`}
                title={savedMods.has(mod.id) ? "Saved" : "Save"}
              >
                {savedMods.has(mod.id) ? "✓" : "+"}
              </button>
            </div>
              <img
                src={`/thumbnails/${mod.id}.png`}
                alt={mod.title}
                className="w-28 h-28 rounded object-cover"
              />
              <div className="flex flex-col gap-1">
                <a
                  href={mod.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-[#fbc914] hover:underline leading-snug"
                >
                  {mod.title}
                </a>
                <p className="text-base text-black">{mod.author}</p>
                <p className="text-sm text-gray-700">
                  {mod.normalizedTypes.join(", ")} | {new Date(mod.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
                <p className="text-sm text-gray-600">
                  SUBS: {mod.currentSubscribers} | VISITORS: {mod.uniqueVisitors}
                </p>
                {mod.notes && (
                  <p className="text-sm italic text-[#fbc914]">
                    NOTE: {mod.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EraPage;
