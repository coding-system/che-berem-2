////////////////////////////////////
/////  Диалог списка героев  ///////
////////////////////////////////////
import {
   portraitsList,
   cardPortraitTemplate,
   portraitsstrengthList,
   portraitsagilityList,
   portraitsintelligenceList,
   portraitsuniversalList,
   saveMyBansToLocalStorage,
   loadMyBansFromLocalStorage,
   startHeroes,
   saveStartHeroesToLocalStorage,
   globalOverlay,
} from "../index.js";

import { keyMapping } from "./keymap.js";

// document.addEventListener("DOMContentLoaded", function () {
//    heroesListButton.addEventListener("click", function () {
//       heroesList.classList.add("popup_is-opened");
//    });

//    heroesListcloseButton.addEventListener("click", function () {
//       heroesList.classList.remove("popup_is-opened");
//    });
// });

const portraitsListZ = document.querySelector(".portraits-list");

// Функция обновления отображения героя
function updateHeroDisplay(hero, cardBanned, cardLine, videoBanned) {
   if (hero.selected) {
      cardBanned.classList.remove('banned-overlay-visible')
      // cardLine.style.opacity = "0";
      videoBanned.classList.remove('video-banned-overlay-visible');
   } else {
      cardBanned.classList.add('banned-overlay-visible')
      // cardLine.style.opacity = "0";
      videoBanned.classList.add('video-banned-overlay-visible');
   }
}

// Функция массового изменения состояния героев
function updateAllHeroes(heroes, selectAll = true) {
   heroes.forEach((hero) => {
      hero.selected = selectAll;
   });

   // Обновляем отображение всех героев
   heroes.forEach((hero) => {
      let cardPortraitItem;
      switch (hero.attribute) {
         case "strength":
            cardPortraitItem = Array.from(portraitsstrengthList.children).find(
               (item) =>
                  item
                     .querySelector(".card-portrait-video-name")
                     .textContent.includes(hero.name)
            );
            break;
         case "agility":
            cardPortraitItem = Array.from(portraitsagilityList.children).find(
               (item) =>
                  item
                     .querySelector(".card-portrait-video-name")
                     .textContent.includes(hero.name)
            );
            break;
         case "intelligence":
            cardPortraitItem = Array.from(
               portraitsintelligenceList.children
            ).find((item) =>
               item
                  .querySelector(".card-portrait-video-name")
                  .textContent.includes(hero.name)
            );
            break;
         case "universal":
            cardPortraitItem = Array.from(portraitsuniversalList.children).find(
               (item) =>
                  item
                     .querySelector(".card-portrait-video-name")
                     .textContent.includes(hero.name)
            );
            break;
      }

      if (cardPortraitItem) {
         const cardBanned = cardPortraitItem.querySelector(".banned-overlay");
         const cardLine = cardPortraitItem.querySelector(".line");
         const videoBanned = cardPortraitItem.querySelector(
            ".video-banned-overlay"
         );
         updateHeroDisplay(hero, cardBanned, cardLine, videoBanned);
      }
   });
}

export function updatePortraits(heroes) {
   // Проходимся по массиву героев и обновляем только отображение
   heroes.forEach((hero) => {
      // Ищем элемент карточки по уникальному идентификатору героя, например по имени
      const heroCard = document.querySelector(
         `.card-portrait-item[data-hero-name="${hero.name}"]`
      );

      if (heroCard) {
         const cardBanned = heroCard.querySelector(".banned-overlay");
         const videoBanned = heroCard.querySelector(".video-banned-overlay");
         const cardLine = heroCard.querySelector(".line");

         // Обновляем отображение стилей в зависимости от состояния hero.selected
         updateHeroDisplay(hero, cardBanned, cardLine, videoBanned);
      }
   });
}

