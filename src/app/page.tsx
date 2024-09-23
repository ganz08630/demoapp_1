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
      updateCanvas(x, y);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0]; // Використовуємо перший дотик
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setMousePosition({ x, y });
      updateCanvas(x, y);
    };

    const updateCanvas = (x: number, y: number) => {
      // Оновлюємо відтінок на основі положення
      const newHue = Math.floor((x / canvas.width) * 360);
      setHue(newHue);

      // Очищаємо канвас
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Створюємо градієнт
      const gradient = ctx.createRadialGradient(
        x,
        y,
        50,
        x,
        y,
        400
      );
      gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Малюємо квадрат
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x - 25, y - 25, 50, 50);
    };

    // Обробники подій
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mousePosition, hue]);

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
