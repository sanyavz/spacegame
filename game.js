let movingLeft = false;
let movingRight = false;
document.getElementById('left-btn').addEventListener('touchstart', () => { movingLeft = true; });
document.getElementById('left-btn').addEventListener('touchend', () => { movingLeft = false; });

document.getElementById('right-btn').addEventListener('touchstart', () => { movingRight = true; });
document.getElementById('right-btn').addEventListener('touchend', () => { movingRight = false; });
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

let keys = {}; // объект для отслеживания нажатий

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function moveShip() {
  const speed = 7; // скорость движения корабля
  if (keys['ArrowLeft'] || keys['a']) ship.x -= speed;
  if (keys['ArrowRight'] || keys['d']) ship.x += speed;
  if (keys['ArrowUp'] || keys['w']) ship.y -= speed;
  if (keys['ArrowDown'] || keys['s']) ship.y += speed;

  // ограничиваем корабль экраном
  ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));
  ship.y = Math.max(0, Math.min(canvas.height - ship.h, ship.y));
}



function loop(timestamp) {
  if (!gameRunning) return;
const speed = 7; // скорость движения
if (movingLeft) ship.x -= speed;
if (movingRight) ship.x += speed;

// ограничиваем экран
ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));

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
    b.y -= 6;
    ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h);
  });
  bullets = bullets.filter(b => b.y > -20);

  if (timestamp - lastSpawn > 1000) {
    const img = itemImgs[Math.floor(Math.random() * itemImgs.length)];
    items.push({ x: Math.random() * (canvas.width - 110), y: -110, w: 110, h: 110, img });
    lastSpawn = timestamp;
  }

  items.forEach(i => {
    i.y += 3;
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