// Функция для добавления альтернативных имен героев
function addHeroAlternativeNames(heroName) {
   let secondName = "";

   switch (heroName) {
      case "Windranger":
         secondName = "WR";
         break;
      case "Bloodseeker":
         secondName = "BS";
         break;
      case "Dawnbreaker":
         secondName = "DB Valora";
         break;
      case "Lifestealer":
         secondName = "Ghoul Gul Gulya";
         break;
      case "Spirit Breaker":
         secondName = "Bara";
         break;
      case "Tusk":
         secondName = "Tuskar";
         break;
      case "Nature's Prophet":
         secondName = "Furion";
         break;
      case "Death Prophet":
         secondName = "Bansha";
         break;
      case "Jakiro":
         secondName = "THD";
         break;
      case "Outworld Destroyer":
         secondName = "Outworld Devourer";
         break;
      case "Necrophos":
         secondName = "Necrolyte Nekrolyte Necrolite Nekrolite";
         break;
      case "Shadow Shaman":
         secondName = "Rhasta Rasta";
         break;
      case "Silencer":
         secondName = "Salo";
         break;
      case "Antimage":
         secondName = "AM Magina";
         break;
      case "Morphling":
         secondName = "Morf Morfling";
         break;
      case "Terrorblade":
         secondName = "TB";
         break;
      case "Troll Warlord":
         secondName = "TW";
         break;
      case "Beastmaster":
         secondName = "BM";
         break;
      case "Brewmaster":
         secondName = "BM";
         break;
      case "IO":
         secondName = "Wisp";
         break;
      case "Winter Wyvern":
         secondName = "Wiwern Wivern";
         break;
      case "Abaddon":
         secondName = "Abbadon Abbaddon Abadon";
         break;
      case "Queen of pain":
         secondName = "Akasha";
         break;
      // Добавьте другие альтернативные имена по необходимости
      default:
         secondName = ""; // Если нет альтернативного имени
   }

   return secondName;
}

function renderPortraits(heroes) {
   // Очищаем списки перед добавлением новых элементов
   portraitsstrengthList.innerHTML = "";
   portraitsagilityList.innerHTML = "";
   portraitsintelligenceList.innerHTML = "";
   portraitsuniversalList.innerHTML = "";

   heroes.forEach((hero) => {
      const cardPortraitItem = cardPortraitTemplate.cloneNode(true); // Клонируем шаблон для каждого героя
      const cardPortraitImage = cardPortraitItem.querySelector(
         ".card-portrait-image-content"
      );
      const cardPortraitHoverVideo = cardPortraitItem.querySelector(
         ".card-portrait-video-content"
      );
      const cardPortraitButton = cardPortraitItem.querySelector(
         ".card-portrait-item"
      );
      const cardPortraitHoverName = cardPortraitItem.querySelector(
         ".card-portrait-video-name"
      );
      const cardBanned = cardPortraitItem.querySelector(".banned-overlay");
      const videoBanned = cardPortraitItem.querySelector(
         ".video-banned-overlay"
      );
      const cardLine = cardPortraitItem.querySelector(".line");

      const heroName = hero.image.replace(".jpg", "");
      const videoSrc = `./assets/heroes/portraits/npc_dota_hero_${heroName}.webm`;

      cardPortraitImage.src = `./assets/heroes/pictures/npc_dota_hero_${heroName}.jpg`;
      cardPortraitHoverVideo.src = videoSrc;
      cardPortraitHoverName.textContent = hero.name;

      // Установка data-hero-name
      cardPortraitButton.setAttribute("data-hero-name", hero.name);

      // Вызов функции для получения альтернативного имени и установка data-hero-second-name
      const secondName = addHeroAlternativeNames(hero.name);
      if (secondName) {
         cardPortraitButton.setAttribute("data-hero-second-name", secondName);
      }

      cardPortraitButton.addEventListener("mouseenter", () => {
         if (cardPortraitHoverVideo.paused) {
            cardPortraitHoverVideo.play().catch((error) => {
               console.error("Failed to play video:", error);
            });
         }
      });

      cardPortraitButton.addEventListener("mouseleave", () => {
         if (!cardPortraitHoverVideo.paused) {
            cardPortraitHoverVideo.pause();
         }
      });

      // Обновляем отображение стилей в зависимости от состояния hero.selected
      updateHeroDisplay(hero, cardBanned, cardLine, videoBanned);

      switch (hero.attribute) {
         case "strength":
            portraitsstrengthList.appendChild(cardPortraitItem);
            break;
         case "agility":
            portraitsagilityList.appendChild(cardPortraitItem);
            break;
         case "intelligence":
            portraitsintelligenceList.appendChild(cardPortraitItem);
            break;
         case "universal":
            portraitsuniversalList.appendChild(cardPortraitItem);
            break;
      }
   });

   const selectAllButton = portraitsList.querySelector(".select-all");
   const banAllButton = portraitsList.querySelector(".ban-all");
   const saveMyBansButton = portraitsList.querySelector(".save-bans");
   const loadMyBansButton = portraitsList.querySelector(".load-bans");
   const lightSpark = document.querySelector(".light-spark");

   // Выбор всех героев
   selectAllButton.addEventListener("click", () => {
      updateAllHeroes(heroes, true);
      lightSpark.classList.add("green-light-spark");
      setTimeout(() => lightSpark.classList.remove("green-light-spark"), 500);
      saveStartHeroesToLocalStorage();
   });

   // Бан всех героев
   banAllButton.addEventListener("click", () => {
      updateAllHeroes(heroes, false);
      lightSpark.classList.add("red-light-spark");
      setTimeout(() => lightSpark.classList.remove("red-light-spark"), 500);
      saveStartHeroesToLocalStorage();
   });

   saveMyBansButton.addEventListener("click", () => {
      saveMyBansToLocalStorage();
      lightSpark.classList.add("blue-light-spark");
      setTimeout(() => lightSpark.classList.remove("blue-light-spark"), 500);
      saveStartHeroesToLocalStorage();
   });

   // Событие для кнопки загрузки банов
   loadMyBansButton.addEventListener("click", () => {
      loadMyBansFromLocalStorage();
      updatePortraits(heroes);
      lightSpark.classList.add("yellow-light-spark");
      setTimeout(() => lightSpark.classList.remove("yellow-light-spark"), 500);
      console.log(startHeroes);
      saveStartHeroesToLocalStorage();
   });

   // Добавляем делегирование событий
   portraitsList.addEventListener("click", (event) => {
      const card = event.target.closest(".card-portrait-item");
      if (!card) return; // Игнорируем, если клик был не по карточке

      const heroName = card.getAttribute("data-hero-name");
      const hero = heroes.find((h) => h.name === heroName);

      if (hero) {
         hero.selected = !hero.selected; // Переключаем состояние selected
         const cardBanned = card.querySelector(".banned-overlay");
         const videoBanned = card.querySelector(".video-banned-overlay");
         const cardLine = card.querySelector(".line");

         updateHeroDisplay(hero, cardBanned, cardLine, videoBanned);
         console.log(`${hero.name} => ${hero.selected}`);
      }
      saveStartHeroesToLocalStorage();
   });
}

