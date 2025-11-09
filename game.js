const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let shipImg = new Image();
shipImg.src = 'assets/ship.png';

let bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';

const itemImgs = [];
for (let i = 1; i <= 6; i++) {
  let img = new Image();
  img.src = `assets/item${i}.png`;
  itemImgs.push(img);
}

let ship = { x: canvas.width/2, y: canvas.height - 300, w: 200, h: 200 };
let bullets = [];
let items = [];
let score = 0;
let lastShot = 0;
let lastSpawn = 0;
let gameRunning = false;

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  gameRunning = true;
  requestAnimationFrame(loop);
}

document.getElementById('start-btn').onclick = startGame;

// управление пальцем
canvas.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  ship.x = touch.clientX - ship.w / 2;
  ship.y = Math.min(canvas.height - 150, touch.clientY - ship.h / 2);
});

function loop(timestamp) {
  if (!gameRunning) return;

  // === Заливаем весь экран белым цветом ===
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // === Рисуем корабль ===
  ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

  if (timestamp - lastShot > 200) {
    bullets.push({ x: ship.x + ship.w/2 - 7, y: ship.y, w: 14, h: 40 });
    lastShot = timestamp;
  }

  bullets.forEach(b => {
    b.y -= 4;
    ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
  });
  bullets = bullets.filter(b => b.y > -20);

  if (timestamp - lastSpawn > 1000) {
    const img = itemImgs[Math.floor(Math.random() * itemImgs.length)];
    items.push({ x: Math.random() * (canvas.width - 50), y: -60, w: 50, h: 50, img });
    lastSpawn = timestamp;
  }

  items.forEach(i => {
    i.y += 2;
    ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
  });
  items = items.filter(i => i.y < canvas.height + 60);

  bullets.forEach((b, bi) => {
    items.forEach((i, ii) => {
      if (b.x < i.x + i.w && b.x + b.w > i.x && b.y < i.y + i.h && b.y + b.h > i.y) {
        bullets.splice(bi, 1);
        items.splice(ii, 1);
        score++;
      }
    });
  });

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Очки: " + score, 20, 40);

  requestAnimationFrame(loop);
}
