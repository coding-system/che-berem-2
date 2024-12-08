// Функция перемешивания массива
function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
 }
 
 // Функция для выбора случайных героев
 function getRandomHeroes(images, count) {
   const shuffledImages = shuffleArray([...images]);
   return shuffledImages.slice(0, count);
 }
 
 // Переменные для состояния игры
 let hasFlippedCard = false;
 let firstCard, secondCard;
 let flipTimeout = null; // Таймер для автозакрытия карточек
 let timerStarted = false; // Флаг, чтобы не запускать таймер повторно
 
 // Переменные для таймера
 let timerId = null;
 let elapsedTime = 0; // Храним время в секундах
 
 // Функция для обновления и отображения таймера
 function updateTimer() {
   elapsedTime++;
   const timerElement = document.querySelector('.minigame-pairs__timer-text');
   timerElement.textContent = elapsedTime; // Обновляем текст таймера
 }
 
 // Сброс таймера
 function resetTimer() {
   clearInterval(timerId); // Останавливаем текущий таймер
   elapsedTime = 0; // Сбрасываем время
   const timerElement = document.querySelector('.minigame-pairs__timer-text');
   timerElement.textContent = elapsedTime; // Устанавливаем таймер на 0
   timerStarted = false; // Сбрасываем флаг
 }
 
 // Запуск таймера
 function startTimer() {
   if (!timerStarted) {
     timerStarted = true;
     timerId = setInterval(updateTimer, 1000); // Запускаем обновление каждую секунду
   }
 }
 
 // Функция для сохранения лучшего результата в localStorage
 function saveBestScore(score) {
   localStorage.setItem("minigameBestScore", score);
 }
 
 // Функция для получения лучшего результата из localStorage
 function getBestScore() {
   return parseInt(localStorage.getItem("minigameBestScore")) || Infinity;
 }
 
 // Функция обновления отображения лучшего результата
 function updateBestScoreDisplay() {
   const bestScore = getBestScore();
   const bestScoreElement = document.querySelector('.minigame-pairs__best-score_result');
   bestScoreElement.textContent = bestScore === Infinity ? 'N/A' : bestScore;
 }
 
 // Функция проверки и обновления лучшего результата
 function checkAndUpdateBestScore() {
   if (elapsedTime < getBestScore()) {
     saveBestScore(elapsedTime);
     updateBestScoreDisplay();
   }
 }
 
 // Функция для генерации игрового поля
 export function generateBoard() {
   const boardElement = document.querySelector('.minigame-pairs__board-list');
   boardElement.innerHTML = ''; // Очистим доску перед новым раундом
 
   const template = document.getElementById('minigame-pairs-board-item'); // Получаем шаблон
 
   // Массив с путями к уникальным картинкам
   const images = [
     './assets/heroes/minimap_icons/Anti-Mage_minimap_icon.webp',
     './assets/heroes/minimap_icons/Lina_minimap_icon.webp',
     './assets/heroes/minimap_icons/Bristleback_minimap_icon.webp',
     './assets/heroes/minimap_icons/Clinkz_minimap_icon.webp',
     './assets/heroes/minimap_icons/Juggernaut_minimap_icon.webp',
     './assets/heroes/minimap_icons/Legion_Commander_minimap_icon.webp',
     './assets/heroes/minimap_icons/Sniper_minimap_icon.webp',
     './assets/heroes/minimap_icons/Faceless_Void_minimap_icon.webp',
     './assets/heroes/minimap_icons/Lion_minimap_icon.webp',
     './assets/heroes/minimap_icons/Slark_minimap_icon.webp',
     './assets/heroes/minimap_icons/Skywrath_Mage_minimap_icon.webp',
     './assets/heroes/minimap_icons/Rubick_minimap_icon.webp',
     './assets/heroes/minimap_icons/Necrophos_minimap_icon.webp',
     './assets/heroes/minimap_icons/Morphling_minimap_icon.webp',
     './assets/heroes/minimap_icons/Windranger_minimap_icon.webp',
     './assets/heroes/minimap_icons/Ursa_minimap_icon.webp',
     './assets/heroes/minimap_icons/Shadow_Fiend_minimap_icon.webp',
     './assets/heroes/minimap_icons/Pudge_minimap_icon.webp',
     './assets/heroes/minimap_icons/Axe_minimap_icon.webp',
     './assets/heroes/minimap_icons/Lich_minimap_icon.webp',
     './assets/heroes/minimap_icons/Storm_Spirit_minimap_icon.webp',
     './assets/heroes/minimap_icons/Templar_Assassin_minimap_icon.webp',
     './assets/heroes/minimap_icons/Sven_minimap_icon.webp',
     './assets/heroes/minimap_icons/Dazzle_minimap_icon.webp',
     './assets/heroes/minimap_icons/Enigma_minimap_icon.webp',
     './assets/heroes/minimap_icons/Meepo_minimap_icon.webp',
     './assets/heroes/minimap_icons/Invoker_minimap_icon.webp',
     './assets/heroes/minimap_icons/Broodmother_minimap_icon.webp',
     './assets/heroes/minimap_icons/Huskar_minimap_icon.webp',
     './assets/heroes/minimap_icons/Phantom_Assassin_minimap_icon.webp',
     './assets/heroes/minimap_icons/Troll_Warlord_minimap_icon.webp',
     './assets/heroes/minimap_icons/Crystal_Maiden_minimap_icon.webp',
   ];
 
   // Выбираем 8 случайных уникальных героев
   const selectedHeroes = getRandomHeroes(images, 8);
 
   // Удваиваем массив, чтобы получить пары
   const imagePairs = [...selectedHeroes, ...selectedHeroes];
 
   // Перемешиваем пары картинок
   const shuffledImages = shuffleArray(imagePairs);
 
   // Создаем карточки с использованием шаблона
   shuffledImages.forEach((imgSrc) => {
     const clone = document.importNode(template.content, true);
 
     const imgElement = clone.querySelector('.minigame-pairs__board-image');
     imgElement.src = imgSrc;
 
     const cardElement = clone.querySelector('.card');
     cardElement.addEventListener('click', flipCard);
 
     boardElement.appendChild(clone);
   });
 }
 
 // Функция переворота карточки
 function flipCard() {
   if (this.classList.contains('is-flipped')) return; // Игнорируем уже перевернутые карточки
 
   // Если это первый клик, запускаем таймер
   if (!timerStarted) {
     startTimer();
   }
 
   // Если уже есть открытые карточки, закроем их перед новой парой
   if (flipTimeout) {
     clearTimeout(flipTimeout);
     unflipCards();
   }
 
   this.classList.add('is-flipped');
 
   if (!hasFlippedCard) {
     hasFlippedCard = true;
     firstCard = this;
     return;
   }
 
   secondCard = this;
 
   checkForMatch();
 }
 
 // Проверка на совпадение карточек
 function checkForMatch() {
   const isMatch = firstCard.querySelector('img').src === secondCard.querySelector('img').src;
 
   isMatch ? disableCards() : startUnflipTimer();
 }
 
 // Если карточки совпали
 function disableCards() {
   firstCard.removeEventListener('click', flipCard);
   secondCard.removeEventListener('click', flipCard);
 
   if (document.querySelectorAll('.card:not(.is-flipped)').length === 0) {
     clearInterval(timerId); // Остановить таймер
     checkAndUpdateBestScore();
   }
 
   resetBoard();
 }
 
 // Таймер для закрытия карточек, если они не совпали
 function startUnflipTimer() {
   flipTimeout = setTimeout(unflipCards, 1000);
 }
 
 // Если карточки не совпали
 function unflipCards() {
   firstCard.classList.remove('is-flipped');
   secondCard.classList.remove('is-flipped');
 
   resetBoard();
 }
 
 // Сброс состояния
 function resetBoard() {
   [hasFlippedCard, flipTimeout] = [false, null];
   [firstCard, secondCard] = [null, null];
 }
 
 // Функция для переворота всех карточек рубашкой вверх
 function flipAllCards() {
   const cards = document.querySelectorAll('.card');
   cards.forEach((card) => {
     card.classList.remove('is-flipped');
   });
 
   resetBoard();
 }
 
 // Инициализация игры при загрузке страницы
 document.addEventListener('DOMContentLoaded', () => {
   generateBoard();
   resetTimer(); // Таймер сбрасывается при загрузке
   updateBestScoreDisplay(); // Обновляем лучший результат при загрузке
 });
 
 // Обработчик для кнопки "RESET"
 const resetButton = document.querySelector('.minigame-pairs__reset-button');
 resetButton.addEventListener('click', () => {
   flipAllCards();
   resetTimer(); // Сбрасываем и перезапускаем таймер
   generateBoard();
 });
 