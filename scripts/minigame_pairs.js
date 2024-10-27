function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
 }
 
 // Функция для выбора случайных 18 уникальных героев
 function getRandomHeroes(images, count) {
   const shuffledImages = shuffleArray([...images]); // Перемешиваем копию массива
   return shuffledImages.slice(0, count); // Берем первые 8 элементов
 }
 
 // Переменные для отслеживания состояния игры
 let hasFlippedCard = false;
 let firstCard, secondCard;
 let flipTimeout = null; // Таймер для автозакрытия карточек
 
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
     './assets/heroes/minimap_icons/Invoker_minimap_icon.webp'
   ];
 
   // Выбираем 8 случайных уникальных героев
   const selectedHeroes = getRandomHeroes(images, 8);
 
   // Удваиваем массив, чтобы получить пары
   const imagePairs = [...selectedHeroes, ...selectedHeroes];
 
   // Перемешиваем пары картинок
   const shuffledImages = shuffleArray(imagePairs);
 
   // Создаем карточки с использованием шаблона
   shuffledImages.forEach((imgSrc) => {
     // Клонируем содержимое шаблона
     const clone = document.importNode(template.content, true);
 
     // Устанавливаем изображение для лицевой стороны
     const imgElement = clone.querySelector('.minigame-pairs__board-image');
     imgElement.src = imgSrc;
 
     // Добавляем обработчик на карточку
     const cardElement = clone.querySelector('.card');
     cardElement.addEventListener('click', flipCard);
 
     // Вставляем клонированный элемент в доску
     boardElement.appendChild(clone);
   });
 }
 
 // Переменная для подсчета количества открытий
 let moveCount = 0;
 
 // Функция для обновления и отображения количества ходов
 function updateMoveCount() {
   moveCount++;
   const moveCountElement = document.querySelector('.minigame-pairs__steps-text');
   moveCountElement.textContent = moveCount; // Обновляем текст счетчика
 }
 
 // Сброс количества ходов
 function resetMoveCount() {
   moveCount = 0;
   const moveCountElement = document.querySelector('.minigame-pairs__steps-text');
   moveCountElement.textContent = moveCount; // Сбрасываем текст счетчика
 }
 
 // Функция переворота карточки
 function flipCard() {
   if (this.classList.contains('is-flipped')) return; // Игнорируем уже перевернутые карточки
 
   // Если уже есть открытые карточки, закроем их перед новой парой
   if (flipTimeout) {
     clearTimeout(flipTimeout); // Останавливаем таймер
     unflipCards(); // Закрываем предыдущую пару
   }
 
   this.classList.add('is-flipped');
 
   updateMoveCount();
 
   if (!hasFlippedCard) {
     // Первая карточка
     hasFlippedCard = true;
     firstCard = this;
     return;
   }
 
   // Вторая карточка
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
 
   resetBoard();
 }
 
 // Запуск таймера для автоматического закрытия карточек, если они не совпали
 function startUnflipTimer() {
   flipTimeout = setTimeout(unflipCards, 1000); // Таймер на 1.5 секунды
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
     card.classList.remove('is-flipped'); // Убираем класс, который переворачивает карточку
   });
 
   // Сброс состояния игры
   resetBoard(); // Убедимся, что состояние также сбрасывается
 }
 
 // Инициализация игры при загрузке страницы
 document.addEventListener('DOMContentLoaded', () => {
   generateBoard();
   resetMoveCount(); // Сбрасываем счетчик при загрузке
 });
 
 // Обработчик для кнопки "RESET"
 const resetButton = document.querySelector('.minigame-pairs__reset-button');
 resetButton.addEventListener('click', () => {
   flipAllCards(); // Переворачиваем все карточки рубашкой вверх
   resetMoveCount(); // Сбрасываем счетчик
   generateBoard(); // Генерируем новую доску
 });
 