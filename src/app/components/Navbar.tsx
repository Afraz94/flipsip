"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOrders } from "@/hooks/useOrders";

export type User = {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
};

export type Order = {
  id: string;
  size: string;
  quantity: number;
  personalize?: string | null;
  createdAt: string; // ISO string
  status:
    | "PLACED"
    | "PACKED"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "FAILED_IN_TRANSIT"
    | "FAILED_DELIVERY";
  failedReason?: string | null;
};

export default function Navbar({
  user,
  onLoginClick,
  onLogout,
}: {
  user: User | null;
  orders?: Order[];
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  const { orders, loading, error, mutate } = useOrders();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const orderDropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown animation: mount for 200ms after closing
  useEffect(() => {
    if (menuOpen) setShowDropdown(true);
    else {
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

  // Click outside to close orders dropdown
  useEffect(() => {
    if (!showOrders) return;
    function handler(e: MouseEvent) {
      if (
        orderDropdownRef.current &&
        !orderDropdownRef.current.contains(e.target as Node)
      ) {
        setShowOrders(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showOrders]);

  function getFirstName(name: string = "") {
    return name.split(" ")[0];
  }

  function getFirstInitial(name: string = "") {
    return name.split(" ")[0][0]?.toUpperCase() || "";
  }

  function formatStatus(status: Order["status"], reason?: string | null) {
    switch (status) {
      case "PLACED":
        return <span className="text-yellow-400">Order placed</span>;
      case "PACKED":
        return <span className="text-blue-300">Packed</span>;
      case "IN_TRANSIT":
        return <span className="text-cyan-400">In transit</span>;
      case "DELIVERED":
        return <span className="text-green-400">Delivered</span>;
      case "FAILED_IN_TRANSIT":
        return (
          <span className="text-red-400">
            Failed in transit
            {reason && <span className="ml-2 text-white/60">({reason})</span>}
          </span>
        );
      case "FAILED_DELIVERY":
        return (
          <span className="text-red-400">
            Delivery failed
            {reason && <span className="ml-2 text-white/60">({reason})</span>}
          </span>
        );
      default:
        return null;
    }
  }

  // Order history dropdown UI
  function OrdersDropdown({ mobile = false }: { mobile?: boolean }) {
    return (
      <div
        ref={mobile ? undefined : orderDropdownRef}
        className={`${
          mobile
            ? "mt-2 w-full bg-blackish/95 border-2 border-neon rounded-2xl shadow-2xl"
            : "absolute right-0 top-16 mt-2 w-80 bg-blackish/95 border-2 border-neon rounded-2xl shadow-2xl z-50"
        } animate-fade-in`}
      >
        <div className="p-4 font-futuristic text-neon border-b border-neon text-lg">
          Your Orders
        </div>
        <div className="max-h-72 rounded-2xl overflow-y-auto bg-blackish/80">
          {orders && orders.length > 0 ? (
            orders.map((order: Order) => (
              <div
                key={order.id}
                className="px-4 py-2 border-b border-blackish/60 text-white text-sm hover:bg-neon/10 transition"
              >
                <div className="font-semibold text-neon">
                  {order.size} × {order.quantity}
                  {order.personalize ? (
                    <span className="ml-2 italic text-xs text-white/60">
                      {order.personalize}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs opacity-80">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="text-xs mt-1">
                  {formatStatus(order.status, order.failedReason)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-neon/80 font-futuristic">
              No orders placed yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <nav className="w-full z-30 flex items-center justify-between px-4 md:px-10 py-3 fixed top-0 left-0 bg-blackish/80 border-b-2 border-neon">
      {/* Neon Logo */}
      <a
        href="/"
        className="flex items-center gap-1 group focus:outline-none select-none"
        aria-label="FlipSip homepage"
      >
        <span
          className={`
    font-bold font-futuristic text-2xl md:text-3xl
    text-[#a786ff] drop-shadow-[0_0_16px_#a786ff99] neon-glow
    transition-all duration-200
    group-hover:text-white group-hover:drop-shadow-[0_0_24px_#bc6cff]
    group-active:scale-95
  `}
          style={{
            textShadow:
              "0 0 16px #bc6cff, 0 0 32px #9f77f844, 0 0 40px #bc6cff33, 0 0 1px #fff",
          }}
        >
          Flip
          <span className="text-white">Sip</span>
        </span>
      </a>

      {/* Desktop actions */}
      <div className="hidden sm:flex items-center gap-3 relative">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Avatar triggers order dropdown */}
            <button
              className="flex items-center gap-2 focus:outline-none bg-transparent border-none p-0 hover:cursor-pointer"
              onClick={() => setShowOrders((v) => !v)}
              aria-label="View orders"
              tabIndex={0}
              style={{ background: "none" }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-neon object-cover bg-black hover:cursor-pointer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full border-2 border-neon bg-black text-neon font-futuristic flex items-center justify-center text-xl uppercase neon-glow select-none">
                  {getFirstInitial(user.name)}
                </div>
              )}
              <span className="font-futuristic text-neon">
                {getFirstName(user.name)}
              </span>
            </button>
            {/* Show orders dropdown */}
            {showOrders && <OrdersDropdown />}
            <button
              className="ml-4 px-3 py-1 rounded bg-dark hover:cursor-pointer text-neon border border-neon font-futuristic hover:bg-neon hover:text-black transition"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-2 rounded-full border-2 hover:cursor-pointer border-neon bg-blackish text-neon font-futuristic hover:bg-neon hover:text-black transition"
            onClick={onLoginClick}
          >
            Login
          </button>
        )}
      </div>

      {/* Hamburger menu for mobile */}
      <button
        className="sm:hidden flex items-center px-2 py-2 relative -right-3 text-neon focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {/* Hamburger animated */}
        <div className="relative w-8 h-8 flex flex-col items-center justify-center">
          <span
            className={`
              absolute w-7 h-[2.5px] rounded bg-neon transition-all duration-200
              left-0
              ${menuOpen ? "rotate-45 top-3.5" : "top-2"}
            `}
          />
          <span
            className={`
              absolute w-7 h-[2.5px] rounded bg-neon transition-all duration-200
              left-0
              ${menuOpen ? "opacity-0" : "top-3.5"}
            `}
          />
          <span
            className={`
              absolute w-7 h-[2.5px] rounded bg-neon transition-all duration-200
              left-0
              ${menuOpen ? "-rotate-45 top-3.5" : "top-5"}
            `}
          />
        </div>
      </button>

      {/* Mobile Dropdown (animated in & out) */}
      {showDropdown && (
        <div
          className={`
            absolute top-full left-0 w-full bg-blackish/95 border-t-2 border-neon p-4 flex flex-col gap-4 sm:hidden z-40
            transition-all duration-200
            ${
              menuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-3 pointer-events-none"
            }
          `}
        >
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 justify-center">
                {/* Avatar triggers order dropdown */}
                <button
                  className="focus:outline-none"
                  onClick={() => setShowOrders((v) => !v)}
                  aria-label="View orders"
                  tabIndex={0}
                  style={{ background: "none" }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-neon object-cover bg-black"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-neon bg-black text-neon font-futuristic flex items-center justify-center text-base uppercase neon-glow select-none">
                      {getFirstInitial(user.name)}
                    </div>
                  )}
                </button>
                <span className="font-futuristic text-neon">
                  {getFirstName(user.name)}
                </span>
              </div>
              {/* Orders dropdown (mobile) */}
              {showOrders && <OrdersDropdown mobile />}
              <button
                className="w-full px-4 py-2 rounded bg-dark text-neon border border-neon font-futuristic hover:bg-neon hover:text-black transition"
                onClick={() => {
                  setMenuOpen(false);
                  setShowOrders(false);
                  setTimeout(onLogout, 200);
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="w-full px-4 py-2 rounded-full border-2 border-neon bg-blackish text-neon font-futuristic hover:bg-neon hover:text-black transition"
              onClick={() => {
                setMenuOpen(false);
                setTimeout(onLoginClick, 200);
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
