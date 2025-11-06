import React, { useEffect, useRef, useState } from 'react';

// Simple retro Tetris on a pixel grid with Play/Pause and touch controls
export default function RetroTetris({ cols = 10, rows = 20, cell = 12, className = '' }) {
  const width = cols * cell;
  const height = rows * cell;
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Shapes
  const SHAPES = useRef([
    // I
    [[1,1,1,1]],
    // J
    [[1,0,0],[1,1,1]],
    // L
    [[0,0,1],[1,1,1]],
    // O
    [[1,1],[1,1]],
    // S
    [[0,1,1],[1,1,0]],
    // T
    [[0,1,0],[1,1,1]],
    // Z
    [[1,1,0],[0,1,1]],
  ]).current;

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const newBoard = () => Array.from({ length: rows }, () => Array(cols).fill(0));
    const randomShape = () => {
      const s = SHAPES[(Math.random()*SHAPES.length)|0];
      return s.map(r => r.slice());
    };

    const s = {
      board: newBoard(),
      active: { shape: randomShape(), x: 3, y: 0 },
      score: 0,
      lines: 0,
      dropCounter: 0,
      dropInterval: 500, // ms
      lastTime: 0,
      running: false,
      left: false,
      right: false,
      down: false,
      rotate: false,
    };
    stateRef.current = s;

    const collide = (board, piece, offX, offY) => {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            const ny = y + offY;
            const nx = x + offX;
            if (ny < 0 || nx < 0 || nx >= cols || ny >= rows) return true;
            if (board[ny][nx]) return true;
          }
        }
      }
      return false;
    };

    const merge = (board, piece, offX, offY) => {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) board[y+offY][x+offX] = 1;
        }
      }
    };

    const rotateMatrix = (m) => m[0].map((_, i) => m.map(r => r[i]).reverse());

    const spawn = () => {
      s.active.shape = randomShape();
      s.active.x = 3;
      s.active.y = 0;
      if (collide(s.board, s.active.shape, s.active.x, s.active.y)) {
        // game over: reset
        s.board = newBoard();
        s.score = 0;
        s.lines = 0;
      }
    };

    const sweep = () => {
      let cleared = 0;
      for (let y = rows - 1; y >= 0; y--) {
        if (s.board[y].every(v => v !== 0)) {
          s.board.splice(y, 1);
          s.board.unshift(Array(cols).fill(0));
          cleared++;
          y++;
        }
      }
      if (cleared > 0) {
        s.lines += cleared;
        s.score += cleared * 100;
        s.dropInterval = Math.max(120, 500 - s.lines * 15);
      }
    };

    const drawCell = (x, y, filled) => {
      ctx.fillStyle = filled ? '#111111' : '#ffffff';
      ctx.fillRect(x * cell, y * cell, cell, cell);
      ctx.strokeStyle = '#111111';
      ctx.strokeRect(x * cell, y * cell, cell, cell);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // bg
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      // board
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) drawCell(x, y, s.board[y][x]);
      }
      // active piece
      for (let y = 0; y < s.active.shape.length; y++) {
        for (let x = 0; x < s.active.shape[y].length; x++) {
          if (s.active.shape[y][x]) drawCell(x + s.active.x, y + s.active.y, true);
        }
      }
      // HUD
      ctx.fillStyle = '#111111';
      ctx.font = '8px monospace';
      ctx.fillText(`SCORE:${s.score}`, 2, 10);
      ctx.fillText(`LINES:${s.lines}`, width - 50, 10);
      if (!s.running) ctx.fillText('PAUSED', width / 2 - 18, height / 2);
    };

    const playerDrop = () => {
      s.active.y++;
      if (collide(s.board, s.active.shape, s.active.x, s.active.y)) {
        s.active.y--;
        merge(s.board, s.active.shape, s.active.x, s.active.y);
        sweep();
        spawn();
      }
      s.dropCounter = 0;
    };

    const update = (time = 0) => {
      const delta = time - s.lastTime;
      s.lastTime = time;

      // handle horizontal movement with simple immediate response
      if (s.left) {
        s.active.x--;
        if (collide(s.board, s.active.shape, s.active.x, s.active.y)) s.active.x++;
        s.left = false;
      }
      if (s.right) {
        s.active.x++;
        if (collide(s.board, s.active.shape, s.active.x, s.active.y)) s.active.x--;
        s.right = false;
      }
      if (s.rotate) {
        const rotated = rotateMatrix(s.active.shape);
        const prev = s.active.shape;
        s.active.shape = rotated;
        if (collide(s.board, s.active.shape, s.active.x, s.active.y)) {
          // try small wall kicks
          s.active.x++;
          if (collide(s.board, s.active.shape, s.active.x, s.active.y)) {
            s.active.x -= 2;
            if (collide(s.board, s.active.shape, s.active.x, s.active.y)) {
              s.active.x++;
              s.active.shape = prev;
            }
          }
        }
        s.rotate = false;
      }
      if (s.down) {
        playerDrop();
        s.down = false;
      }

      s.dropCounter += delta;
      if (s.dropCounter > s.dropInterval) playerDrop();

      draw();
      if (s.running) rafRef.current = requestAnimationFrame(update);
    };

    // Keyboard
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') s.rotate = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') s.down = true;
      if (e.key === ' ') {
        s.running = !s.running;
        if (s.running) rafRef.current = requestAnimationFrame(update);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // API
    s.start = () => { if (!s.running) { s.running = true; s.lastTime = 0; rafRef.current = requestAnimationFrame(update); } };
    s.pause = () => { s.running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); draw(); };
    s.command = (cmd) => { s[cmd] = true; if (!s.running) draw(); };

    // Initial draw
    draw();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cols, rows, cell]);

  // Touch controls
  const handlePlayPause = () => {
    const s = stateRef.current; if (!s) return;
    if (isPlaying) { s.pause(); setIsPlaying(false); } else { s.start(); setIsPlaying(true); }
  };

  const send = (cmd) => stateRef.current?.command?.(cmd);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-mono text-ink/80">Tap controls on mobile • Space to pause</div>
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
      <div className="mt-2 grid grid-cols-4 gap-2 sm:hidden">
        <button onTouchStart={() => send('left')} onMouseDown={() => send('left')} className="font-mono text-sm border border-ink bg-paper py-2">◄</button>
        <button onTouchStart={() => send('rotate')} onMouseDown={() => send('rotate')} className="font-mono text-sm border border-ink bg-paper py-2">⟳</button>
        <button onTouchStart={() => send('right')} onMouseDown={() => send('right')} className="font-mono text-sm border border-ink bg-paper py-2">►</button>
        <button onTouchStart={() => send('down')} onMouseDown={() => send('down')} className="font-mono text-sm border border-ink bg-paper py-2">▼</button>
      </div>
    </div>
  );
}
