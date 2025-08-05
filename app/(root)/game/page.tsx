// "use client";
// import { useState, useEffect, useRef } from 'react';
// import { motion, useMotionValue, animate } from 'framer-motion';

// const BallJumpGame = () => {
//   // Game state
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [isJumping, setIsJumping] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [hurdles, setHurdles] = useState<{id: number, position: number, speed: number}[]>([]);

//   // Refs
//   const gameAreaRef = useRef<HTMLDivElement>(null);
//   const animationFrameRef = useRef<number>(0);
//   const hurdleIntervalRef = useRef<NodeJS.Timeout>();
//   const nextHurdleId = useRef(0);

//   // Animation values
//   const ballY = useMotionValue(0);
//   const maxJumpHeight = -120;

//   // Game configuration
//   const config = {
//     ballPosition: 'right-8', // Ball on right side now
//     hurdleStartPosition: -20, // Hurdles start from left
//     hurdleBaseSpeed: 1.5,
//     spawnInterval: 2000,
//     warningDistance: 70 // When hurdle gets this close to ball
//   };

//   // Start game
//   const startGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setGameStarted(true);
//     setHurdles([]);
//     nextHurdleId.current = 0;
//     spawnHurdles();
//   };

//   // Make ball jump
//   const jump = () => {
//     if (isJumping || !gameStarted || gameOver) return;

//     setIsJumping(true);
//     animate(ballY, maxJumpHeight, {
//       duration: 0.3,
//       ease: "easeOut"
//     }).then(() => {
//       animate(ballY, 0, {
//         duration: 0.3,
//         ease: "easeIn"
//       }).then(() => {
//         setIsJumping(false);
//       });
//     });
//   };

//   // Spawn hurdles
//   const spawnHurdles = () => {
//     hurdleIntervalRef.current = setInterval(() => {
//       setHurdles(prev => [
//         ...prev, 
//         { 
//           id: nextHurdleId.current++, 
//           position: config.hurdleStartPosition,
//           speed: config.hurdleBaseSpeed + (Math.random() * 0.5 - 0.25)
//         }
//       ]);
//     }, config.spawnInterval);
//   };

//   // Game loop
//   useEffect(() => {
//     if (!gameStarted || gameOver) return;

//     const gameLoop = () => {
//       setHurdles(prev => 
//         prev.map(hurdle => ({
//           ...hurdle,
//           position: hurdle.position + hurdle.speed // Now increasing position
//         })).filter(hurdle => {
//           // Collision detection with ball on right
//           const ballRight = (gameAreaRef.current?.clientWidth || 300) - 32;
//           const hurdleRight = hurdle.position * (gameAreaRef.current?.clientWidth || 300) / 100;
//           const hurdleLeft = hurdleRight - 24;

//           if (
//             hurdleLeft < ballRight && 
//             hurdleRight > ballRight - 48 && 
//             ballY.get() > -20
//           ) {
//             setGameOver(true);
//             return false;
//           }

//           return hurdle.position < 120; // Changed from > -20
//         })
//       );

//       animationFrameRef.current = requestAnimationFrame(gameLoop);
//     };

//     animationFrameRef.current = requestAnimationFrame(gameLoop);

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [gameStarted, gameOver, ballY]);

//   // Clean up
//   useEffect(() => {
//     return () => {
//       if (hurdleIntervalRef.current) {
//         clearInterval(hurdleIntervalRef.current);
//       }
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div 
//       className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4"
//       onClick={jump}
//     >
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold text-blue-800">Ball Jump</h1>
//           <div className="bg-white/80 px-4 py-2 rounded-full shadow">
//             <span className="font-bold text-blue-700">Score: {score}</span>
//           </div>
//         </div>

//         {/* Game area */}
//         <div 
//           ref={gameAreaRef}
//           className="relative h-64 bg-white/50 rounded-xl border-2 border-white/70 overflow-hidden shadow-lg"
//         >
//           {/* Ground */}
//           <div className="absolute bottom-0 w-full h-8 bg-green-500"></div>

//           {/* Ball - Now on right side */}
//           <motion.div
//             className={`absolute ${config.ballPosition} bottom-8 w-12 h-12 bg-red-500 rounded-full shadow-xl z-10`}
//             style={{ y: ballY }}
//           >
//             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
//             <div className="absolute top-2 left-2 w-2 h-2 bg-white/80 rounded-full"></div>
//           </motion.div>

//           {/* Hurdles - Now coming from left */}
//           {hurdles.map(hurdle => {
//             const isWarning = hurdle.position > config.warningDistance;
//             return (
//               <div
//                 key={hurdle.id}
//                 className={`absolute bottom-8 w-6 h-12 rounded-sm shadow-md transition-colors ${
//                   isWarning ? 'bg-orange-500' : 'bg-yellow-500'
//                 }`}
//                 style={{ left: `${hurdle.position}%` }}
//               >
//                 <div className="absolute top-0 w-full h-1 bg-yellow-600"></div>
//                 <div className="absolute bottom-0 w-full h-1 bg-yellow-700"></div>
//                 {isWarning && (
//                   <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Game messages */}
//           {!gameStarted && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//               <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
//                 <h2 className="text-2xl font-bold text-blue-800 mb-4">Ball Jump</h2>
//                 <p className="mb-6 text-gray-700">Tap to jump over the hurdles!</p>
//                 <button
//                   onClick={startGame}
//                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all"
//                 >
//                   Start Game
//                 </button>
//               </div>
//             </div>
//           )}

//           {gameOver && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//               <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
//                 <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
//                 <p className="text-lg mb-4">Score: {score}</p>
//                 <button
//                   onClick={startGame}
//                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all"
//                 >
//                   Play Again
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Controls */}
//         <div className="mt-6 text-center">
//           <p className="text-blue-800 mb-4">Tap anywhere to jump!</p>
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={jump}
//               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-all"
//             >
//               Jump
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BallJumpGame;

import React from 'react'
import { motion } from 'framer-motion'
const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(120, 119, 255, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      Comming soon
    </div>
  )
}

export default page
