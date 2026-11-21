import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function BackgroundSparkles({ lanternTrigger, emojiFountainTrigger, currentStage = 1 }) {
  const ambientCanvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);
  const lanternsRef = useRef([]);

  // Emoji Fountain Burst on celebration trigger
  useEffect(() => {
    if (emojiFountainTrigger > 0) {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [emojiFountainTrigger]);

  // Spawn lanterns when trigger changes
  useEffect(() => {
    if (lanternTrigger > 0) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          if (ambientCanvasRef.current) {
            const width = ambientCanvasRef.current.width;
            const height = ambientCanvasRef.current.height;
            lanternsRef.current.push({
              x: Math.random() * (width - 120) + 60,
              y: height + 40,
              size: Math.random() * 16 + 24,
              speedY: -(Math.random() * 1.5 + 1.2),
              sway: Math.random() * 2,
              swaySpeed: Math.random() * 0.03 + 0.02,
              time: Math.random() * 100
            });
          }
        }, i * 220);
      }
    }
  }, [lanternTrigger]);

  // Ambient Canvas Animation (Romantic soft petals and hearts on daytime stages)
  useEffect(() => {
    if (currentStage >= 4) return; // Stages 4 and 5 have their own dedicated romantic Night Skies!

    const canvas = ambientCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 20), 45);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.5 + 0.25,
        isHeart: Math.random() > 0.6,
        isPetal: Math.random() > 0.7
      });
    }

    const drawHeart = (c, x, y, size, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = '#ff4d8d';
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      c.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      c.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
      c.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      c.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c, x, y, size, alpha) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = '#f472b6';
      c.beginPath();
      c.ellipse(x, y, size * 1.8, size * 0.9, Math.PI / 4, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const drawLantern = (c, l) => {
      c.save();
      const glow = c.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.size * 1.8);
      glow.addColorStop(0, 'rgba(255, 180, 50, 0.85)');
      glow.addColorStop(0.5, 'rgba(255, 90, 0, 0.35)');
      glow.addColorStop(1, 'rgba(255, 90, 0, 0)');
      c.fillStyle = glow;
      c.beginPath();
      c.arc(l.x, l.y, l.size * 1.8, 0, Math.PI * 2);
      c.fill();

      // Body
      c.fillStyle = '#ff9900';
      c.beginPath();
      c.roundRect(l.x - l.size * 0.4, l.y - l.size * 0.5, l.size * 0.8, l.size, 6);
      c.fill();

      // Inner Flame
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(l.x, l.y + l.size * 0.15, l.size * 0.15, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -15) {
          p.y = canvas.height + 15;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size * 3.5, p.alpha);
        } else if (p.isPetal) {
          drawPetal(ctx, p.x, p.y, p.size * 2, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Render Lanterns
      for (let i = lanternsRef.current.length - 1; i >= 0; i--) {
        const l = lanternsRef.current[i];
        l.time += l.swaySpeed;
        l.x += Math.sin(l.time) * l.sway;
        l.y += l.speedY;
        drawLantern(ctx, l);
        if (l.y < -80) {
          lanternsRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentStage]);

  // Cursor Sparkle Trail Engine (Light Pink & Gold Star Dust)
  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const addSparkles = (x, y) => {
      const colors = currentStage === 3 
        ? ['#ffd700', '#38bdf8', '#ffffff', '#ff77aa', '#fde047']
        : ['#ff3377', '#f59e0b', '#f472b6', '#ec4899', '#ffffff'];
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 14,
          size: Math.random() * 3.5 + 1.8,
          speedX: (Math.random() - 0.5) * 1.4,
          speedY: (Math.random() - 0.5) * 1.4 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1
        });
      }
    };

    const onMouseMove = (e) => addSparkles(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      addSparkles(t.clientX, t.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    const drawSparkle = (c, p) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.alpha;
      c.fillStyle = p.color;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(p.size, 0);
        c.lineTo(p.size * 0.22, p.size * 0.22);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          drawSparkle(ctx, p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentStage]);

  if (currentStage === 3) {
    // On Stage 3, only render the starry cursor trail!
    return <canvas id="cursorCanvas" ref={cursorCanvasRef} />;
  }

  return (
    <>
      <canvas id="ambientCanvas" ref={ambientCanvasRef} />
      <canvas id="cursorCanvas" ref={cursorCanvasRef} />
      
      {/* Soft Subtle Ambient Light Orbs for daytime pages */}
      <div className="pastel-orb orb-white" />
      <div className="pastel-orb orb-pink" />
      <div className="pastel-orb orb-peach" />
    </>
  );
}
