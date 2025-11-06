import React, { useEffect, useRef, useState } from 'react';

// Minimal retro Breakout clone on a small pixel canvas
export default function RetroBreakout({ width = 240, height = 200, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Game state (kept in ref to avoid rerenders)
    const s = {
      paddle: { w: 48, h: 6, x: (width - 48) / 2, y: height - 18, speed: 8, left: false, right: false },
      ball: { x: width / 2, y: height / 2, r: 3, dx: 2, dy: -2 },
      bricks: [],
      rows: 4, cols: 8, brickW: 24, brickH: 8, brickPad: 6, offsetTop: 32, offsetLeft: 10,
      score: 0,
      running: true,
      lives: 3,
    };

    // Build bricks
    for (let r = 0; r < s.rows; r++) {
      for (let c = 0; c < s.cols; c++) {
        const x = s.offsetLeft + c * (s.brickW + s.brickPad);
        const y = s.offsetTop + r * (s.brickH + s.brickPad);
        s.bricks.push({ x, y, alive: true });
      }
    }
  s.running = false; // don't start until user clicks Play
  stateRef.current = s;

    // Controls
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.paddle.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.paddle.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (s.running) {
          stateRef.current?.pause?.();
        } else {
          stateRef.current?.start?.();
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.paddle.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.paddle.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const resetBall = () => {
      s.ball.x = width / 2;
      s.ball.y = height / 2;
      s.ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
      s.ball.dy = -2;
    };

    const resetLevel = () => {
      s.bricks.forEach(b => b.alive = true);
      resetBall();
    };

    const draw = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      // bg
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = '#111111';
        ctx.fillRect(b.x, b.y, s.brickW, s.brickH);
      }

      // Paddle
      ctx.fillStyle = '#111111';
      ctx.fillRect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h);

      // Ball
      ctx.fillRect(s.ball.x - s.ball.r, s.ball.y - s.ball.r, s.ball.r * 2, s.ball.r * 2);

      // HUD
      ctx.fillStyle = '#111111';
      ctx.font = '8px monospace';
      ctx.fillText(`SCORE:${s.score}`, 4, 10);
      ctx.fillText(`LIVES:${s.lives}`, width - 50, 10);
      if (!s.running) ctx.fillText('PAUSED', width / 2 - 18, height / 2);
    };

    const update = () => {
      // Paddle move
      if (s.paddle.left) s.paddle.x -= s.paddle.speed;
      if (s.paddle.right) s.paddle.x += s.paddle.speed;
      s.paddle.x = Math.max(0, Math.min(width - s.paddle.w, s.paddle.x));

      if (!s.running) return;

      // Ball move
      s.ball.x += s.ball.dx;
      s.ball.y += s.ball.dy;

      // Wall collision
      if (s.ball.x - s.ball.r < 0 || s.ball.x + s.ball.r > width) s.ball.dx *= -1;
      if (s.ball.y - s.ball.r < 0) s.ball.dy *= -1;
      if (s.ball.y + s.ball.r > height) {
        s.lives -= 1;
        if (s.lives <= 0) {
          s.score = 0; s.lives = 3; resetLevel();
        } else {
          resetBall();
        }
      }

      // Paddle collision with angle based on hit position
      if (s.ball.y + s.ball.r >= s.paddle.y && s.ball.y <= s.paddle.y + s.paddle.h) {
        if (s.ball.x >= s.paddle.x && s.ball.x <= s.paddle.x + s.paddle.w) {
          const hitPos = (s.ball.x - (s.paddle.x + s.paddle.w / 2)) / (s.paddle.w / 2); // -1..1
          const angle = hitPos * Math.PI / 3; // up to 60deg
          const speed = Math.sqrt(s.ball.dx*s.ball.dx + s.ball.dy*s.ball.dy) || 2.5;
          s.ball.dx = speed * Math.sin(angle);
          s.ball.dy = -Math.abs(speed * Math.cos(angle));
          // small nudge to avoid sticking
          s.ball.y = s.paddle.y - s.ball.r - 1;
        }
      }

      // Brick collisions
      let aliveCount = 0;
      for (const b of s.bricks) {
        if (!b.alive) continue;
        aliveCount++;
        if (
          s.ball.x + s.ball.r > b.x && s.ball.x - s.ball.r < b.x + s.brickW &&
          s.ball.y + s.ball.r > b.y && s.ball.y - s.ball.r < b.y + s.brickH
        ) {
          b.alive = false;
          s.score += 10;
          s.ball.dy *= -1;
        }
      }
      if (aliveCount === 0) {
        // next level
        s.rows = Math.min(6, s.rows + 1);
        s.bricks = [];
        for (let r = 0; r < s.rows; r++) {
          for (let c = 0; c < s.cols; c++) {
            const x = s.offsetLeft + c * (s.brickW + s.brickPad);
            const y = s.offsetTop + r * (s.brickH + s.brickPad);
            s.bricks.push({ x, y, alive: true });
          }
        }
        resetBall();
      }
    };

    const loop = () => {
      update();
      draw();
      if (stateRef.current?.running) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    // expose start/stop via ref methods
    stateRef.current.start = () => {
      if (!stateRef.current.running) {
        stateRef.current.running = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    stateRef.current.pause = () => {
      stateRef.current.running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      draw();
    };

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [width, height]);

  // Touch controls for mobile
  const touchLeftRef = useRef(false);
  const touchRightRef = useRef(false);
  useEffect(() => {
    const s = stateRef.current;
    const onInterval = setInterval(() => {
      if (!s) return;
      s.paddle.left = !!touchLeftRef.current;
      s.paddle.right = !!touchRightRef.current;
    }, 16);
    return () => clearInterval(onInterval);
  }, []);

  const handlePlayPause = () => {
    const s = stateRef.current;
    if (!s) return;
    if (isPlaying) {
      s.pause();
      setIsPlaying(false);
    } else {
      s.start();
      setIsPlaying(true);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-mono text-ink/80">Tap ◄ ► on mobile, Space to pause</div>
        <button onClick={handlePlayPause} className="font-mono text-xs px-2 py-0.5 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-ink bg-white w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
        <button onTouchStart={() => (touchLeftRef.current = true)} onTouchEnd={() => (touchLeftRef.current = false)} onMouseDown={() => (touchLeftRef.current = true)} onMouseUp={() => (touchLeftRef.current = false)} className="font-mono text-sm border border-ink bg-paper py-2">
          ◄ Left
        </button>
        <button onTouchStart={() => (touchRightRef.current = true)} onTouchEnd={() => (touchRightRef.current = false)} onMouseDown={() => (touchRightRef.current = true)} onMouseUp={() => (touchRightRef.current = false)} className="font-mono text-sm border border-ink bg-paper py-2">
          Right ►
        </button>
      </div>
    </div>
  );
}
