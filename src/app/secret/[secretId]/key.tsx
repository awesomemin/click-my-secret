'use client';

import KeyImage from '@/../public/key.png';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

class Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  opacity: number;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.x = Math.random() * 50 + 125;
    this.y = Math.random() * 50 + 50;
    this.dx = Math.random() * 6 - 3;
    this.dy = Math.random() * 6 - 3;
    this.opacity = 0;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(
      0,
      1 - this.opacity / 100
    )})`;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.quadraticCurveTo(this.x, this.y, this.x - 5, this.y);
    this.ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + 5);
    this.ctx.quadraticCurveTo(this.x, this.y, this.x + 5, this.y);
    this.ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - 5);
    this.ctx.fill();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity += 3;
  }
}

export default function Key({ secretId }: { secretId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctxRef.current = canvas.getContext('2d');
    if (!ctxRef.current) return;

    let animationFrameId: number;

    const draw = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.draw();
        particle.move();
      });

      particlesRef.current = particlesRef.current.filter(
        (particle) => particle.opacity < 100
      );

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  async function handleKeyClick() {
    if (!ctxRef.current) return;

    particlesRef.current.push(new Particle(ctxRef.current));
    forceRender((prev) => prev + 1);

    const response = await fetch(`/api/click?secretId=${secretId}`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error);
      return;
    }
    if (data?.redirectUrl) {
      window.localStorage.setItem('callbackUrl', pathname);
      router.push(data.redirectUrl);
    }
  }

  return (
    <div className="h-24 my-5 mx-auto flex items-center justify-center">
      <canvas className="absolute" ref={canvasRef} />
      <Image
        onClick={handleKeyClick}
        src={KeyImage}
        alt="image of a key"
        className="z-10 w-24 h-24 mx-auto transition-all duration-75 active:scale-95"
      />
    </div>
  );
}
