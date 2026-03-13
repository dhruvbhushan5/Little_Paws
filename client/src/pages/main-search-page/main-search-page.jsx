import { useEffect, useMemo, useState } from "react";
import { ChevronDown, FishOff, MapPin, PawPrint, Search } from "lucide-react";
import PetCard from "@/components/main-search/PetCard";
import MainNavbar from "@/components/main-navbar/MainNavbar";

const breedOptionsByAnimal = {
  Dog: ["Golden Retriever", "Boxer", "Labrador Retriever", "French Bulldog"],
  Cat: ["Siamese", "Persian", "Maine Coon", "Ragdoll"],
  Bird: ["Parrot", "Canary", "Finch", "Budgerigar"],
  Hamster: ["Syrian", "Dwarf", "Roborovski"],
  Rabbit: ["Himalayan", "Mini Rex", "Holland Lop"],
};

function MainSearchPage() {
  const [pets, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breed, setBreed] = useState("Any");
  const [city, setCity] = useState("All");
  const [filteredPets, setFilteredPets] = useState([]);
  const [animal, setAnimal] = useState("All");
  const [age, setAge] = useState("Any");

  const animals = ["All", "Dog", "Cat", "Bird", "Hamster", "Rabbit"];
  const cities = ["All", "Chandigarh", "Mohali", "Panchkula"];

  const activeBreedOptions = useMemo(() => {
    if (animal === "All") {
      return [];
    }

    return breedOptionsByAnimal[animal] || [];
  }, [animal]);

  useEffect(() => {
    if (!pets) {
      return;
    }

    let filtered = pets;

    if (animal !== "All") {
      filtered = filtered.filter((pet) => pet.type === animal);
    }

    if (breed !== "Any") {
      filtered = filtered.filter((pet) => pet.breed === breed);
    }

    if (city !== "All") {
      filtered = filtered.filter((pet) => pet.region === city);
    }

    if (age === "1 - 4") {
      filtered = filtered.filter((pet) => pet.age >= 1 && pet.age <= 4);
    } else if (age === "4 - 8") {
      filtered = filtered.filter((pet) => pet.age >= 4 && pet.age <= 8);
    } else if (age === "8 - 12") {
      filtered = filtered.filter((pet) => pet.age >= 8 && pet.age <= 12);
    }

    setFilteredPets(filtered);
  }, [pets, breed, city, age, animal]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/api/pets/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const allPets = await response.json();
        const shuffledPets = allPets.sort(() => 0.5 - Math.random());

        setPet(shuffledPets);
        setFilteredPets(shuffledPets);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading pets...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-lg">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <MainNavbar />

      <section className="bg-indigo-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-200">
                Find Your Match
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                Browse rescue pets with clearer filters and better context.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-indigo-100">
                Narrow by animal type, city, breed, and age to find pets that fit
                your home and routine before you open a full profile.
              </p>
            </div>

            <div className="grid gap-4 rounded-[28px] bg-white/10 p-4 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
              <label className="rounded-2xl bg-white/10 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                  Animal
                </span>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-white/20 bg-transparent px-4 py-3 font-bold text-white outline-none"
                    onChange={(e) => {
                      setAnimal(e.target.value);
                      setBreed("Any");
                    }}
                    value={animal}
                  >
                    {animals.map((option) => (
                      <option key={option} value={option} className="text-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                </div>
              </label>

              <label className="rounded-2xl bg-white/10 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                  City
                </span>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-white/20 bg-transparent px-4 py-3 font-bold text-white outline-none"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                  >
                    {cities.map((option) => (
                      <option key={option} value={option} className="text-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                </div>
              </label>

              <div className="rounded-2xl bg-white/10 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                  Matches
                </span>
                <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-3">
                  <p className="text-3xl font-black">{filteredPets.length}</p>
                  <p className="mt-1 text-sm text-indigo-100">
                    pets available with current filters
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                  Search Tips
                </span>
                <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm leading-7 text-indigo-100">
                  Try broad filters first, then narrow by breed and age once you see the available profiles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                <Search size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-indigo-900">Refine Search</h2>
                <p className="text-sm text-slate-500">Adjust filters without losing your place.</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-indigo-900">
                  Breed
                </h3>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-2xl border border-indigo-100 bg-slate-50 px-4 py-4 text-lg font-medium text-slate-800 outline-none transition focus:border-indigo-400"
                    onChange={(e) => setBreed(e.target.value)}
                    value={breed}
                  >
                    <option>Any</option>
                    {activeBreedOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                    {animal === "All" ? <option>Any Breed</option> : null}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600" />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-indigo-900">
                  Age
                </h3>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-2xl border border-indigo-100 bg-slate-50 px-4 py-4 text-lg font-medium text-slate-800 outline-none transition focus:border-indigo-400"
                    onChange={(e) => setAge(e.target.value)}
                    value={age}
                  >
                    <option>Any</option>
                    <option>1 - 4</option>
                    <option>4 - 8</option>
                    <option>8 - 12</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600" />
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-indigo-700" />
                  <div>
                    <p className="text-sm font-bold text-indigo-900">Current city filter</p>
                    <p className="mt-1 text-sm text-indigo-700">
                      {city === "All" ? "Showing pets from all available regions." : `Showing pets in ${city}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                  Search Results
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {filteredPets.length} pet{filteredPets.length === 1 ? "" : "s"} ready to meet you
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                  Animal: {animal}
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                  Breed: {breed}
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                  Age: {age}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)
              ) : (
                <div className="col-span-full rounded-[28px] bg-white px-8 py-16 text-center shadow-sm ring-1 ring-slate-200">
                  <div className="flex justify-center items-center mb-4">
                    <FishOff className="h-20 w-20 text-indigo-700" />
                  </div>
                  <p className="text-2xl font-black text-slate-800">No Pets Found</p>
                  <p className="mt-3 text-base text-slate-500">
                    Try widening your animal, breed, city, or age filters to discover more profiles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainSearchPage;
