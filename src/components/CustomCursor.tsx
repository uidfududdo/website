/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [hoverType, setHoverType] = useState<"default" | "hover" | "magnetic" | "view" | "add">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);

      // Mouse trails
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Math.random() }];
        if (newTrail.length > 8) {
          newTrail.shift();
        }
        return newTrail;
      });

      // Query hovering element classes to dynamic-shape the pointer
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactable = target.closest("button, a, [role='button'], input, select");
      const isCard = target.closest(".dish-premium-card");
      const isCart = target.closest(".cart-trigger");

      if (isCart) {
        setHoverType("add");
      } else if (isCard) {
        setHoverType("view");
      } else if (interactable) {
        setHoverType("hover");
      } else {
        setHoverType("default");
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", updatePosition);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  const cursorStyles: Record<typeof hoverType, string> = {
    default: "w-4 h-4 bg-red-600/80 border border-[#C9A227]/30 ring-2 ring-red-600/10",
    hover: "w-10 h-10 bg-transparent border-2 border-[#C9A227] scale-125 ring-4 ring-red-600/20",
    magnetic: "w-12 h-12 bg-transparent border-2 border-red-500 scale-150 rotate-45",
    view: "w-16 h-16 bg-red-950/90 border border-[#C9A227] flex items-center justify-center text-[10px] tracking-widest text-[#C9A227] font-mono shadow-2xl",
    add: "w-14 h-14 bg-[#C9A227] border border-black flex items-center justify-center text-[10px] tracking-wider text-black font-semibold uppercase font-sans scale-110 shadow-lg"
  };

  return (
    <>
      {/* Laser-guided trail elements */}
      {trail.map((t, idx) => (
        <div
          key={t.id}
          className="fixed pointer-events-none rounded-full bg-red-500/20 mix-blend-screen transition-opacity duration-300 z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            width: `${(idx + 1) * 2}px`,
            height: `${(idx + 1) * 2}px`,
            opacity: idx / 10,
          }}
        />
      ))}

      {/* Main cursor sphere */}
      <div
        className={`fixed pointer-events-none rounded-full transition-transform duration-200 ease-out z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden sm:flex items-center justify-center ${cursorStyles[hoverType]}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {hoverType === "view" && <span className="animate-pulse">VIEW</span>}
        {hoverType === "add" && <span className="text-[9px] font-bold">+CART</span>}
      </div>
    </>
  );
}
