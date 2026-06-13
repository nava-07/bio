"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Terminal, Trophy, X, ShieldAlert, CheckCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [
  { id: 'head', x: 7, y: 7 },
  { id: 'body-1', x: 7, y: 8 },
  { id: 'body-2', x: 7, y: 9 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type GameState = "start" | "playing" | "gameover" | "victory";

export default function CyberSnake({ onExit }: { onExit: () => void }) {
  const [gameState, setGameState] = useState<GameState>("start");
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ id: 'food', x: 3, y: 3 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState<{x: number, y: number}[]>([]);
  const [segmentCounter, setSegmentCounter] = useState(3);
  
  // Ref to prevent rapid double-key presses from causing self-collision
  const lastMoveDirection = useRef(INITIAL_DIRECTION);

  const getObstaclesForLevel = (lvl: number) => {
    if (lvl === 1) return [];
    if (lvl === 2) return [
      { x: 3, y: 3 }, { x: 11, y: 3 },
      { x: 3, y: 11 }, { x: 11, y: 11 }
    ];
    if (lvl >= 3) return [
      { x: 3, y: 3 }, { x: 11, y: 3 },
      { x: 3, y: 11 }, { x: 11, y: 11 },
      { x: 7, y: 7 }
    ];
    return [];
  };

  const generateFood = useCallback((currentSnake: typeof snake, currentObstacles: {x:number, y:number}[]) => {
    let newFood: { id: string; x: number; y: number };
    while (true) {
      newFood = {
        id: `food-${Math.random()}`,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      
      const onSnake = currentSnake.some(s => s.x === newFood.x && s.y === newFood.y);
      const onObstacle = currentObstacles.some(o => o.x === newFood.x && o.y === newFood.y);
      
      if (!onSnake && !onObstacle) break;
    }
    setFood(newFood);
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastMoveDirection.current = INITIAL_DIRECTION;
    setScore(0);
    setLevel(1);
    const initialObs = getObstaclesForLevel(1);
    setObstacles(initialObs);
    setSegmentCounter(3);
    setGameState("playing");
    generateFood(INITIAL_SNAKE, initialObs);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      
      const currentDir = lastMoveDirection.current;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = { 
          id: `body-${segmentCounter}`, 
          x: prev[0].x + direction.x, 
          y: prev[0].y + direction.y 
        };

        lastMoveDirection.current = direction;

        // Condition 1: Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState("gameover");
          return prev;
        }

        // Condition 2: Self collision
        if (prev.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameState("gameover");
          return prev;
        }

        // Condition 3: Obstacle collision (Firewall)
        if (obstacles.some((obs) => obs.x === head.x && obs.y === head.y)) {
          setGameState("gameover");
          return prev;
        }

        const newSnake = [head, ...prev];
        let newScore = score;
        let newLevel = level;

        // Condition 4: Food collision
        if (head.x === food.x && head.y === food.y) {
          newScore += 10;
          setScore(newScore);
          setSegmentCounter(c => c + 1);
          
          // Level up conditions
          if (newScore >= 200 && level < 3) {
            newLevel = 3;
            setLevel(3);
            const obs = getObstaclesForLevel(3);
            setObstacles(obs);
            generateFood(newSnake, obs);
          } else if (newScore >= 100 && level < 2) {
            newLevel = 2;
            setLevel(2);
            const obs = getObstaclesForLevel(2);
            setObstacles(obs);
            generateFood(newSnake, obs);
          } else {
            generateFood(newSnake, obstacles);
          }

          // Win Condition
          if (newScore >= 300) {
            setGameState("victory");
          }
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const speed = Math.max(80, 180 - (level * 30)); 
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [direction, food, gameState, score, level, obstacles, segmentCounter, generateFood]);

  return (
    <div className="flex flex-col h-full w-full bg-[#040406]/95 p-4 font-mono select-none relative z-50">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-[#00f0ff] font-orbitron tracking-widest text-xs">CYBER_SNAKE.EXE v2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
            <span className="text-blue-400">Level: {level}</span>
            <span className="text-[#bd00ff] font-bold"><Trophy className="w-3 h-3 inline pb-0.5" /> {score}/300</span>
          </div>
          <button onClick={onExit} className="text-gray-500 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div 
          className="bg-black/60 border border-[#00f0ff]/20 rounded shadow-[0_0_20px_rgba(0,240,255,0.05)] relative overflow-hidden"
          style={{ width: "320px", height: "320px" }}
        >
          {/* Render Obstacles */}
          {obstacles.map((obs, i) => (
            <motion.div
              key={`obs-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bg-red-500/80 border border-red-500 shadow-[0_0_10px_red]"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(obs.x / GRID_SIZE) * 100}%`,
                top: `${(obs.y / GRID_SIZE) * 100}%`,
              }}
            />
          ))}

          {/* Render Food */}
          <motion.div
            key={food.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bg-[#bd00ff] rounded-full shadow-[0_0_15px_#bd00ff]"
            style={{
              width: `${(100 / GRID_SIZE) - 1}%`,
              height: `${(100 / GRID_SIZE) - 1}%`,
              left: `${(food.x / GRID_SIZE) * 100 + 0.5}%`,
              top: `${(food.y / GRID_SIZE) * 100 + 0.5}%`,
            }}
          />

          {/* Render Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={segment.id}
                className={`absolute rounded-sm ${
                  isHead 
                    ? "bg-white shadow-[0_0_15px_#00f0ff] z-10" 
                    : "bg-[#00f0ff] opacity-80 border border-[#00f0ff]/50"
                }`}
                style={{
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                }}
              />
            );
          })}
        </div>

        {/* OVERLAYS */}
        <AnimatePresence>
          {gameState === "start" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20"
            >
              <Terminal className="w-12 h-12 text-[#00f0ff] mb-4 glow-primary" />
              <h3 className="text-[#00f0ff] font-bold text-xl font-orbitron mb-2 tracking-widest">HACK THE NODE</h3>
              <p className="text-gray-400 mb-6 text-xs text-center max-w-[200px]">
                Navigate the grid, avoid red firewalls, and collect data packets. Reach 300 points to breach the system.
              </p>
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 border border-[#00f0ff]/50 text-[#00f0ff] font-orbitron text-sm hover:bg-[#00f0ff]/20 hover:shadow-neon-primary transition-all group"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" /> INITIATE
              </button>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center backdrop-blur-md z-20"
            >
              <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-pulse glow-secondary" />
              <h3 className="text-red-500 font-bold text-2xl font-orbitron mb-2 custom-glitch tracking-widest">SYSTEM FAILURE</h3>
              <p className="text-white mb-6 text-sm font-space">FINAL SCORE: <span className="text-[#00f0ff]">{score}</span></p>
              <button 
                onClick={startGame}
                className="px-6 py-3 border border-red-500/50 text-red-500 font-orbitron text-sm hover:bg-red-500/20 transition-all glow-secondary"
              >
                REBOOT SYSTEM
              </button>
            </motion.div>
          )}

          {gameState === "victory" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-blue-950/80 flex flex-col items-center justify-center backdrop-blur-md z-20"
            >
              <CheckCircle className="w-16 h-16 text-[#00f0ff] mb-4 glow-primary drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]" />
              <h3 className="text-[#00f0ff] font-bold text-2xl font-orbitron mb-2 tracking-widest shadow-neon-primary">SYSTEM BREACHED</h3>
              <p className="text-white mb-6 text-sm font-space">ACCESS GRANTED. SCORE: {score}</p>
              <button 
                onClick={onExit}
                className="px-6 py-3 border border-[#00f0ff]/50 text-[#00f0ff] font-orbitron text-sm hover:bg-[#00f0ff]/20 hover:shadow-neon-primary transition-all"
              >
                ENTER MAINFRAME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-[10px] text-gray-500 font-space uppercase">
        {gameState === "playing" ? "Use W,A,S,D or Arrow Keys to maneuver." : "Awaiting user interaction..."}
      </div>
    </div>
  );
}
