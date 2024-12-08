import { minigameGangDefeatSound } from "../index.js";
const settings = {
   initialMinSpeed: 3, // Начальная минимальная скорость врагов
   initialMaxSpeed: 6, // Начальная максимальная скорость врагов
   initialSpawnInterval: 500, // Начальный интервал появления врагов в миллисекундах
   maxSpawnInterval: 250, // Минимально возможный интервал появления врагов
   maxEnemySpeed: 15, // Максимально возможная скорость врагов
   spawnAcceleration: 6, // Шаг ускорения интервала появления врагов (мс)
   speedAcceleration: 0.15, // Шаг увеличения скорости врагов
};

const field = document.querySelector(".minigame-gang__field");
const target = document.querySelector(".minigame-gang__target");
const enemyTemplate = document.getElementById("minigame-gang__enemy");
const stepsText = document.querySelector(".minigame-gang__steps-text"); // Элемент для отображения шагов
const bestScoreText = document.querySelector(
   ".minigame-gang__best-score_result"
); // Элемент для отображения лучшего счета
let gameInterval;
let spawnInterval;
let spawnTimeout;
let enemies = [];
let isGameOver = false;
let steps = 0; // Счетчик шагов

// Функция обновления счетчика
// Функция обновления счетчика
function updateSteps() {
   stepsText.textContent = steps;

   // Проверяем и изменяем настройки в зависимости от текущего счета
   if (steps >= 60 && steps < 100) {
      settings.maxEnemySpeed = 12;
      settings.spawnAcceleration = 6.5;
      settings.speedAcceleration = 0.18;
      settings.maxSpawnInterval = 225;

      // Изменяем стиль врагов
      enemies.forEach((enemy) => {
         enemy.classList.remove("minigame-gang__enemy-item__levelup-hard");
         enemy.classList.add("minigame-gang__enemy-item__levelup-mid");
      });
   } else if (steps >= 100) {
      settings.maxEnemySpeed = 15;
      settings.spawnAcceleration = 7;
      settings.speedAcceleration = 0.2;
      settings.maxSpawnInterval = 200;

      // Изменяем стиль врагов
      enemies.forEach((enemy) => {
         enemy.classList.remove("minigame-gang__enemy-item__levelup-mid");
         enemy.classList.add("minigame-gang__enemy-item__levelup-hard");
      });
   }
}

// Функция получения лучшего счета из localStorage
function getBestScore() {
   return parseInt(localStorage.getItem("minigameGangBestScore")) || 0;
}

// Функция сохранения лучшего счета в localStorage
function saveBestScore(score) {
   localStorage.setItem("minigameGangBestScore", score);
}

// Функция обновления отображения лучшего счета
export function updateBestScoreDisplay() {
   const bestScore = getBestScore();
   bestScoreText.textContent = bestScore;
}

// Функция создания врага
function createEnemy() {
   const enemy = enemyTemplate.content.firstElementChild.cloneNode(true);

   // Массив с путями к фонам
   const enemyBackgrounds = [
      "../assets/heroes/minimap_icons/Axe_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Broodmother_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Faceless_Void_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Enigma_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Legion_Commander_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Meepo_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Morphling_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Pudge_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Templar_Assassin_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Phantom_Assassin_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Troll_Warlord_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Shadow_Fiend_minimap_icon.webp",
      "../assets/heroes/minimap_icons/Huskar_minimap_icon.webp",
   ];

   // Устанавливаем случайный фон из массива
   const randomBackground =
      enemyBackgrounds[Math.floor(Math.random() * enemyBackgrounds.length)];
   enemy.style.backgroundImage = `url("${randomBackground}")`;

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

   // Устанавливаем случайную скорость в пределах текущих настроек
   enemy.dataset.speed = Math.min(
      Math.random() * (settings.maxSpeed - settings.minSpeed) +
         settings.minSpeed,
      settings.maxEnemySpeed
   );

   // Добавляем врага в игровое поле
   field.appendChild(enemy);
   enemies.push(enemy);
}

// Делегирование события уничтожения врага
field.addEventListener("mouseover", (event) => {
   const enemy = event.target.closest(".minigame-gang__enemy-item");
   if (!enemy) return; // Если навели не на врага, ничего не делаем

   destroyEnemy(enemy);
});

