import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

import photoLight from './assets/star-light.jpg';
import photoDark from './assets/star-dark.jpg';
import julya from './assets/julya.jpg';

const traits = [
  { text: 'ЯРКАЯ', darkText: 'ВАЙБОВАЯ', x: -370, y: -150, color: '#D4AF37' },
  { text: 'КРАСИВАЯ', darkText: 'СЛЕЙНАЯ', x: 350, y: -80, color: '#C78E9B' },
  { text: 'ИСКРЕННЯЯ', darkText: 'НЕФОРКА', x: -380, y: 120, color: '#8DA399' },
  { text: 'КРЕАТИВНАЯ',darkText: 'ЭЩКЕРЕЩНАЯ', x: 380, y: 180, color: '#9BB7D4' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [hoveredTrait, setHoveredTrait] = useState(null);

  // Для 3D эффекта карточки
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#FAF9F6] text-[#1a1a1a]'} font-sans overflow-x-hidden`}>

      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-50 p-4 rounded-full bg-white/10 dark:bg-gray-800/40 backdrop-blur-md shadow-2xl border border-white/20 active:scale-90 transition-all"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>

      {/* СЕКЦИЯ 1: ГЛАВНАЯ (Градиенты для обеих тем) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent via-orange-50/20 to-orange-100/30 dark:from-transparent dark:via-[#0c0c14] dark:to-[#1a1a2e]">
        <motion.h3 
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center font-black text-4xl md:text-6xl tracking-tighter uppercase -mb-10"
        >
          Happy Birthday
        </motion.h3>
        
        <div className="relative w-full max-w-6xl flex items-center justify-center h-[750px]">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
            {traits.map((trait, i) => (
              <motion.path
                key={`path-${i}`}
                d={`M 500 375 Q ${500 + trait.x / 2} ${375 + trait.y + 30}, ${500 + trait.x + (trait.x < 0 ? 30 : -1)} ${375 + trait.y}`}
                fill="none"
                stroke={hoveredTrait === i ? trait.color : (darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)")}
                strokeWidth={hoveredTrait === i ? "3" : "1.5"}
                className="transition-colors duration-500"
              />
            ))}
          </svg>

          {traits.map((trait, i) => (
            <motion.div
              key={trait.text}
              onMouseEnter={() => setHoveredTrait(i)}
              onMouseLeave={() => setHoveredTrait(null)}
              onClick={() => confetti({ particleCount: 40, colors: [trait.color], origin: { y: 0.4 } })}
              className="absolute z-20 px-8 py-4 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transition-all"
              style={{ left: `calc(50% + ${trait.x}px)`, top: `calc(50% + ${trait.y}px)`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="font-black text-xs tracking-[0.3em]" style={{ color: trait.color }}>
                {darkMode ? trait.darkText : trait.text}
              </span>
            </motion.div>
          ))}

          {/* ЦЕНТРАЛЬНОЕ ФОТО С 3D-ЭФФЕКТОМ И РАМКОЙ */}
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 p-[2px] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,transparent,rgba(212,175,55,0.5),transparent)] dark:bg-[conic-gradient(from_0deg,transparent,transparent,#fbbf24,transparent)]"
            />
            
            <div className="relative bg-white dark:bg-gray-900 p-4 rounded-[2.5rem]" style={{ transform: "translateZ(50px)" }}>
              <img 
                src={darkMode ? photoDark : photoLight} 
                className="w-64 h-80 md:w-80 md:h-[440px] object-cover rounded-3xl"
              />
              <div className="pt-8 pb-4 text-center font-black text-6xl tracking-tighter uppercase transition-colors duration-500 text-black dark:text-white">
                  {darkMode ? "Icon" : "Star"}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* СЕКЦИЯ 2: ПИСЬМА (Темный градиент) */}
      <section id="wishes" className="py-40 px-6 bg-gradient-to-tr from-stone-100 via-white to-orange-50/30 dark:from-[#1a1a2e] dark:via-[#0f0f1a] dark:to-[#1a1025]">
        <div className="max-w-6xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center font-black text-4xl md:text-6xl tracking-tighter uppercase mb-20"
          >
            Words From Friends
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { from: 'Анжелины', img: 'https://picsum.photos/400/300?sig=11', text: 'Твоё видение мира — это дар.' },
              { from: 'Юльки', img: julya, text: 'Пусть вдохновение никогда не покидает тебя.' },
              { from: 'Динарикса', img: 'https://picsum.photos/400/300?sig=12', text: 'Свети так же ярко, как твои лучшие работы!' }
            ].map((letter, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/10"
              >
                <img src={letter.img} className="w-full h-52 object-cover rounded-2xl mb-8 grayscale hover:grayscale-0 transition-all duration-1000" />
                <h3 className="text-xl font-black mb-3 uppercase tracking-tighter">От {letter.from}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">"{letter.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ 3: ТОРТ (Темный градиент с акцентом) */}
      <section className="py-40 bg-gradient-to-b from-orange-50/30 to-white dark:from-[#1a1025] dark:via-[#1a0d05] dark:to-[#050505] relative overflow-hidden flex flex-col items-center">
        <div className="relative z-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="inline-block cursor-pointer" 
            onClick={() => {
              if(!isBlownOut) {
                setIsBlownOut(true);
                confetti({ particleCount: 200, spread: 80, origin: { y: 0.85 }, colors: ['#D4AF37', '#ffffff'] });
              }
            }}
          >
            <div className="text-8xl mb-10 relative select-none">
              🎂
              <AnimatePresence>
                {!isBlownOut && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -4, 0] }} exit={{ opacity: 0, scale: 0 }}
                    transition={{ y: { repeat: Infinity, duration: 0.6 } }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl"
                  >
                    🔥
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">
            {isBlownOut ? "Wish Sent" : "Make a Wish"}
          </h2>
          <p className="text-gray-400 font-medium tracking-wide">
            {isBlownOut ? "С днем рождения!" : "Загадай желание и нажми на свечу"}
          </p>
        </div>
        
        {/* Декор: Большое размытое пятно фона */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-[140px] -z-0" />
      </section>

      <footer className="py-20 text-center opacity-30 text-[15px] font-black tracking-[0.5em] uppercase mr-[-1.5em]">
        May 8, 2026
      </footer>
    </div>
  );
}