import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import banner2 from "@/assets/banner2.webp";
import banner5 from "@/assets/banner5.webp";
import banner4 from "@/assets/banner4.webp";

function AuthLayout() {
  const slides = [banner4, banner2, banner5];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <nav className="flex items-center justify-between bg-slate-950/95 px-4 py-4 text-white backdrop-blur">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-amber-300">
            LilPaws
          </Link>
        </div>
        <div className="hidden lg:flex space-x-4">
          <Link to="/" className="rounded px-3 py-2 transition-colors duration-300 hover:bg-white/10">
            Home
          </Link>
        </div>
      </nav>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.68), rgba(15, 23, 42, 0.68)), url(${slide})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_35%)]" />
        <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
