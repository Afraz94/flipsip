// ToastModal.tsx
import React from "react";

export default function ToastModal({
  open,
  type,
  message,
  onClose,
}: {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      style={{ backdropFilter: "blur(1px)" }}
    >
      <div
        className="
        flex flex-col gap-4 items-center px-8 py-6
        rounded-2xl shadow-neon border-2 border-neon bg-blackish
       animate-slidein
      "
      >
        <span className="text-2xl font-bold font-futuristic neon-glow text-neon">
          {type === "success" ? "Success!" : "Error"}
        </span>
        <p className="text-white font-futuristic text-lg text-center">
          {message}
        </p>
        <button
          className="px-6 py-2 rounded-full border-2 font-futuristic mt-2 border-neon bg-neon text-black
            hover:scale-105 transition-all hover:cursor-pointer"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
