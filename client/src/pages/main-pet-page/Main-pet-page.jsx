import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PetCard from "@/components/main-search/PetCard";
import MainNavbar from "@/components/main-navbar/MainNavbar";
import { getImageSrc } from "@/lib/image";

function PetPage() {
  const { petId } = useParams();
  const [petInfo, setPetInfo] = useState(null);
  const [relatedPets, setRelatedPets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPetData() {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/${petId}`);
        setPetInfo(response.data);
      } catch (fetchError) {
        console.error("Error fetching pet data:", fetchError);
        setError("Unable to load pet details.");
      }
    }

    fetchPetData();
  }, [petId]);

  useEffect(() => {
    async function fetchRelatedPets() {
      try {
        const response = await fetch("http://localhost:5000/api/pets/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const allPets = await response.json();
        const filtered = allPets
          .filter((pet) => pet._id !== petId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);

        setRelatedPets(filtered);
      } catch (fetchError) {
        console.error("Error fetching related pets:", fetchError);
      }
    }

    fetchRelatedPets();
  }, [petId]);

  const petFacts = useMemo(() => {
    if (!petInfo) {
      return [];
    }

    return [
      { label: "Type", value: petInfo.type, icon: PawPrint },
      { label: "Breed", value: petInfo.breed, icon: Sparkles },
      { label: "Age", value: `${petInfo.age} years`, icon: ShieldCheck },
      { label: "Location", value: petInfo.region, icon: MapPin },
    ];
  }, [petInfo]);

  if (error) {
    return <div className="p-10 text-center text-lg">{error}</div>;
  }

  if (!petInfo) {
    return <div className="p-10 text-center text-lg">Loading pet details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-slate-900">
      <MainNavbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.18),transparent_28%),linear-gradient(135deg,#f6f1ea_0%,#efe5d7_100%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-semibold tracking-wide text-slate-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Pet Profile
            </span>
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-indigo-700 shadow-sm ring-1 ring-indigo-100">
              Available for adoption
            </span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[36px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[540px] overflow-hidden bg-slate-200">
                  <img
                    src={getImageSrc(petInfo.pictures?.[0], petInfo.name || "Pet")}
                    alt={petInfo.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-8 text-white">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                      <BadgeCheck size={16} />
                      Adoption-ready profile
                    </div>
                    <h1 className="mt-4 text-5xl font-black tracking-tight">
                      {petInfo.name}
                    </h1>
                    <div className="mt-3 flex items-center gap-2 text-base text-slate-100">
                      <MapPin size={18} />
                      {petInfo.region}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-[#fbf8f3] p-8">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-700">
                      Meet {petInfo.name}
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900">
                      A calmer, clearer way to decide if this is the right match.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-slate-600">
                      {petInfo.description ||
                        `${petInfo.name} is looking for a safe, stable home with an adopter who is ready for long-term care and companionship.`}
                    </p>

                    <div className="mt-8 grid gap-3">
                      {petFacts.map((fact) => {
                        const Icon = fact.icon;
                        return (
                          <div
                            key={fact.label}
                            className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200"
                          >
                            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                {fact.label}
                              </p>
                              <p className="text-lg font-bold text-slate-900">{fact.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 rounded-[28px] bg-indigo-900 p-6 text-white">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-200">
                      Next Step
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      Start the adoption application.
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-indigo-100">
                      If this profile feels like the right fit, continue with the
                      form and share complete contact and household details.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={`/form/${petId}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-indigo-900 transition hover:bg-slate-100"
                      >
                        Adopt {petInfo.name}
                        <HeartHandshake size={18} />
                      </Link>
                      <Link
                        to="/search"
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                      >
                        Browse More Pets
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[32px] bg-[#192554] p-8 text-white shadow-[0_24px_70px_rgba(25,37,84,0.25)]">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-200">
                  Adoption Perspective
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  Good adoptions are built on fit, not speed.
                </h2>
                <p className="mt-5 text-sm leading-8 text-indigo-100">
                  Think about your daily routine, home environment, travel pattern,
                  and the type of care you can sustain after the excitement of the
                  first week passes. The strongest match is the one that still works
                  six months later.
                </p>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.07)] ring-1 ring-slate-200">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-700">
                  Profile Summary
                </p>
                <div className="mt-5 space-y-5 text-sm leading-8 text-slate-600">
                  <p>
                    This page keeps the adoption decision simple: first understand the
                    pet, then decide whether your space, schedule, and expectations
                    match the care required.
                  </p>
                  <p>
                    If you are unsure, continue browsing. If you are serious, move
                    ahead with the application and provide accurate information so the
                    review process can stay smooth.
                  </p>
                  <p>
                    The goal is not just adoption. The goal is a stable home that
                    lasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[36px] bg-white px-8 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-700">
                Similar Profiles
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-900">
                Keep exploring before you commit.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              A better decision comes from comparison. Review a few more profiles,
              then return to the pet that still feels right.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPets.length > 0 ? (
              relatedPets.map((pet) => <PetCard key={pet._id} pet={pet} />)
            ) : (
              <div className="rounded-[28px] bg-stone-50 p-8 text-center ring-1 ring-slate-200">
                <p className="text-lg font-semibold text-slate-700">No related pets found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PetPage;
