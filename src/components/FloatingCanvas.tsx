/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface CanvasElement {
  id: number;
  type: "maki" | "salmon" | "shrimp" | "chopstick" | "rice" | "leaf" | "ember";
  x: number;
  y: number;
  z: number; // depth: 0 is near, 1 is far
  size: number;
  rotation: number;
  angleSpeed: number;
  driftX: number;
  driftY: number;
  opacity: number;
  color?: string;
  hasShadow?: boolean;
}

export default function FloatingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<CanvasElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeElements();
    };

    const initializeElements = () => {
      const elCount = window.innerWidth < 768 ? 24 : 52;
      const arr: CanvasElement[] = [];

      // Add a couple of larger majestic elements (Maki, Salmon details)
      arr.push({
        id: 1,
        type: "maki",
        x: window.innerWidth * 0.15,
        y: window.innerHeight * 0.3,
        z: 0.1,
        size: 85,
        rotation: 0.3,
        angleSpeed: 0.003,
        driftX: 0.08,
        driftY: 0.04,
        opacity: 0.9,
      });

      arr.push({
        id: 2,
        type: "salmon",
        x: window.innerWidth * 0.8,
        y: window.innerHeight * 0.25,
        z: 0.15,
        size: 70,
        rotation: -0.4,
        angleSpeed: -0.002,
        driftX: -0.05,
        driftY: 0.05,
        opacity: 0.85,
      });

      arr.push({
        id: 3,
        type: "shrimp",
        x: window.innerWidth * 0.85,
        y: window.innerHeight * 0.75,
        z: 0.2,
        size: 65,
        rotation: 1.2,
        angleSpeed: 0.004,
        driftX: 0.06,
        driftY: -0.06,
        opacity: 0.9,
      });

      arr.push({
        id: 4,
        type: "chopstick",
        x: window.innerWidth * 0.3,
        y: window.innerHeight * 0.65,
        z: 0.4,
        size: 140,
        rotation: 2.1,
        angleSpeed: -0.001,
        driftX: -0.03,
        driftY: 0.02,
        opacity: 0.8,
      });

      // Add miscellaneous falling elements, rice grains, green tea leaves and red chilli embers
      for (let i = 5; i < elCount; i++) {
        const randSeed = Math.random();
        let type: CanvasElement["type"] = "rice";
        let size = 8;
        let color = "#FFFFFF";

        if (randSeed < 0.2) {
          type = "leaf";
          size = Math.random() * 20 + 15;
          color = "rgba(40, 110, 40, 0.45)"; // leaf green tint
        } else if (randSeed < 0.4) {
          type = "ember";
          size = Math.random() * 10 + 4;
          color = "rgba(211, 47, 47, 0.6)"; // Samurai Red chili spice
        } else if (randSeed < 0.6) {
          type = "maki";
          size = Math.random() * 20 + 20;
        } else if (randSeed < 0.75) {
          type = "salmon";
          size = Math.random() * 25 + 15;
        } else {
          type = "rice";
          size = Math.random() * 8 + 6;
        }

        arr.push({
          id: i,
          type,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random() * 0.8 + 0.1, // depth layering
          size,
          rotation: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.01,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.12,
          opacity: Math.random() * 0.4 + 0.3,
          color,
        });
      }

      elementsRef.current = arr;
    };

    // Draw high quality procedural vector representations of Asian foods on context
    const drawMaki = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      // Outer black roasted Nori wrapper
      c.fillStyle = "#121513";
      c.beginPath();
      c.ellipse(0, 0, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
      c.fill();

      // Golden border highlight
      c.strokeStyle = "#C9A227";
      c.lineWidth = 1;
      c.stroke();

      // Vinegared Koshihikari Rice layer
      c.fillStyle = "#F5F5F5";
      c.beginPath();
      c.ellipse(0, 0, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
      c.fill();

      // Tiny circular rice grains details
      c.fillStyle = "#EAEAEA";
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.ellipse(
          (Math.sin(i) * size) / 3,
          (Math.cos(i) * size) / 4,
          size * 0.07,
          size * 0.12,
          i * 0.8,
          0,
          Math.PI * 2
        );
        c.fill();
      }

      // Avocado centered core (Vibrant green-yellow gradient)
      const grad = c.createRadialGradient(0, 0, 1, 0, 0, size * 0.3);
      grad.addColorStop(0, "#D4E157"); // creamy yellow
      grad.addColorStop(0.6, "#7CB342"); // avocado medium
      grad.addColorStop(1, "#33691E"); // deep green skin outline
      c.fillStyle = grad;
      c.beginPath();
      c.arc(-size * 0.08, -size * 0.04, size * 0.15, 0, Math.PI * 2);
      c.fill();

      // Salmon pink succulent center
      c.fillStyle = "#FF7043"; // rich salmon coral red
      c.beginPath();
      c.ellipse(size * 0.08, size * 0.06, size * 0.16, size * 0.12, 0.4, 0, Math.PI * 2);
      c.fill();

      // Salmon fat lines (delicate clean white strokes)
      c.strokeStyle = "#FFFFFF";
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(size * 0.02, size * 0.0);
      c.lineTo(size * 0.15, size * 0.12);
      c.moveTo(size * 0.07, -size * 0.02);
      c.lineTo(size * 0.18, size * 0.08);
      c.stroke();

      c.restore();
    };

    const drawSalmonChunk = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      // Orange-red coral gradient
      const grad = c.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      grad.addColorStop(0, "#FF8A65");
      grad.addColorStop(1, "#D84315");
      c.fillStyle = grad;

      // Draw stylized sashimi slash cut polygon
      c.beginPath();
      c.moveTo(-size * 0.5, -size * 0.3);
      c.lineTo(size * 0.4, -size * 0.45);
      c.lineTo(size * 0.5, size * 0.25);
      c.lineTo(-size * 0.3, size * 0.35);
      c.closePath();
      c.fill();

      // Render the luxurious marble layers (distinct parallel curves of white fat)
      c.strokeStyle = "rgba(255, 255, 255, 0.75)";
      c.lineWidth = 1.8;
      c.beginPath();
      for (let offset = -0.3; offset <= 0.4; offset += 0.25) {
        c.moveTo(-size * 0.4, size * offset - size * 0.1);
        c.quadraticCurveTo(
          0,
          size * offset,
          size * 0.4,
          size * offset - size * 0.15
        );
      }
      c.stroke();

      c.restore();
    };

    const drawShrimp = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      // Draw curled tempura/nigiri shrimp tail
      const grad = c.createLinearGradient(-size * 0.4, 0, size * 0.4, size * 0.1);
      grad.addColorStop(0, "#FF8A65");
      grad.addColorStop(0.7, "#E64A19");
      grad.addColorStop(1, "#BF360C"); // deep scorched lobster hue
      c.fillStyle = grad;

      c.beginPath();
      c.moveTo(-size * 0.45, -size * 0.2);
      c.quadraticCurveTo(size * 0.1, -size * 0.5, size * 0.4, -size * 0.1);
      c.quadraticCurveTo(size * 0.25, size * 0.3, -size * 0.1, size * 0.2);
      c.quadraticCurveTo(-size * 0.35, size * 0.15, -size * 0.45, -size * 0.2);
      c.fill();

      // Tail fins
      c.fillStyle = "#FF3D00";
      c.beginPath();
      c.moveTo(-size * 0.45, -size * 0.2);
      c.lineTo(-size * 0.65, -size * 0.35);
      c.lineTo(-size * 0.6, -size * 0.15);
      c.lineTo(-size * 0.7, -size * 0.05);
      c.closePath();
      c.fill();

      // Golden toasted panko shell accents for premium fusion look
      c.strokeStyle = "rgba(201, 162, 39, 0.6)";
      c.lineWidth = 1.5;
      c.stroke();

      c.restore();
    };

    const drawChopsticks = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      // Dark ebony wooden chopsticks
      c.fillStyle = "#2D1D10";

      // Chopstick 1
      c.beginPath();
      c.moveTo(-size * 0.5, -3);
      c.lineTo(size * 0.5, -4);
      c.lineTo(size * 0.5, -1);
      c.lineTo(-size * 0.5, -1);
      c.closePath();
      c.fill();

      // Chopstick 2 (slightly crossed)
      c.fillStyle = "#3E2723";
      c.rotate(0.12);
      c.beginPath();
      c.moveTo(-size * 0.5, 3);
      c.lineTo(size * 0.5, 5);
      c.lineTo(size * 0.5, 8);
      c.lineTo(-size * 0.5, 4);
      c.closePath();
      c.fill();

      // Gold tip sleeves for luxurious branding
      c.fillStyle = "#C9A227";
      c.beginPath();
      c.rect(size * 0.35, -4, size * 0.15, 3);
      c.rect(size * 0.35, 5, size * 0.15, 3);
      c.fill();

      c.restore();
    };

    const drawRiceGrain = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      const grad = c.createRadialGradient(0, 0, 1, 0, 0, size);
      grad.addColorStop(0, "#FFFFFF");
      grad.addColorStop(0.8, "#F2F4F3");
      grad.addColorStop(1, "#D0D5D3");
      c.fillStyle = grad;
      c.beginPath();
      c.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const drawMintLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      c.fillStyle = "rgba(76, 175, 80, 0.4)";
      c.beginPath();
      c.ellipse(0, 0, size, size * 0.4, 0.4, 0, Math.PI * 2);
      c.fill();

      // Leaf veins
      c.strokeStyle = "rgba(255, 255, 255, 0.25)";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(-size, 0);
      c.lineTo(size, 0);
      c.stroke();
      c.restore();
    };

    const drawEmber = (c: CanvasRenderingContext2D, size: number) => {
      c.save();
      // Glowing organic particle
      const grad = c.createRadialGradient(0, 0, 1, 0, 0, size);
      grad.addColorStop(0, "rgba(211, 47, 47, 0.9)");
      grad.addColorStop(0.5, "rgba(201, 162, 39, 0.5)");
      grad.addColorStop(1, "rgba(211, 47, 47, 0)");
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth interpolation for mouse position controls (Easing lag for luxury float vibe)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth scroll tracking
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.08;

      elementsRef.current.forEach((el) => {
        // Apply passive physics-based drifting
        el.x += el.driftX;
        el.y += el.driftY;
        el.rotation += el.angleSpeed;

        // Wrap boundaries inside viewport comfortably
        if (el.x < -el.size * 2) el.x = canvas.width + el.size;
        if (el.x > canvas.width + el.size * 2) el.x = -el.size;
        if (el.y < -el.size * 2) el.y = canvas.height + el.size;
        if (el.y > canvas.height + el.size * 2) el.y = -el.size;

        // Mouse attraction/repulsion based on item proximity
        const dx = mouseRef.current.x - el.x;
        const dy = mouseRef.current.y - el.y;
        const dist = Math.hypot(dx, dy);
        const influenceRadius = 250;

        let offsetX = 0;
        let offsetY = 0;

        if (dist < influenceRadius) {
          const force = (influenceRadius - dist) / influenceRadius;
          // Subtly push elements away relative to depth layer (Farther is less affected)
          const multiplier = (1.1 - el.z) * 15;
          offsetX = -(dx / dist) * force * multiplier;
          offsetY = -(dy / dist) * force * multiplier;
        }

        // Apply scroll offsets (creating amazing layered absolute 3D parallax depth views)
        const scrollOffset = scrollRef.current.current * (2.8 - el.z * 1.8);

        ctx.save();

        // Layer depth control: blur background elements slightly to simulate Depth of Field
        const blurValue = Math.max(0, (el.z - 0.25) * 5.5);
        if (blurValue > 0.8) {
          ctx.filter = `blur(${blurValue.toFixed(1)}px)`;
        }

        // Apply matrix shifts and draw
        ctx.translate(el.x + offsetX, el.y + offsetY - (scrollOffset % (canvas.height + el.size * 4)));
        ctx.rotate(el.rotation);

        // Render soft drop-shadow for closer floating entities
        if (el.z < 0.4) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
          ctx.shadowBlur = (1 - el.z) * 18;
          ctx.shadowOffsetX = (1 - el.z) * 10;
          ctx.shadowOffsetY = (1 - el.z) * 15;
        }

        switch (el.type) {
          case "maki":
            drawMaki(ctx, el.size);
            break;
          case "salmon":
            drawSalmonChunk(ctx, el.size);
            break;
          case "shrimp":
            drawShrimp(ctx, el.size);
            break;
          case "chopstick":
            drawChopsticks(ctx, el.size);
            break;
          case "rice":
            drawRiceGrain(ctx, el.size * (1.2 - el.z));
            break;
          case "leaf":
            drawMintLeaf(ctx, el.size * (1.2 - el.z));
            break;
          case "ember":
            drawEmber(ctx, el.size * (1.3 - el.z));
            break;
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    resizeCanvas();
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 block transition-opacity duration-700"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
