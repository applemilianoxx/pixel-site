'use client';
import { useState, useEffect, useRef } from "react";

export default function PepeDash() {
  const canvasRef = useRef(null);
  const gridOffsetRef = useRef(0);
  const playerX = 50;
  const [playerY, setPlayerY] = useState(200);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const isJumpingRef = useRef(false);
  const [score, setScore] = useState(0);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const rotationSpeedRef = useRef(0);
  const gravity = 0.6;
  const playerSize = 70;
  const [sandParticles, setSandParticles] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const scoreRef = useRef(0);
  const bombImageRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
        }
        setLoadProgress(progress);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

useEffect(() => {
  const img = new Image();
  img.src = '/bomb.png';
  bombImageRef.current = img;
}, []);

  useEffect(() => {
    if (isLoading) return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space') handleJump();
      if (e.code === 'Enter' && isGameOver) restartGame();
    };
    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 540;

  const playerImage = new Image();
  playerImage.src = '/pees.png';

    let animationId;
    let speedMultiplier = 0.8;

function drawPlayer() {
  ctx.save();
  ctx.translate(playerX + playerSize / 2, playerY + playerSize / 2);
  ctx.rotate(rotationRef.current);
  const scaleY = !isJumping && velocityY === 0 ? 0.85 : 1;
  const scaleX = !isJumping && velocityY === 0 ? 1.15 : 1;
  ctx.scale(scaleX, scaleY);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';  
ctx.drawImage(
    playerImage,
    -playerSize / 2 / scaleX,
    -playerSize / 2 / scaleY,
    playerSize / scaleX,
    playerSize / scaleY
  );
  ctx.restore();
}

    function drawSand() {
      sandParticles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color || 'rgba(194,178,128,1)';
        ctx.beginPath();
        const size = 8;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + size / 2, p.y + size);
        ctx.lineTo(p.x - size / 2, p.y + size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }

    function updateSand() {
      setSandParticles(prev =>
        prev.map(p => ({
          x: p.x + (p.vx || 0),
          y: p.y + (p.vy !== undefined ? (p.vy += 0.2) : -0.5),
          alpha: p.alpha - 0.02,
          vx: p.vx,
          vy: p.vy,
          color: p.color || 'rgba(194,178,128,1)'
        })).filter(p => p.alpha > 0)
      );
    }

    function drawObstacles() {
      obstacles.forEach(obs => {
        const top = obs.y - obs.size;
        const left = obs.x;
        const right = obs.x + obs.size;
        const playerBottom = playerY + playerSize;
        const playerOnTop = (
          obs.type === 'cube' &&
          playerX + playerSize > left &&
          playerX < right &&
          Math.abs(playerBottom - top) < 2
        );
        ctx.fillStyle = playerOnTop ? '#00ff00' : '#ff0000';
        const pulse = 5 + 5 * Math.sin(Date.now() / 100);
        ctx.shadowBlur = pulse;
        ctx.shadowColor = '#ff0000';
        if (obs.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.size / 2, obs.y - obs.size);
          ctx.lineTo(obs.x + obs.size, obs.y);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'bomb') {
  const img = bombImageRef.current;
  if (img && img.complete) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, obs.x, obs.y - obs.size, obs.size, obs.size);
    ctx.restore();
  }
}
 else {
  ctx.fillRect(obs.x, obs.y - obs.size, obs.size, obs.size);
}

      });
      platforms.forEach(p => {
        const playerOnPlatform = (
          playerX + playerSize > p.x &&
          playerX < p.x + p.width &&
          Math.abs(playerY + playerSize - p.y) < 2
        );
        ctx.fillStyle = playerOnPlatform ? '#00ff00' : '#8888ff';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });
    }

    function updateObstacles() {
      setObstacles(prev => {
        const newObs = prev.map(obs => ({ ...obs, x: obs.x - 3 * speedMultiplier })).filter(obs => obs.x + obs.size > 0);
        const safeDistance = 60;
        const lastObs = newObs.length > 0 ? newObs[newObs.length - 1] : null;
        if (Math.random() < 0.01) {
          const size = 70;
          const spawnX = 900;
          const tooClose = lastObs && (spawnX - (lastObs.x + lastObs.size)) < safeDistance;
          if (!tooClose) {
            const rand = Math.random();
let type;
if (rand < 0.2) type = 'triangle';
else if (rand < 0.6) type = 'bomb';
else type = 'cube';

            newObs.push({ x: spawnX, y: 539, size, type });
          }
        }
        return newObs;
      });
      setPlatforms(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x - 3 * speedMultiplier })).filter(p => p.x + p.width > 0);
