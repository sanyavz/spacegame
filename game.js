const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Картинки
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

// Переменные корабля и игры
let ship = { x: canvas.width/2, y: canvas.height - 1000, w: 200, h: 200 };
let bullets = [];
let items = [];
let score = 0;
let lastShot = 0;
let lastSpawn = 0;
let gameRunning = false;

// Кнопки управления на телефоне
let movingLeft = false;
let movingRight = false;

document.getElementById('left-btn').addEventListener('touchstart', () => { movingLeft = true; });
document.getElementById('left-btn').addEventListener('touchend', () => { movingLeft = false; });

document.getElementById('right-btn').addEventListener('touchstart', () => { movingRight = true; });
document.getElementById('right-btn').addEventListener('touchend', () => { movingRight = false; });

// Старт игры
function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  gameRunning = true;
  requestAnimationFrame(loop);
}

document.getElementById('start-btn').onclick = startGame;

// Клавиши (для ПК)
let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Движение корабля
function moveShip() {
  const speed = 14;
  if (keys['ArrowLeft'] || keys['a'] || movingLeft) ship.x -= speed;
  if (keys['ArrowRight'] || keys['d'] || movingRight) ship.x += speed;

  // Ограничение экрана
  ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));
}

// Главный цикл игры
function loop(timestamp) {
  if (!gameRunning) return;

  // Движение корабля
  moveShip();

  // Фон
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Корабль
  ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

  // Стрельба
  if (timestamp - lastShot > 200) {
    bullets.push({ x: ship.x + ship.w/2 - 7, y: ship.y, w: 14, h: 40 });
    lastShot = timestamp;
  }

  bullets.forEach(b => {
    b.y -= 6;
    ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
  });
  bullets = bullets.filter(b => b.y > -20);

  // Появление предметов
  if (timestamp - lastSpawn > 1000) {
    const img = itemImgs[Math.floor(Math.random() * itemImgs.length)];
    items.push({ x: Math.random() * (canvas.width - 110), y: -110, w: 110, h: 110, img });
    lastSpawn = timestamp;
  }

  // Движение предметов
  items.forEach(i => {
    i.y += 3;
    ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
  });
  items = items.filter(i => i.y < canvas.height + 60);

  // Столкновения пуль с предметами
  bullets.forEach((b, bi) => {
    items.forEach((i, ii) => {
      if (b.x < i.x + i.w && b.x + b.w > i.x && b.y < i.y + i.h && b.y + b.h > i.y) {
        bullets.splice(bi, 1);
        items.splice(ii, 1);
        score++;
      }
    });
  });

  // Счёт
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Очки: " + score, 20, 40);

  requestAnimationFrame(loop);
}
