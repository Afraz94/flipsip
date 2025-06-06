"use client";

import React, { useState, useEffect } from "react";
import type { User } from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ToastModal from "./ToastModal";

export default function OrderModal({
  open,
  onClose,
  user,
  onUpdatePhone,
}: {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdatePhone: (newPhone: string) => Promise<void>; // Callback to update DB
}) {
  const [showModal, setShowModal] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  // Persisted fields
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  // Other fields (reset after order)
  const [altPhone, setAltPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [personalize, setPersonalize] = useState("");
  const [size, setSize] = useState("1L");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMsg, setToastMsg] = useState("");
  // Country always India, disabled
  const country = "India";

  // Slide in/out
  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setPanelVisible(true), 10);
    } else {
      setPanelVisible(false);
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      // Prevent background scroll
      document.body.style.overflow = "hidden";
      // On iOS, also consider position: fixed for rare issues
      document.body.style.position = "relative";
      window.scrollTo(0, 0); // Optional: Prevent jump
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
    };
  }, [open]);

  // Prefill name/email/phone if user changes (for SWR or session updates)
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const isValid =
    !!fullName &&
    !!email &&
    !!phone &&
    !!address1 &&
    !!city &&
    !!state &&
    !!pincode &&
    !!size &&
    !!quantity;

  // Whenever phone changes, update in SQL DB
  useEffect(() => {
    if (phone && phone !== user.phone) {
      onUpdatePhone(phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  // Reset only non-persistent fields
  function resetForm() {
    setAltPhone("");
    setAddress1("");
    setAddress2("");
    setLandmark("");
    setCity("");
    setState("");
    setPincode("");
    setDeliveryTime("");
    setSpecialInstructions("");
    setGiftMessage("");
    setPromoCode("");
    setPersonalize("");
    setSize("1L");
    setQuantity(1);
    // Do NOT reset fullName, email, phone
  }

  async function handleOrder() {
    if (!isValid || loading) return;
    setLoading(true);

    const orderData = {
      fullName,
      email,
      phone,
      altPhone,
      address1,
      address2,
      landmark,
      city,
      state,
      pincode,
      country,
      deliveryTime,
      specialInstructions,
      giftMessage,
      promoCode,
      personalize,
      size,
      quantity,
    };

    // Save order to database
    let orderResp, orderResult;
    try {
      orderResp = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      orderResult = await orderResp.json();
      if (!orderResp.ok) throw new Error(orderResult.error || "Order DB error");
    } catch (err) {
      setLoading(false);
      setToastType("error");
      setToastMsg("Could not save order. Try again.");
      setToastOpen(true);
      console.error("Order DB error:", err);
      return;
    }

    // Generate WhatsApp links
    let waResp, waResult;
    try {
      waResp = await fetch("/api/send-whatsapp-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      waResult = await waResp.json();
      if (!waResp.ok) throw new Error(waResult.error || "WhatsApp link error");
    } catch (err) {
      setLoading(false);
      setToastType("error");
      setToastMsg("Could not generate WhatsApp link. Try again.");
      setToastOpen(true);
      console.error("WhatsApp API error:", err);
      return;
    }

    setLoading(false);

    // Redirect user to WhatsApp (most reliable)
    if (Array.isArray(waResult?.links) && waResult.links.length) {
      resetForm();
      onClose();
      window.location.href = waResult.links[0];
      return;
    } else {
      setToastType("error");
      setToastMsg("Order failed. Please try again.");
      setToastOpen(true);
    }
  }

  if (!user || !showModal) return null;

  return (
    <div
      className={`
        fixed inset-0 z-40 flex items-start justify-end transition-all duration-300
        bg-black/60
      `}
      style={{ backdropFilter: "blur(2px)" }}
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className={`
    h-full max-h-screen flex flex-col gap-4 bg-blackish border-l-4 border-neon shadow-neon overflow-y-auto
    fixed right-0 top-0
    w-[90vw] max-w-lg sm:w-[80vw] md:w-[520px]
    min-h-screen
    px-3 py-4 md:p-8
    rounded-none sm:rounded-l-2xl
    transition-all duration-300
    ${
      panelVisible
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0 pointer-events-none"
    }
  `}
        style={{
          boxShadow: "0 0 64px 0 #bc6cff44, 0 2px 32px #12121266",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <button
          className="self-end text-neon text-2xl hover:cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="neon-outward-glow text-neon text-2xl"
          />
        </button>
        <h2 className="text-neon font-futuristic text-2xl neon-glow mb-2">
          Place Your FlipSip Order
        </h2>

        <label className="text-white">Full Name</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label className="text-white">Email</label>
        <input
          type="email"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="text-white">Phone</label>
        <div className="flex items-center gap-2">
          <div className="flex items-center px-2 py-2 bg-dark border border-neon rounded text-neon select-none cursor-not-allowed">
            <img
              src="https://hatscripts.github.io/circle-flags/flags/in.svg"
              alt="India flag"
              className="inline-block mr-1 w-3 h-3 rounded shadow"
              style={{ minWidth: 24, minHeight: 24 }}
            />
            <span className="text-white">+91</span>
          </div>
          <input
            type="tel"
            className="flex-1 p-2 rounded bg-dark border border-neon text-white glow-focus"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            required
            pattern="[0-9]{10}"
            maxLength={10}
            minLength={10}
            placeholder="Enter 10-digit number"
            style={{ width: "100%" }}
          />
        </div>

        <label className="text-white">Address Line 1</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          required
        />
        <label className="text-white">Address Line 2 (optional)</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
        <label className="text-white">Landmark (optional)</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />
        <label className="text-white">City</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label className="text-white">State</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label className="text-white">Pincode</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
          required
          maxLength={6}
          minLength={6}
          placeholder="Enter 6-digit pincode"
        />

        <label className="text-white">Country</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white cursor-not-allowed select-none"
          value={country}
          disabled
        />

        <label className="text-white">Preferred Delivery Time (optional)</label>
        <input
          type="text"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />

        <label className="text-white">Special Instructions (optional)</label>
        <textarea
          className="p-2 rounded bg-dark border border-neon text-white min-h-[80px] glow-focus"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          rows={4}
        />

        <label className="text-white">Gift Message (optional)</label>
        <textarea
          className="p-2 rounded bg-dark border border-neon text-white min-h-[60px] glow-focus"
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value)}
          rows={2}
        />

        <hr className="my-2 border-neon opacity-40" />

        <label className="text-white">Bottle Size</label>
        <select
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        >
          <option>1L</option>
          <option>750ml</option>
          <option>500ml</option>
        </select>
        <label className="text-white">Quantity</label>
        <input
          type="number"
          min={1}
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />

        <label className="text-white">Personalization (optional)</label>
        <input
          type="text"
          placeholder="Personalize your bottle"
          className="p-2 rounded bg-dark border border-neon text-white glow-focus"
          value={personalize}
          onChange={(e) => setPersonalize(e.target.value)}
        />

        <button
          className={`mt-6 px-6 py-3 rounded-full border-2 border-neon bg-neon text-black font-futuristic text-lg shadow-neon transition-all ${
            !isValid || loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:scale-105 hover:cursor-pointer"
          }`}
          disabled={!isValid || loading}
          onClick={handleOrder}
        >
          {loading ? "Placing Order..." : "Place Order via WhatsApp"}
        </button>
      </div>
      <ToastModal
        open={toastOpen}
        type={toastType}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