if (Math.random() < 0.01) {
  const lastPlatform = updated[updated.length - 1];
  const minDistance = 150;

  if (!lastPlatform || (700 - (lastPlatform.x + lastPlatform.width)) > minDistance) {
    const platformY = Math.round(390 + Math.random() * 50);
    updated.push({ x: 900, y: platformY, width: 120, height: 30 });
  }
}

        return updated;
      });
    }

    function detectCollision() {
      return obstacles.some(obs => {
        const top = obs.y - obs.size;
        const bottom = obs.y;
        const left = obs.x;
        const right = obs.x + obs.size;
        const playerBottom = playerY + playerSize;
        const playerRight = playerX + playerSize;
        if (
          obs.type === 'cube' &&
          playerBottom <= top + 2 &&
          playerX + playerSize > left &&
          playerX < right
        ) return false;
        return (
          playerX < right &&
          playerRight > left &&
          playerY < bottom &&
          playerBottom > top
        );
      });
    }

    function gameLoop() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      speedMultiplier += 0.2;
      ctx.save();
      gridOffsetRef.current = (gridOffsetRef.current + 1.5 * speedMultiplier) % 25;
      for (let i = 0; i < canvas.width / 25 + 2; i++) {
        const x = i * 25 - gridOffsetRef.current;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = 'rgba(0,255,0,0.35)';
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = 'rgba(0,255,0,0.25)';
        ctx.stroke();
      }
      ctx.restore();
      drawSand();
      updateSand();
      drawObstacles();
      updateObstacles();
      if (detectCollision()) {
        const cubeUnderPlayer = obstacles.find(obs => {
          const top = obs.y - obs.size;
          const left = obs.x;
          const right = obs.x + obs.size;
          const playerBottom = playerY + playerSize;
          return (
            obs.type === 'cube' &&
            playerX + playerSize > left &&
            playerX < right &&
            Math.abs(playerBottom - top) < 2
          );
        });
        const platformUnderPlayer = platforms.find(p => (
          playerX + playerSize > p.x &&
          playerX < p.x + p.width &&
          Math.abs(playerY + playerSize - p.y) < 2
        ));
        const safeOnTop = cubeUnderPlayer || platformUnderPlayer;
        if (!safeOnTop) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          setIsGameOver(true);
          cancelAnimationFrame(animationId);
          return;
        } else {
          rotationRef.current = 0;
          targetRotationRef.current = 0;
          rotationSpeedRef.current = 0;
        }
      }
      if (rotationSpeedRef.current !== 0) {
        rotationRef.current += rotationSpeedRef.current;
        if ((rotationSpeedRef.current > 0 && rotationRef.current >= targetRotationRef.current) ||
            (rotationSpeedRef.current < 0 && rotationRef.current <= targetRotationRef.current)) {
          rotationRef.current = targetRotationRef.current;
          rotationSpeedRef.current = 0;
        }
      }
      drawPlayer();
      scoreRef.current += 4;
      setScore(Math.floor(scoreRef.current));
      const newVel = velocityY + gravity * 0.6;
      let newY = playerY + newVel;
      const groundY = canvas.height - playerSize;
      const cubeBelow = obstacles.find(obs => {
        const top = obs.y - obs.size;
        const left = obs.x;
        const right = obs.x + obs.size;
        return (
          obs.type === 'cube' &&
          playerX + playerSize > left &&
          playerX < right &&
          playerY + playerSize <= top &&
          newY + playerSize >= top
        );
      }) || platforms.find(p => {
        return (
          playerX + playerSize > p.x &&
          playerX < p.x + p.width &&
          playerY + playerSize <= p.y &&
          newY + playerSize >= p.y
        );
      });
      if (cubeBelow) {
        newY = cubeBelow.type === 'cube'
          ? cubeBelow.y - cubeBelow.size - playerSize
          : cubeBelow.y - playerSize;
        setVelocityY(0);
      } else if (newY >= groundY) {
        newY = groundY;
        setVelocityY(0);
      } else {
        setVelocityY(newVel);
      }
      setPlayerY(newY);
      animationId = requestAnimationFrame(gameLoop);
    }

    if (!isGameOver) animationId = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, [playerY, velocityY, sandParticles, obstacles, isGameOver, isLoading]);

  const handleJump = () => {
    const isOnGround = playerY >= canvasRef.current.height - playerSize ||
      platforms.some(p =>
        playerX + playerSize > p.x &&
        playerX < p.x + p.width &&
        Math.abs(playerY + playerSize - p.y) < 2
      ) ||
      obstacles.some(obs =>
        obs.type === 'cube' &&
        playerX + playerSize > obs.x &&
        playerX < obs.x + obs.size &&
        Math.abs(playerY + playerSize - (obs.y - obs.size)) < 2
      );
    if (!isJumpingRef.current && isOnGround) {
      setVelocityY(-13);
      setIsJumping(true);
      isJumpingRef.current = true;
      const newSand = Array.from({ length: 20 }, () => ({
        x: playerX + Math.random() * playerSize,
        y: playerY + playerSize,
        alpha: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 2,
        color: 'rgba(0,255,204,0.8)'
      }));
      setSandParticles(prev => [...prev, ...newSand]);
      targetRotationRef.current = rotationRef.current + 2 * Math.PI;
      rotationSpeedRef.current = Math.PI / 30;
      setTimeout(() => {
        setIsJumping(false);
        isJumpingRef.current = false;
      }, 300);
    }
  };

  const restartGame = () => {
    setObstacles([]);
    setPlatforms([]);
    setSandParticles([]);
    if (canvasRef.current) {
      canvasRef.current.height = 300;
      setPlayerY(300 - playerSize);
    } else {
      setPlayerY(270);
    }
    setVelocityY(0);
    setScore(0);
    scoreRef.current = 0;
    setIsGameOver(false);
    rotationRef.current = 0;
    targetRotationRef.current = 0;
    rotationSpeedRef.current = 0;
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-green-400 text-4xl font-bold">
          Loading... {loadProgress}%
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-green-400 mb-4">Pepe Dash</h1>
          <a href="/" className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">
            Back to Main
          </a>
          <header className="absolute top-4 left-4 text-green-500 font-bold text-xl">Pixelis</header>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`border-2 border-green-500 bg-gray-950 rounded-xl transition-shadow duration-200 ease-in-out ${
                isJumping ? 'shadow-[0_0_20px_#00ffcc]' : ''
              }`}
            />
            {isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-40 backdrop-blur-md transition-opacity duration-500">
                <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">Game Over</div>
                <button onClick={restartGame} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-lg">
                  Restart
                </button>
              </div>
            )}
          </div>
          <div className={`mt-4 text-lg font-mono transition-all duration-500 ${isGameOver ? 'text-red-400 scale-110' : 'text-green-400'}`}>Score: {score}</div>
          <div className="mt-4 text-sm text-gray-400">Press <span className="text-white font-bold">Spacebar</span> to jump</div>
        </>
      )}
    </div>
  );
}