function runAnimation() {
   // Удаление и перезапуск анимации через void
   void inputElementData.offsetWidth; // Перезапуск анимации
   inputElementData.classList.add("portraits-list__search-data_animated");
   inputElementData.classList.remove("portraits-list__search-data_visible");
   console.log("Анимация запущена заново через void");
}

function stopAnimation() {
   inputElementData.classList.remove("portraits-list__search-data_animated");
   console.log("Анимация остановлена");
}

const inputElement = document.querySelector(".portraits-list__search");
const inputElementData = document.querySelector(".portraits-list__search-data");

let overlayStatus = Boolean();
// Функция, которая активирует оверлей и выполняет поиск героев
function activateSearchOverlay() {
   overlayStatus = true;
   console.log("Статус оверлея:", overlayStatus);
   const searchTerm = inputElement.value.trim().toLowerCase();
   inputElementData.textContent = searchTerm;
   inputElementData.classList.remove("portraits-list__search-data_animated");

   // Если введен хотя бы один символ, показываем overlay
   if (searchTerm.length > 0) {
      globalOverlay.classList.add("global-overlay__visible");
      inputElementData.classList.add("portraits-list__search-data_visible");
   }

   // Выполняем поиск героев
   searchHeroes();
}

// Функция для отключения оверлея и сброса стилей
function deactivateSearchOverlay() {
   overlayStatus = false;
   console.log("Статус оверлея:", overlayStatus);
   inputElementData.classList.add("portraits-list__search-data_animated");
   globalOverlay.classList.remove("global-overlay__visible");
   inputElementData.classList.remove("portraits-list__search-data_visible");

   // Сброс всех классов героев
   const heroItems = document.querySelectorAll(".card-portrait-item");
   heroItems.forEach((item) => {
      item.classList.remove(
         "search-hero__found",
         "search-hero__not-found"
      );
      const imageBox = item.querySelector(".card-portrait-image-box");
      imageBox.classList.remove(
         "search-hero__found-sparking",
         "search-hero__found-spark"
      )
   });

   // Очищаем содержимое инпута для поиска
   // inputElementData.textContent = "";
}

