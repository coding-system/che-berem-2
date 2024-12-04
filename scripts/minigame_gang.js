const field = document.querySelector('.minigame-gang__field');
const target = document.querySelector('.minigame-gang__target');
const enemyTemplate = document.getElementById('minigame-gang__enemy');
let gameInterval;
let enemies = [];
let isGameOver = false;

// Функция создания врага
function createEnemy() {
  const enemy = enemyTemplate.content.firstElementChild.cloneNode(true);

  // Устанавливаем случайную начальную позицию
  const edge = Math.floor(Math.random() * 4);
  const size = field.offsetWidth;
  switch (edge) {
    case 0: // сверху
      enemy.style.left = `${Math.random() * size}px`;
      enemy.style.top = `-30px`;
      break;
    case 1: // справа
      enemy.style.left = `${size + 30}px`;
      enemy.style.top = `${Math.random() * size}px`;
      break;
    case 2: // снизу
      enemy.style.left = `${Math.random() * size}px`;
      enemy.style.top = `${size + 30}px`;
      break;
    case 3: // слева
      enemy.style.left = `-30px`;
      enemy.style.top = `${Math.random() * size}px`;
      break;
  }

  enemy.dataset.speed = Math.random() * 0.5 + 0.5; // Скорость врага
  enemy.addEventListener('click', () => destroyEnemy(enemy));
  field.appendChild(enemy);
  enemies.push(enemy);
}

// Движение врагов
function moveEnemies() {
  const centerX = target.offsetLeft + target.offsetWidth / 2;
  const centerY = target.offsetTop + target.offsetHeight / 2;

  enemies.forEach((enemy, index) => {
    const enemyX = enemy.offsetLeft + enemy.offsetWidth / 2;
    const enemyY = enemy.offsetTop + enemy.offsetHeight / 2;

    const angle = Math.atan2(centerY - enemyY, centerX - enemyX);
    const speed = parseFloat(enemy.dataset.speed);

    enemy.style.left = `${enemy.offsetLeft + Math.cos(angle) * speed}px`;
    enemy.style.top = `${enemy.offsetTop + Math.sin(angle) * speed}px`;

    // Проверяем столкновение с центром
    if (
      Math.hypot(centerX - enemyX, centerY - enemyY) <
      (target.offsetWidth + enemy.offsetWidth) / 2
    ) {
      endGame();
    }
  });
}

// Уничтожение врага
function destroyEnemy(enemy) {
  field.removeChild(enemy);
  enemies = enemies.filter((e) => e !== enemy);
}

// Завершение игры
function endGame() {
  clearInterval(gameInterval);
  isGameOver = true;
  alert('Ты проиграл, брат!');
}

// Запуск игры
function startGame() {
  isGameOver = false;
  enemies = [];
  gameInterval = setInterval(() => {
    if (Math.random() < 0.05) createEnemy(); // Появление врагов
    moveEnemies(); // Движение врагов
  }, 30);
}

// Начало игры
// startGame();