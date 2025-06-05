"use client";

import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blackish via-flipsip to-dark pt-20">
      {/* Neon blobs for atmosphere */}
      <div className="fixed -z-10 inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/6 w-[380px] h-[320px] bg-neon opacity-15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute right-1/6 bottom-1/5 w-[250px] h-[200px] bg-neon opacity-10 blur-[80px] rounded-full" />
        <div className="absolute right-16 top-16 w-[80px] h-[80px] bg-neon opacity-40 blur-[24px] rounded-full animate-pulse" />
      </div>

      {/* Bottle Watermark */}
      <div className="fixed inset-0 mt-48 flex items-center scale-[5] justify-center pointer-events-none select-none">
        <img
          src="/images/bottle.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain rotate-45 opacity-10 brightness-125"
        />
      </div>

      {/* Navbar */}
      <Navbar user={null} onLoginClick={() => {}} onLogout={() => {}} />

      <section className="flex flex-col items-center justify-center mt-24 mb-16 gap-8">
        <FontAwesomeIcon
          icon={faGhost}
          className="text-neon neon-glow text-7xl md:text-9xl drop-shadow-lg mb-4 animate-bounce"
        />
        <h1 className="text-flipsip neon-glow text-4xl md:text-6xl font-futuristic text-center drop-shadow-lg select-none">
          404 – Page Not Found
        </h1>
        <p className="text-purple-200 text-lg md:text-2xl text-center mb-2 max-w-xl">
          Oops! The page you're looking for does not exist.
          <br />
          Maybe you took a wrong sip? 🥤
        </p>
        <a
          href="/"
          className="mt-2 px-8 py-3 rounded-full border-2 border-neon bg-blackish text-neon font-futuristic text-xl transition-all duration-300 hover:bg-neon hover:text-black hover:scale-105 hover:shadow-[0_0_48px_8px_#bc6cff]"
        >
          Go to Homepage
        </a>
      </section>

      <footer className="mb-6 text-center text-purple-300 font-futuristic text-sm opacity-70 neon-glow">
        &copy; {new Date().getFullYear()} FlipSip. All rights reserved.
      </footer>
    </main>
  );
}
