/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface InkSplatter {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

export default function HeroIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<"blank" | "ink" | "kanji" | "explode" | "fade">("blank");
  const particlesRef = useRef<Particle[]>([]);
  const inkRef = useRef<InkSplatter[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Timeline durations
    setTimeout(() => setStage("ink"), 300);
    setTimeout(() => setStage("kanji"), 1200);
    setTimeout(() => setStage("explode"), 2500);
    setTimeout(() => setStage("fade"), 3805);
    setTimeout(() => {
      onComplete();
    }, 4500);

    // Seed dynamic ink drops in center
    inkRef.current.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 30,
      radius: 0,
      maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.28,
      speed: 3
    });

    const spawnExplosion = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          radius: Math.random() * 3 + 1,
          color: Math.random() > 0.3 ? "#D32F2F" : "#C9A227",
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }
    };

    let triggerExplode = false;

    const render = () => {
      // Clear with dark charcoal ink texture color
      ctx.fillStyle = "rgba(11, 11, 11, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Draw Japanese Ink Splatter Blossoming (Water bleed effect)
      inkRef.current.forEach((spl) => {
        if (spl.radius < spl.maxRadius) {
          spl.radius += spl.speed;
        }

        // Draw organic fluid-distorted ink circle
        ctx.save();
        ctx.fillStyle = "rgba(22, 22, 22, 0.95)";
        ctx.shadowColor = "#D32F2F";
        ctx.shadowBlur = 40;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const r = spl.radius + Math.sin(a * 8) * (spl.radius * 0.15); // wavy organic edge
          const px = spl.x + Math.sin(a) * r;
          const py = spl.y + Math.cos(a) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw brush painted Kanji for Samurai "侍"
      if (stage === "kanji" || stage === "explode" || stage === "fade") {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw background brushed stamp
        ctx.font = "bold 150px sans-serif";
        ctx.fillStyle = "rgba(211, 47, 47, 0.08)";
        ctx.fillText("侍", centerX, centerY - 20);

        // Main brush text gradient
        ctx.font = "bold 130px 'Times New Roman', Baskerville, serif";
        const grad = ctx.createLinearGradient(centerX, centerY - 100, centerX, centerY + 80);
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.5, "#CCCCCC");
        grad.addColorStop(1, "#333333");

        ctx.fillStyle = grad;
        ctx.shadowColor = "#C9A227";
        ctx.shadowBlur = stage === "explode" ? 30 : 10;
        ctx.fillText("侍", centerX, centerY - 20);

        ctx.restore();
      }

      // 3. Trigger Particle Explosion
      if (stage === "explode") {
        if (!triggerExplode) {
          spawnExplosion();
          triggerExplode = true;
        }

        particlesRef.current.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // mild gravity
          p.alpha -= p.decay;

          ctx.save();
          ctx.shadowBlur = p.radius * 3;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.alpha <= 0) {
            particlesRef.current.splice(idx, 1);
          }
        });
      }

      // 4. Subtle lighting beam
      ctx.save();
      const lightGrad = ctx.createRadialGradient(
        centerX, centerY - 50, 10,
        centerX, centerY - 50, Math.min(canvas.width, canvas.height) * 0.5
      );
      lightGrad.addColorStop(0, "rgba(201, 162, 39, 0.15)");
      lightGrad.addColorStop(0.5, "rgba(211, 47, 47, 0.04)");
      lightGrad.addColorStop(1, "rgba(11, 11, 11, 0)");
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [stage]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-all duration-[1000ms] ${
        stage === "fade" ? "opacity-0 translate-y-[-10%] scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Embedded High end Branding Overlay */}
      <div className="absolute bottom-16 flex flex-col items-center z-50 select-none text-center px-4">
        <h3 className="font-sans text-[11px] tracking-[0.35em] text-[#C9A227] font-semibold uppercase animate-pulse">
          CRAFTED BY SAMURAI TOKYO
        </h3>
        <p className="font-mono text-[9px] text-[#888888] mt-2 tracking-widest uppercase">
          Gastronomic Heritage
        </p>

        {/* Loading Indicator */}
        <div className="w-48 h-[2px] bg-white/10 mt-6 rounded-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 bg-[#D32F2F] animate-[loadingBar_4s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
