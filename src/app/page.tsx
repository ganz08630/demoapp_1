"use client";

import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 400, y: 300 });
  const [hue, setHue] = useState(0); // Відтінок, що змінюється від руху миші

  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setMousePosition({ x, y });

      // Оновлюємо відтінок на основі положення миші
      const newHue = Math.floor((x / canvas.width) * 360); // Відтінок залежить від x-позиції
      setHue(newHue);
    };

    if (ctx) {
      // Очищаємо канвас
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Створюємо градієнт, що змінюється залежно від положення миші
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        50,
        mousePosition.x,
        mousePosition.y,
        400
      );
      gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Малюємо білий квадрат, який рухається за мишею
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(mousePosition.x - 25, mousePosition.y - 25, 50, 50);
    }

    // Обробник події руху миші
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePosition, hue]); // Викликаємо ефект при зміні положення миші або відтінку

  return (
    <div style={styles.container}>
      <canvas id="myCanvas" width="800" height="600" style={styles.canvas}></canvas>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a', // Темний фон сторінки
  },
  canvas: {
    border: '2px solid black',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
  },
};

export default Home;
