"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import OrderModal from "./components/OrderModal";
import { signIn, signOut, useSession } from "next-auth/react";
import { useUser } from "@/hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faLeaf,
  faBolt,
  faFillDrip,
  faRecycle,
  faLock,
  faThermometerHalf,
  faSignature,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const features = [
  {
    title: "NeonTech™ Glow",
    icon: faBolt,
    desc: "Ultra-vibrant night-glow shell. Your bottle turns heads even in the dark.",
    color: "text-pink-400",
  },
  {
    title: "PureShield™ Tritan",
    icon: faFillDrip,
    desc: "Zero-odor, BPA-free, tough-as-steel. Unmatched taste, unbreakable style.",
    color: "text-cyan-300",
  },
  {
    title: "Eco-Smart Impact",
    icon: faRecycle,
    desc: "Every bottle = 20 fewer plastics in the ocean. 100% eco-forward.",
    color: "text-green-300",
  },
];

export default function Home() {
  const isMobile = useIsMobile();
  const [showLogin, setShowLogin] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const { data: session, status } = useSession();
  const { user, loading: userLoading, mutate: refreshUser } = useUser();

  async function handlePhoneUpdate(newPhone: String) {
    if (!user?.email) return; // Email required for update
    try {
      const res = await fetch("/api/update-user-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          phone: newPhone,
        }),
      });
      if (!res.ok) throw new Error("Failed to update phone");
      // Optionally: refresh user from DB if needed
      refreshUser();
    } catch (err) {
      console.error("Error updating phone:", err);
    }
  }

  function useIsMobile(breakpoint = 640) {
    // Tailwind 'sm' breakpoint
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      function check() {
        setIsMobile(window.innerWidth < breakpoint);
      }
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
  }

  function handleShopNow() {
    if (!session) {
      setShowLogin(true);
    } else {
      setShowOrder(true);
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blackish via-flipsip to-dark pt-20">
      {/* Neon blobs for atmosphere */}
      <div className="fixed -z-10 inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/6 w-[380px] h-[320px] bg-neon opacity-15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute right-1/6 bottom-1/5 w-[250px] h-[200px] bg-neon opacity-10 blur-[80px] rounded-full" />
        <div className="absolute right-16 top-16 w-[80px] h-[80px] bg-neon opacity-40 blur-[24px] rounded-full animate-pulse" />
      </div>
      {/* Watermark Bottle Background */}
      <div className="fixed inset-0 mt-48 flex items-center scale-[5] justify-center pointer-events-none select-none">
        <img
          src="/images/bottle.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain rotate-45 opacity-10 brightness-125"
        />
      </div>

      {/* Navbar */}
      <Navbar
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => signOut()}
      />

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center mt-10.5">
        <h1 className="text-5xl md:text-7xl font-futuristic text-flipsip neon-glow text-center drop-shadow-lg select-none">
          Flip<span className="text-white">Sip</span>
        </h1>
        {user && (
          <div className="mt-6 text-lg text-neon neon-glow">
            Welcome, {user.name?.split(" ")[0] || user.email?.split("@")[0]}!
          </div>
        )}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleShopNow();
          }}
          className="mt-8 -mb-6 px-10 py-3 rounded-full border-2 border-neon bg-blackish text-neon font-futuristic text-2xl transition-all duration-300 hover:bg-neon hover:cursor-pointer hover:text-black hover:scale-105 hover:shadow-[0_0_64px_12px_#bc6cff]"
        >
          Shop Now
        </a>
      </section>

      {/* Features */}
      <section
        id="shop"
        className="w-full max-w-5xl mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="bg-blackish rounded-2xl p-8 text-center border-2 border-neon hover:scale-105 hover:cursor-pointer hover:shadow-neon transition-all duration-300 group relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={
              isMobile
                ? { duration: 0.2, type: "tween", delay: 0 }
                : { duration: 0.6, delay: i * 0.12, type: "spring" }
            }
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center mb-4">
              <FontAwesomeIcon
                icon={f.icon}
                className={`text-4xl drop-shadow-lg neon-icon ${f.color}`}
              />
            </div>
            <h2
              className={`text-neon text-xl font-futuristic mb-2 neon-glow group-hover:scale-110 group-hover:text-white transition-all duration-300`}
            >
              {f.title}
            </h2>
            <p className="text-purple-200">{f.desc}</p>
            {/* Shimmer effect */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent animate-shimmer opacity-50"></span>
          </motion.div>
        ))}
      </section>

      {/* Bottle Information Section */}
      <section className="max-w-3xl w-full mt-16 p-8 rounded-2xl bg-blackish/90 border-2 border-neon text-lg relative overflow-hidden">
        <motion.h2
          className="font-futuristic text-3xl text-neon neon-glow mb-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why FlipSip Is the Ultimate Bottle
        </motion.h2>
        <ul className="list-none space-y-4 text-purple-300 font-medium">
          <li className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faThermometerHalf}
              className="text-cyan-400 neon-icon"
            />
            <span>
              24hr Cold/12hr Hot: Double-walled insulation locks in temperature.
            </span>
          </li>
          <li className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faLeaf}
              className="text-green-400 neon-icon"
            />
            <span>100% BPA-Free, non-toxic, vegan-friendly & sustainable.</span>
          </li>
          <li className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faLock}
              className="text-yellow-300 neon-icon"
            />
            <span>Spill-proof SnapCap™ lid with one-hand open and lock.</span>
          </li>
          <li className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faSignature}
              className="text-pink-400 neon-icon"
            />
            <span>Personalize your bottle: Laser-etch your name or logo.</span>
          </li>
          <li className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-neon neon-icon"
            />
            <span>
              Designed & Made in India. Ships pan-India in eco-packaging.
            </span>
          </li>
        </ul>
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon opacity-10 blur-[60px] rounded-full pointer-events-none" />
      </section>

      <footer className="mt-24 mb-4 text-center text-purple-300 font-futuristic text-sm opacity-70 neon-glow">
        &copy; {new Date().getFullYear()} FlipSip. All rights reserved.
      </footer>

      {/* Modals */}
      <OrderModal
        open={showOrder && !!user}
        onClose={() => setShowOrder(false)}
        user={user}
        onUpdatePhone={handlePhoneUpdate}
      />
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        // You can optionally pass onLogin if your modal needs it for custom flows
        onLogin={() => {
          setShowLogin(false);
          setShowOrder(true);
        }}
      />
    </main>
  );
}
