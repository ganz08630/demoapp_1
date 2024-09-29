"use client";

import React, { useEffect, useState, useRef } from 'react';

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 400, y: 300 });
  const [hue, setHue] = useState(0); // Відтінок, що змінюється від руху миші
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const gameLoop = () => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Оновлюємо положення куль
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].y += bullets[i].speed;

        ctx.fillStyle = 'red';
        ctx.fillRect(bullets[i].x, bullets[i].y, 5, 5);

        if (bullets[i].y > canvas.height) {
          bullets.splice(i, 1); // Видаляємо кулі, що вийшли за межі екрану
        } else if (
          bullets[i].x >= playerX - 10 &&
          bullets[i].x <= playerX + 10 &&
          bullets[i].y >= playerY - 10 &&
          bullets[i].y <= playerY + 10
        ) {
          setGameOver(true);
        }
      }

      // Перевірка на кінець гри
      if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Кінець гри! Ваш рахунок: ' + score, canvas.width / 2 - 150, canvas.height / 2);
        return;
      }

      // Малюємо "чоловічка"
      ctx.fillStyle = 'white';
      ctx.fillRect(playerX, playerY, 10, 10);

      // Малюємо рахунок
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('Рахунок: ' + score, 10, 20);

      // Створюємо нові кулі
      if (Math.random() < 0.02) {
        bullets.push({
          x: Math.random() * canvas.width,
          y: 0,
          speed: 3,
        });
      }

      requestAnimationFrame(gameLoop);
    };

    // Обробники подій
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'a') {
        playerX -= 10;
      } else if (e.key === 'd') {
        playerX += 10;
      }
    });

    // Запуск гри
    gameLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'a') {
          playerX -= 10;
        } else if (e.key === 'd') {
          playerX += 10;
        }
      });
    };
  }, [mousePosition, hue, gameOver]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    bullets = [];
  };

  let playerX = canvasRef.current?.width / 2 || 400;
  let playerY = canvasRef.current?.height - 20 || 380;
  let bullets: { x: number; y: number; speed: number }[] = [];

  return (
    <div style={styles.container}>
      <canvas
        id="myCanvas"
        width="800"
        height="600"
        style={styles.canvas}
        ref={canvasRef}
      ></canvas>
      {gameOver && (
        <button style={styles.button} onClick={resetGame}>
          Грати знову
        </button>
      )}
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
  button: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: 10,
  },
};

export default Home;