// Функция для поиска героев
function searchHeroes() {
   const searchTerm = inputElement.value.trim().toLowerCase();

   // Получаем все элементы .card-portrait-item
   const heroItems = document.querySelectorAll(".card-portrait-item");

   // Переменная для хранения найденных героев
   let foundHeroes = [];

   // Проходим по всем карточкам героев
   heroItems.forEach((item) => {
      const heroName =
         item.getAttribute("data-hero-name")?.trim().toLowerCase() || "";
      const heroSecondName =
         item.getAttribute("data-hero-second-name")?.trim().toLowerCase() || "";

      const matchesName =
         heroName.includes(searchTerm) || heroSecondName.includes(searchTerm);

      const initialsMatch = heroName
         .split(" ")
         .map((word) => word.charAt(0).toLowerCase())
         .join("")
         .includes(searchTerm);

      const secondInitialsMatch = heroSecondName
         .split(" ")
         .map((word) => word.charAt(0).toLowerCase())
         .join("")
         .includes(searchTerm);

      // Получаем дочерний элемент .card-portrait-image-box
      const imageBox = item.querySelector(".card-portrait-image-box");

      if (matchesName || initialsMatch || secondInitialsMatch) {
         // Перезапуск анимации
         imageBox.classList.remove("search-hero__found-spark");
         imageBox.classList.remove("search-hero__found-sparking");
         void item.offsetWidth; // Важный трюк для перезапуска анимации
         imageBox.classList.add("search-hero__found-spark");

         item.classList.add("search-hero__found");
         imageBox.classList.add("search-hero__found-sparking");
         item.classList.remove("search-hero__not-found");
         foundHeroes.push(heroName || heroSecondName);
      } else {
         item.classList.add("search-hero__not-found");
         imageBox.classList.remove("search-hero__found-spark");
         item.classList.remove("search-hero__found");
         imageBox.classList.remove("search-hero__found-sparking");
      }
   });

   // Выводим список найденных героев в консоль
   console.log("Найденные герои:", foundHeroes);
   console.log("SearchTerm", searchTerm);
}

function convertToLatin(char) {
   return keyMapping[char] || char; // Возвращаем соответствующий символ или сам символ, если нет соответствия
}

// Функция для обработки нажатия клавиш
function handleKeydown(event) {
   const inputElement = document.querySelector(".portraits-list__search"); // Замените на свой селектор
   // Проверяем, является ли нажатая клавиша буквой (a-z, A-Z, кириллица) или Backspace
   if (event.key.length === 1 && event.key.match(/[a-zA-Zа-яА-Я]/)) {
      event.preventDefault(); // Останавливаем стандартное поведение ввода

      const latinChar = convertToLatin(event.key); // Заменяем символ
      inputElement.value += latinChar; // Добавляем символ в инпут
      inputElement.dispatchEvent(new Event("input")); // Принудительно вызываем событие 'input'
   } else if (event.key === "Backspace") {
      event.preventDefault(); // Останавливаем стандартное поведение
      inputElement.value = inputElement.value.slice(0, -1); // Удаляем последний символ из инпута
      inputElement.dispatchEvent(new Event("input")); // Принудительно вызываем событие 'input'
   }
}

// Функция для сброса поиска
// Функция для сброса поиска и деактивации оверлея
function resetSearch() {
   // Очищаем поле ввода
   inputElement.value = "";

   // Деактивируем оверлей и сбрасываем стили героев
   deactivateSearchOverlay();
}

// Добавляем слушатель клика на оверлей
document.addEventListener("click", () => {
   if (overlayStatus) {
      deactivateSearchOverlay();
      resetSearch();
   }
});

// Добавляем слушатель для нажатия клавиши Esc
document.addEventListener("keydown", (event) => {
   // Проверяем, если нажата клавиша Esc
   if ((event.key === "Escape") | (event.key === "Enter")) {
      // Если overlay отображен, то сбрасываем поиск
      if (overlayStatus) {
         resetSearch();
      }
   }
});

// Навешиваем обработчик нажатия клавиш на документ
document.addEventListener("keydown", handleKeydown);

// Обработчик для инпута
let animationTimeout;

inputElement.addEventListener("input", () => {
   const searchTerm = inputElement.value.trim().toLowerCase();

   if (searchTerm.length > 0) {
      activateSearchOverlay(); // Вызываем функцию активации поиска и оверлея

      // Сбрасываем предыдущий таймер, если символы продолжают вводиться
      if (animationTimeout) {
         clearTimeout(animationTimeout);
      }

      // Запускаем таймер на 1 секунду для анимации
      animationTimeout = setTimeout(() => {
         runAnimation(); // Запускаем анимацию
      }, 1000); // Задержка 1 секунда
   } else {
      deactivateSearchOverlay(); // Сбрасываем все стили и отключаем оверлей
      stopAnimation(); // Сбрасываем анимацию, если строка поиска пуста

      // Очищаем таймер, если был введён новый символ до завершения анимации
      if (animationTimeout) {
         clearTimeout(animationTimeout);
      }
   }
});

export {
   renderPortraits,
   updateHeroDisplay,
   updateAllHeroes,
   inputElement,
   searchHeroes,
   resetSearch,
};
