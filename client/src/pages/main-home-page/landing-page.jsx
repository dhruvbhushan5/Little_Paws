import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, UserCog, LogOut, HandHelping, CheckCircle2, Share2 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import PetCard from '@/components/main-search/PetCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Landingpage = () => {
  const [pets, setPet] = useState(null);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdminUser = user?.role === 'shelterAdmin';
  const [activeSection, setActiveSection] = useState('mission');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pets/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const fetchedPets = await response.json();
        const shuffledPets = fetchedPets.sort(() => 0.5 - Math.random()).slice(0, 6);
        setPet(shuffledPets);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user?.role === 'shelterAdmin') {
      navigate('/shelterAdmin');
    }
  }, [navigate, user?.role]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      alert(data.message);
      window.location.href = '/';
    } catch (logoutError) {
      console.error('Error logging out:', logoutError);
      alert(logoutError.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-auto bg-gray-900">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://i.pinimg.com/564x/ec/2c/3b/ec2c3b671df9dd4a28513f823b71333f.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/50" />

      <div className="relative z-20 container mx-auto px-6 pt-20">
        <nav className="mb-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">LilPaws</Link>
          <div className="flex gap-6">
            {!isAdminUser ? (
              <>
                <Link to="/" className="text-white transition-colors hover:text-indigo-400">Home</Link>
                <Link to="/search" className="text-white transition-colors hover:text-indigo-400">Pets</Link>
                <Link to="/shop/home" className="text-white transition-colors hover:text-indigo-400">Ecommerce</Link>
                <Link to="/reportStray" className="text-white transition-colors hover:text-indigo-400">Report Stray</Link>
                <Link to="/aboutUs" className="text-white transition-colors hover:text-indigo-400">About Us</Link>
              </>
            ) : null}

            {isAuthenticated ? (
              isAdminUser ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-white transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="ml-[9px] mt-[-9px] bg-indigo-900">
                      <AvatarFallback className="bg-indigo-900 font-extrabold text-white">
                        {user?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/applicationStatus')}>
                      <UserCog className="mr-2 h-4 w-4" />
                      <Link to="/applicationStatus">Application Status</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <div>
                <a href="/auth/login" className="mr-4 text-white transition-colors hover:text-indigo-400">
                  Login
                </a>
                <a href="/auth/register" className="text-white transition-colors hover:text-indigo-400">
                  Register
                </a>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-7xl">Find your pet</h1>
          <p className="mb-8 text-lg text-gray-200">
            In our shelter there are several pets who wait only for you. They need a loving family and a real
            home. Come and meet your future friend - maybe they already love you!In our shelter there are several
            pets who wait only for you. They need a loving family and a real home. Come and meet your future
            friend - maybe they already love you!
          </p>
          <Link to="/search" className="text-white transition-colors hover:text-indigo-400">
            <button className="mb-16 rounded-full bg-indigo-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-indigo-800">
              Let's Adopt
            </button>
          </Link>
        </div>

        <div className="mt-28 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link to="/search">
            <div className="m-5 cursor-pointer rounded-lg bg-white p-16 text-center shadow-lg transition-shadow hover:shadow-2xl">
              <div className="mb-4 rounded-full bg-indigo-300 p-3 text-indigo-900">
                <Heart className="h-16 w-16" />
              </div>
              <p className="font-medium text-indigo-900">Adopt a pet</p>
            </div>
          </Link>
          <Link to="/aboutUs">
            <div className="m-5 cursor-pointer rounded-lg bg-white p-16 text-center shadow-lg transition-shadow hover:shadow-2xl">
              <div className="mb-4 rounded-full bg-indigo-300 p-3 text-indigo-900">
                <Users className="h-16 w-16" />
              </div>
              <p className="font-medium text-indigo-900">About us</p>
            </div>
          </Link>
          <Link to="/shop/home">
            <div className="m-5 cursor-pointer rounded-lg bg-white p-16 text-center shadow-lg transition-shadow hover:shadow-2xl">
              <div className="mb-4 rounded-full bg-indigo-300 p-3 text-indigo-900">
                <Heart className="h-16 w-16" />
              </div>
              <p className="font-medium text-indigo-900">Pet essentials</p>
            </div>
          </Link>
        </div>

        <div className="mb-[15vh] mt-[20vh] text-center">
          <h2 className="mb-4 text-6xl font-semibold text-white">Who are waiting for You?</h2>
          <p className="mb-12 text-3xl text-white">If you want to know more about a pet, just click on its box.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-[7.5vh] md:grid-cols-3 lg:grid-cols-3">
          {pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))}
        </div>
      </div>

      <section className="relative z-20 mx-auto mt-60 max-w-7xl rounded-xl bg-white p-12 shadow-lg">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-center space-x-4">
            {['mission', 'values', 'approach'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`rounded-full px-6 py-3 transition ${
                  activeSection === section ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {activeSection === 'mission' && (
            <div className="text-center">
              <HandHelping className="mx-auto mb-6 text-red-500" size={64} />
              <h3 className="mb-6 text-3xl font-bold">Our Mission</h3>
              <p className="text-xl text-gray-700">
                To rescue, rehabilitate, and rehome stray and abandoned animals, ensuring they receive the love and
                care they deserve. We simplify the adoption process while promoting responsible pet ownership.
              </p>
            </div>
          )}

          {activeSection === 'values' && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-6 text-green-500" size={64} />
              <h3 className="mb-6 text-3xl font-bold">Our Core Values</h3>
              <ul className="space-y-4 text-xl text-gray-700">
                <li>Compassion for all living beings</li>
                <li>Commitment to animal welfare</li>
                <li>Transparency in our operations</li>
                <li>Community engagement and education</li>
              </ul>
            </div>
          )}

          {activeSection === 'approach' && (
            <div className="text-center">
              <Share2 className="mx-auto mb-6 text-blue-500" size={64} />
              <h3 className="mb-6 text-3xl font-bold">Our Approach</h3>
              <p className="text-xl text-gray-700">
                We collaborate with shelters, foster homes, and animal welfare organizations to find the perfect
                match between pets and adopters. Our comprehensive support ensures successful, lifelong connections.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="relative z-20 mt-40 py-16 text-center text-white">
        <h2 className="mb-6 text-4xl font-bold">Make a Difference Today</h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Whether you adopt, help rescue, or support daily care, your action creates lasting change in an animal&apos;s life.
        </p>
        <div className="space-x-4">
          <Link to="/search">
            <button className="rounded-full bg-white px-8 py-3 font-bold text-indigo-800 hover:bg-gray-100">
              Adopt Now
            </button>
          </Link>
          <Link to="/shop/home">
            <button className="rounded-full border-2 border-white px-8 py-3 font-bold hover:bg-white hover:text-red-500">
              Visit Store
            </button>
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        <div className="mt-40 h-20 bg-indigo-700"></div>
        <footer className="bg-indigo-900 py-8 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-indigo-200">Little Paws</h3>
                <ul className="space-y-2">
                  <li>Home</li>
                  <li>About</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-indigo-200">Services</h3>
                <ul className="space-y-2">
                  <li>Grooming</li>
                  <li>Publishing</li>
                  <li>Solutions</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-indigo-200">Events</h3>
                <ul className="space-y-2">
                  <li>CNW</li>
                  <li>Game Jams</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-indigo-300">Follow</h3>
                <ul className="space-y-2">
                  <li>Twitter</li>
                  <li>Facebook</li>
                  <li>Instagram</li>
                  <li>LinkedIn</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-indigo-600 pt-4 text-center text-sm">
              <p className="mb-2">Terms & Conditions | Privacy Policy | Sitemap</p>
              <p>© 2024 Little Paws. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landingpage;