// Функция для ускорения появления врагов
function scheduleEnemySpawn() {
   if (isGameOver) return;
   createEnemy();
   spawnTimeout = setTimeout(scheduleEnemySpawn, spawnInterval);
}

// Движение врагов
function moveEnemies() {
   const targetRect = target.getBoundingClientRect(); // Границы таргета

   enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect(); // Границы врага

      // Проверка столкновения: пересечение прямоугольников
      if (
         enemyRect.left < targetRect.right &&
         enemyRect.right > targetRect.left &&
         enemyRect.top < targetRect.bottom &&
         enemyRect.bottom > targetRect.top
      ) {
         // Добавляем стиль убийцы
         enemy.classList.add("minigame-gang__enemy-item__killer");
         endGame();
      }

      // Центры таргета и врага
      const centerX = targetRect.left + targetRect.width / 2;
      const centerY = targetRect.top + targetRect.height / 2;

      const enemyX = enemyRect.left + enemyRect.width / 2;
      const enemyY = enemyRect.top + enemyRect.height / 2;

      // Вычисляем угол движения к центру таргета
      const angle = Math.atan2(centerY - enemyY, centerX - enemyX);
      const speed = parseFloat(enemy.dataset.speed);

      // Обновляем координаты врага
      enemy.style.left = `${enemy.offsetLeft + Math.cos(angle) * speed}px`;
      enemy.style.top = `${enemy.offsetTop + Math.sin(angle) * speed}px`;
   });
}

// Уничтожение врага
function destroyEnemy(enemy) {
   // Добавляем класс уничтожения
   enemy.classList.add("minigame-gang__enemy-item__destroyed");

   // Считаем врага убитым сразу после клика
   steps++; // Увеличиваем счетчик шагов
   updateSteps(); // Обновляем отображение

   // Ускоряем появление врагов
   spawnInterval = Math.max(
      settings.maxSpawnInterval,
      spawnInterval - settings.spawnAcceleration
   );

   // Ускоряем скорость врагов
   settings.minSpeed = Math.min(
      settings.minSpeed + settings.speedAcceleration,
      settings.maxEnemySpeed
   );
   settings.maxSpeed = Math.min(
      settings.maxSpeed + settings.speedAcceleration,
      settings.maxEnemySpeed
   );

   // Удаляем врага из DOM после короткой задержки, чтобы анимация успела отработать
   setTimeout(() => {
      field.removeChild(enemy);
      enemies = enemies.filter((e) => e !== enemy);
   }, 300); // Задержка 300 мс для отображения анимации
}

// Удаление всех врагов
function removeAllEnemies() {
   enemies.forEach((enemy) => field.removeChild(enemy));
   enemies = [];
}

// Завершение игры (обновляем лучший счет и выводим его)
function endGame() {
   clearInterval(gameInterval);
   clearTimeout(spawnTimeout);
   isGameOver = true;

   // Останавливаем звук и проигрываем заново
   minigameGangDefeatSound.volume = 0.2;
   minigameGangDefeatSound.currentTime = 0;
   minigameGangDefeatSound.play();

   // Проверяем и обновляем лучший счет
   if (steps > getBestScore()) {
      saveBestScore(steps);
   }

   // Обновляем отображение лучшего счета
   updateBestScoreDisplay();

   // Удаляем всех врагов
   removeAllEnemies();
   field.classList.add("minigame-gang__field-defeat");
}

// Запуск игры
export function startGame() {
   field.classList.remove("minigame-gang__field-defeat")
   isGameOver = false;
   clearTimeout(spawnTimeout); // Сбрасываем предыдущий таймаут
   removeAllEnemies(); // Удаляем всех текущих врагов
   enemies = [];
   steps = 0; // Сбрасываем счетчик шагов
   updateSteps(); // Обновляем отображение

   // Сбрасываем значения к начальному состоянию
   settings.minSpeed = settings.initialMinSpeed;
   settings.maxSpeed = settings.initialMaxSpeed;
   spawnInterval = settings.initialSpawnInterval;

   // Запускаем движение врагов
   clearInterval(gameInterval); // Очищаем старый интервал
   gameInterval = setInterval(() => {
      moveEnemies();
   }, 30);

   // Запускаем спавн врагов
   scheduleEnemySpawn();
}
