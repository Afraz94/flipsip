import React, { useState } from "react";
import type { User } from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";

export default function LoginModal({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}) {
  const [loading, setLoading] = useState(false);

  function handleGoogleLogin() {
    setLoading(true);
    setTimeout(() => {
      // Simulated "Google" user, no avatar (shows initials)
      const user: User = {
        name: "User",
        avatar: "",
        email: "",
      };
      onLogin(user);
      setLoading(false);
    }, 900);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-blackish border-2 border-neon rounded-xl p-8 w-full max-w-sm relative shadow-neon animate-fadein">
        <button
          className="absolute top-2 right-3 text-neon text-2xl hover:text-pink-400 hover:cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>
        <h2 className="text-neon  font-futuristic text-2xl neon-glow mb-6 text-center">
          Login
        </h2>
        <button
          className="w-full mt-2 py-3 rounded-full bg-neon text-black font-futuristic text-lg neon-glow hover:scale-105 hover:cursor-pointer transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-neon"
          onClick={() => {
            signIn("google");
          }}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faGoogle} className="text-xl" />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
        <button
          className="w-full mt-4 py-2 hover:cursor-pointer rounded text-neon font-futuristic border border-neon hover:bg-neon hover:text-black transition"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
