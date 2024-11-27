import { getRandomElement, resetHeroes } from "./scripts/random.js";
import { initialHeroes } from "./scripts/heroes.js";
import { handleHeroClick, updateDelLabel } from "./scripts/rolling.js";
import { renderPortraits } from "./scripts/portraits.js";
import {
   // showHeroes,
   // renderDefaultHeroesList,
   updateOverlayVisibility,
   hideOverlay,
   makeDefaultPageElementsStyle,
   clearHeroStyles,
} from "./scripts/rolling.js";
import {
   initializePopups,
   openPopup,
   closePopup,
   handleEscKey,
} from "./scripts/modal.js";

import { updateRange } from "./scripts/golast.js";
import { lastHeroes } from "./scripts/lastheroes.js";
import {
   acceptChosenHero,
   retryChosenHero,
   // acceptAndDelChosenHero,
} from "./scripts/showhero.js";

import { generateBoard } from "./scripts/minigame_pairs.js";

// Create a deep copy of initialHeroes to work with
const startHeroes = JSON.parse(JSON.stringify(initialHeroes));
const currentLastHeroes = JSON.parse(JSON.stringify(lastHeroes));
let songChangerStatus;

// Help
const helpBox = document.querySelector(".help");

// Other
const songChanger = document.querySelector(".song-changer-checkbox");
const songVolume = document.querySelector(".song-changer-volume");
const rouletteSong = document.querySelector(".song");
const clickSound = document.getElementById("click-sound");
const poofSound = document.getElementById("poof-sound");
const globalOverlay = document.querySelector(".global-overlay");
const headerOfPage = document.querySelector(".header");
const footerOfPage = document.querySelector(".footer");
const lastHeroesBox = document.querySelector(".last-box");

// Roulette
const box = document.querySelector(".box");
const roulette = document.querySelector(".roulette");
const windowList = document.querySelector(".window__list");

// Last heroes
const lastHeroesList = document.querySelector(".last-heroes__list");

// Templstes
// const cardHeroTemplate = document.querySelector("#card-hero-template").content;
const cardPortraitTemplate = document.querySelector(
   "#card-portrait-template"
).content;
const lastHeroTemplate = document.querySelector(
   "#last-heroes-template"
).content;
const windowHeroTemplate = document.querySelector(
   "#window-hero-template"
).content;
const logsTemplate = document.querySelector("#logs-data");
// Popup Loading
const loadingPopup = document.querySelector(".popup__loading");
// Heroes list Popup
const heroesList = document.querySelector(".popup__heroes-list");
const heroesListBox = document.querySelector(".heroes-list__box");
const heroesListGroup = document.querySelector(".heroes-list__group");
// const heroesListButton = document.querySelector(".heroes-list-button");

// Portraits list Popup
const portraitsList = document.querySelector(".popup__portraits-list");
const portraitsListBox = document.querySelector(".portraits-list__box");
const portraitsListSkip = portraitsListBox.querySelector(".skip");
const portraitsListSkipButton = portraitsListSkip.querySelector(".skip__button");
const portraitsListGroup = document.querySelector(".portraits-list__group");
const portraitsListButtons = portraitsList.querySelector(".buttons-bar");
// const portraitsListButton = document.querySelector(".portraits-list-button");

// Show hero Popup
const showHeroBox = document.querySelector(".popup__show-hero");
const showHeroBackground = showHeroBox.querySelector(".show-hero__background");
const showHeroBoxButtons = showHeroBox.querySelector(".buttons-bar");
const showHeroButton = document.querySelector(".show-hero-button");
const showHeroAcceptButton = showHeroBox.querySelector(".button-accept");
const showHeroRertyButton = showHeroBox.querySelector(".button-retry");
// const showHeroAcceptAndDelButton = showHeroBox.querySelector(
//    ".button-accept-and-del"
// );

// Whats new Popup
const whatsNewPopup = document.querySelector(".popup__whats-new");
const whatsNewButton = document.querySelector(".whats-new-button");

// Update Popup
const UpdateButton = document.querySelector(".update__button");
const UpdatePopup = document.querySelector(".popup__update");

// Confirm Popup
const resetConfirm = document.querySelector(".popup__confirm");
const resetAccept = resetConfirm.querySelector(".confirm__accept");
const resetCancel = resetConfirm.querySelector(".confirm__cancel");

// Go last Popup
const goLastPopup = document.querySelector(".popup__go-last");
const goLastButton = document.querySelector(".go-last-button");

// Minigames
const minigamePairs = document.querySelector(".popup__minigame-pairs");
const newOptionButton = document.querySelector(".new-option__button");

// Группы атрибутов
const strengthList = document.querySelector("#heroes-strength");
const agilityList = document.querySelector("#heroes-agility");
const intelligenceList = document.querySelector("#heroes-intelligence");
const universalList = document.querySelector("#heroes-universal");
//
const portraitsstrengthList = document.querySelector("#portraits-strength");
const portraitsagilityList = document.querySelector("#portraits-agility");
const portraitsintelligenceList = document.querySelector(
   "#portraits-intelligence"
);
const portraitsuniversalList = document.querySelector("#portraits-universal");

// Кнопки
const chooseButton = document.querySelector(".choose-button");
const btnTop = document.querySelector(".btn-top");
const btnBottom = document.querySelector(".btn-bottom");
const chooseButtonText = document.querySelector(".btn-top-text");
const resetButton = document.querySelector(".reset-button");

// if (heroАlgorithmChanger.checked) {
//    heroAlgorithmInfo.textContent = 'Герой будет удаляться из списка после каждого нажатия'; // Изменяем текст
// } else {
//    heroAlgorithmInfo.textContent = 'Список героев остается неизменным'; // Изменяем текст, если unchecked
// }

// Добавляем обработчик события на изменение состояния чекбокса
// heroАlgorithmChanger.addEventListener('change', () => {
//    if (heroАlgorithmChanger.checked) {
//       // Если чекбокс отмечен
//       heroAlgorithmInfo.textContent = 'Герой будет удаляться из списка после каждого нажатия';
//    } else {
//       // Если чекбокс не отмечен
//       heroAlgorithmInfo.textContent = 'Список героев остается неизменным';
//    }
// });

// Обработчики
chooseButton.addEventListener("click", () => getRandomElement(startHeroes));
// confirmAccept.addEventListener("click", () => resetHeroes(startHeroes));
// confirmCancel.addEventListener("click", () => resetHeroes(startHeroes));

showHeroAcceptButton.addEventListener("click", () => {
   hideOverlay(1000);
   makeDefaultPageElementsStyle();
   clearHeroStyles();
   acceptChosenHero();
});

showHeroRertyButton.addEventListener("click", () => {
   clearHeroStyles();
   retryChosenHero();
});
// showHeroAcceptAndDelButton.addEventListener("click", () => {
//    acceptAndDelChosenHero();
// });

// Обработчики открытия попапов
// heroesListButton.addEventListener("click", () => {
//    openPopup(heroesList);
// });

newOptionButton.addEventListener("click", () => {
   openPopup(minigamePairs);
});

// portraitsListButton.addEventListener("click", () => {
//    openPopup(portraitsList);
// });
showHeroButton.addEventListener("click", () => {
   openPopup(showHeroBox);
   showHeroBoxButtons.style.opacity = "0";
   showHeroBoxButtons.style.pointerEvents = "none";
});

whatsNewButton.addEventListener("click", () => {
   openPopup(whatsNewPopup);
});
UpdateButton.addEventListener("click", () => {
   openPopup(UpdatePopup);
});

goLastButton.addEventListener("click", () => {
   openPopup(goLastPopup);
});
resetButton.addEventListener("click", () => {
   openPopup(resetConfirm);
});
resetAccept.addEventListener("click", () => {
   resetHeroes(startHeroes);
   closePopup(resetConfirm);
});
resetCancel.addEventListener("click", () => {
   closePopup(resetConfirm);
});

// Render the heroes using startHeroes
// renderHeroes(startHeroes);
// Инициализация попапов
initializePopups(closePopup);
function preloadImages(imagesArray) {
   console.time("preloadImages"); // Начало отсчета времени выполнения
   imagesArray.forEach((imageObj) => {
      const img = new Image();
      img.src = `./assets/heroes/${imageObj.image}`;
   });
   console.debug("Картинки героев загружены");
   console.timeEnd("preloadImages"); // Конец отсчета времени выполнения и вывод результата в консоль
}

function preloadVideos(heroesArray) {
   console.time("preloadVideos"); // Начало отсчета времени выполнения

   heroesArray.forEach((heroObj) => {
      const videoSrc = heroObj.image.replace(".jpg", ".webm");
      const video = document.createElement("video");
      video.src = `./assets/heroes/portraits/npc_dota_hero_${videoSrc}`;
   });
   console.debug("Портреты героев загружены");
   console.timeEnd("preloadVideos"); // Конец отсчета времени выполнения и вывод результата в консоль
}

function preloadPictures(imagesArray) {
   console.time("preloadPictures"); // Начало отсчета времени выполнения
   imagesArray.forEach((imageObj) => {
      const imageSrc = imageObj.image.replace(".jpg", "");
      const img = new Image();
      img.src = `./assets/heroes/pictures/npc_dota_hero_${imageSrc}.jpg`;
   });
   console.debug("Картинки героев загружены");
   console.timeEnd("preloadImages"); // Конец отсчета времени выполнения и вывод результата в консоль
}

function preloadAll() {
   preloadImages(startHeroes);
   preloadVideos(startHeroes);
   preloadPictures(startHeroes);
}

// preloadAll()
// renderDefaultHeroesList(startHeroes);
// renderPortraits(startHeroes);
updateRange();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const promises = [
   preloadAll(), // Асинхронная функция загрузки
   // renderDefaultHeroesList(startHeroes), // Рендер списка героев
   loadChosenIndexFromLocalStorage(),
   loadStartHeroesFromLocalStorage(),
   loadLastHeroesFromLocalStorage(),
   renderLastHeroesFromLocalStorage(),
   renderPortraits(startHeroes),
];

Promise.all(promises)
   .then(() => {
      // Когда все промисы выполнены, убираем стиль загрузки
      setTimeout(() => {
         loadingPopup.classList.remove("popup_is-opened");
      }, 300);
   })
   .catch((error) => {
      console.error("Ошибка во время выполнения промисов:", error);
   });

/////////////////////////////////////////////////////////////
////////////////////  LOCAL STOREGE  ////////////////////////
/////////////////////////////////////////////////////////////
// Функция для сохранения выбранного индекса в localStorage

// Функция для сохранения громкости в локальное хранилище
function saveVolumeToLocalStorage(volume) {
   localStorage.setItem("songVolume", volume);
}

// Функция для загрузки громкости из локального хранилища
function loadVolumeFromLocalStorage() {
   const savedVolume = localStorage.getItem("songVolume");
   return savedVolume ? parseFloat(savedVolume) : 50; // Значение по умолчанию 50
}

// Set up event listener for the checkbox
songChanger.addEventListener("change", () => {
   if (songChanger.checked) {
      rouletteSong.volume = 0.5;
      songVolume.value = 50;
      updateHuy();
   } else {
      rouletteSong.volume = 0;
      songVolume.value = 0;
      updateHuy();
   }

   saveVolumeToLocalStorage(songVolume.value);
});

// Обработчик изменения значения ползунка
songVolume.addEventListener("input", function () {
   const volumeValue = songVolume.value;
   rouletteSong.volume = volumeValue / 100;
   songChanger.checked = volumeValue > 0;
   saveVolumeToLocalStorage(volumeValue);
});

// Устанавливаем громкость при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
   const initialVolume = loadVolumeFromLocalStorage();
   songVolume.value = initialVolume;
   rouletteSong.volume = initialVolume / 100;
   songChanger.checked = initialVolume > 0;

   updateHuy(); // Обновляем состояние UI, если это требуется
});

function saveChosenIndexToLocalStorage(hero) {
   localStorage.setItem("chosenHero", JSON.stringify(hero)); // Сохраняем весь объект героя в виде строки JSON
}

// Функция для загрузки выбранного индекса из localStorage
function loadChosenIndexFromLocalStorage() {
   const savedHero = localStorage.getItem("chosenHero");

   if (savedHero !== null) {
      const hero = JSON.parse(savedHero); // Преобразуем JSON-строку обратно в объект героя
      console.debug(`Последний выбранный герой — ${hero.name}`);

      // Здесь можно использовать свойства героя, например:
      const chosenHeroImage = hero.image.replace(".jpg", "");
      const showHeroTitle = showHeroBox.querySelector(".show-hero__title");
      const showHeroVideo = showHeroBox.querySelector(".show-hero__video");

      // Обновляем значение переменной CSS
      document.documentElement.style.setProperty(
         "--showhero-data-background",
         `url("../assets/heroes/loadout/${hero.loadout}")`
      );

      // Обновление заголовка с именем героя
      showHeroTitle.textContent = hero.name;

      // Обновление постера и источников видео
      showHeroVideo.poster = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${chosenHeroImage}.png`;

      const sources = showHeroVideo.querySelectorAll("source");
      sources[0].src = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${chosenHeroImage}.mov`;
      sources[1].src = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${chosenHeroImage}.webm`;

      // Перезагрузка видео
      showHeroVideo.load();
   } else {
      console.debug("Нет сохраненного героя.");
   }
}

function saveLastHeroesToLocalStorage() {
   // Преобразуем массив currentLastHeroes в строку
   const currentLastHeroesString = JSON.stringify(currentLastHeroes);

   // Сохраняем строку в localStorage
   localStorage.setItem("lastHeroes", currentLastHeroesString);
}

function loadLastHeroesFromLocalStorage() {
   // Получаем строку из localStorage
   const lastHeroesString = localStorage.getItem("lastHeroes");

   // Проверяем, есть ли данные в localStorage
   if (lastHeroesString) {
      // Преобразуем строку обратно в массив
      const loadedHeroes = JSON.parse(lastHeroesString);

      // Очищаем массив currentLastHeroes и добавляем элементы из загруженного массива
      currentLastHeroes.length = 0;
      currentLastHeroes.push(...loadedHeroes);

      // Выводим загруженный массив в консоль
      console.debug("Это currentLastHeroes");
      console.debug("Сохраненные последние герои", currentLastHeroes);
   } else {
      // Если данных нет, выводим сообщение в консоль
      console.debug("Нет сохраненных последних героев");
   }
}

function renderLastHeroesFromLocalStorage() {
   // Загружаем данные из localStorage
   loadLastHeroesFromLocalStorage();

   // Очищаем список перед отображением
   lastHeroesList.innerHTML = "";

   // Перебираем каждый элемент массива currentLastHeroes
   currentLastHeroes.forEach((hero) => {
      // Проверяем, что данные героя не равны пустым строкам
      if (hero.name && hero.image) {
         // Проверяем наличие имени и изображения
         // Клонируем шаблон
         const lastHeroItem = lastHeroTemplate.cloneNode(true);
         const lastHeroUl = lastHeroItem.querySelector(".last-heroes__item");

         // Устанавливаем изображение для героя
         lastHeroUl.style.backgroundImage = `url("./assets/heroes/${hero.image}")`;

         // Добавляем атрибут data-hero-name к элементу
         lastHeroUl.dataset.heroName = hero.name;

         // Универсальная функция для добавления/удаления лейбла "DEL"
         updateDelLabel(lastHeroUl, hero.deleted);

         // Обновляем видимость оверлеев в зависимости от состояния selected
         updateOverlayVisibility(lastHeroUl, !hero.deleted); // Если deleted = false, значит selected = true

         // Добавляем обработчик клика для карточки героя
         lastHeroUl.addEventListener("click", () => {
            handleHeroClick(lastHeroUl);
         });

         // Вставляем героя в список lastHeroesList
         lastHeroesList.appendChild(lastHeroItem);
      }
   });
}

function saveStartHeroesToLocalStorage() {
   const startHeroesString = JSON.stringify(startHeroes);
   localStorage.setItem("startHeroes", startHeroesString);
   console.debug("Массив startHeroes сохранен в localStorage.");
}

function loadStartHeroesFromLocalStorage() {
   // Получаем строку из localStorage
   const startHeroesString = localStorage.getItem("startHeroes");

   // Проверяем, есть ли данные в localStorage
   if (startHeroesString) {
      // Преобразуем строку обратно в массив
      const loadedStartHeroes = JSON.parse(startHeroesString);

      // Очищаем массив startHeroes и добавляем элементы из загруженного массива
      startHeroes.length = 0;
      startHeroes.push(...loadedStartHeroes);

      // Выводим загруженный массив в консоль для проверки
      console.debug("Массив startHeroes загружен из localStorage.");
      console.debug(startHeroes);
   } else {
      // Если данных нет, выводим сообщение в консоль
      console.debug("Нет сохраненных данных для startHeroes в localStorage.");
   }
}

// // Функция для сохранения массива startHeroes как "мои баны" в localStorage
// function saveMyBansToLocalStorage() {
//    const myBansString = JSON.stringify(startHeroes);
//    localStorage.setItem("myBans", myBansString);
//    console.debug("Массив startHeroes сохранен как 'мои баны' в localStorage.");
// }

// // Функция для загрузки массива "мои баны" из localStorage
// function loadMyBansFromLocalStorage() {
//    const myBansString = localStorage.getItem("myBans");

//    // Проверяем, есть ли сохраненные данные
//    if (myBansString) {
//       const loadedMyBans = JSON.parse(myBansString);

//       // Очищаем массив startHeroes и добавляем данные из загруженного массива
//       startHeroes.length = 0;
//       startHeroes.push(...loadedMyBans);

//       console.debug(
//          "Массив startHeroes обновлен с данными из 'моих банов' из localStorage."
//       );
//       console.debug(startHeroes);
//    } else {
//       console.debug("Нет сохраненных данных для 'моих банов' в localStorage.");
//    }
// }

// Функция для сохранения только тех героев, у которых selected false, в localStorage
function saveMyBansToLocalStorage() {
   // Создаем массив с героями, у которых selected = false
   const myBans = startHeroes.filter((hero) => hero.selected === false);

   // Сохраняем этот массив в localStorage
   const myBansString = JSON.stringify(myBans);
   localStorage.setItem("myBans", myBansString);
   console.debug("Герои с selected = false сохранены в localStorage.");
}

// Функция для загрузки данных из localStorage и обновления selected
function loadMyBansFromLocalStorage() {
   const myBansString = localStorage.getItem("myBans");

   // Проверяем, есть ли сохраненные данные
   if (myBansString) {
      const loadedMyBans = JSON.parse(myBansString);

      // Проходим по массиву startHeroes и обновляем selected на false у героев, которые есть в загруженных данных
      startHeroes.forEach((hero) => {
         const bannedHero = loadedMyBans.find((ban) => ban.id === hero.id); // Ищем героя в массиве "банов"
         if (bannedHero) {
            hero.selected = false;
         }
      });

      console.debug(
         "Массив startHeroes обновлен с данными из 'моих банов' из localStorage."
      );
      console.debug(loadedMyBans);
   } else {
      console.debug("Нет сохраненных данных для 'моих банов' в localStorage.");
   }
}

////////////////////////////////////////////////////////////////////////
/////////////////Показ ЧТО НОВОГО новому пользователю///////////////////
////////////////////////////////////////////////////////////////////////
// Универсальная функция для проверки, видел ли пользователь попап

// Функция для получения содержимого первого видимого h4 (дата обновления)
function getUpdateContent() {
   const h4Element = UpdatePopup.querySelector("h4.update__date");
   return h4Element ? h4Element.textContent.trim() : null;
}

// Проверяем, является ли пользователь новым
function isNewUser() {
   return !localStorage.getItem("hasVisited");
}

// Универсальная функция для открытия попапа и проверки, нужно ли его показывать
function showPopupIfNeeded(popupName, popupElement) {
   const currentContent = getUpdateContent();
   const storedContent = localStorage.getItem("updatePopupContent");
   if (popupName === "whatsNewPopup" && isNewUser()) {
      console.debug("Текущее содержимое h4:", currentContent); // Выводим содержимое h4 в консоль
      // Новый пользователь - показываем только "What's New" попап
      openPopup(popupElement);
      saveUpdateContent(currentContent);
      markUserAsVisited(); // Сохраняем, что пользователь заходил
   } else if (popupName === "UpdatePopup" && !isNewUser()) {
      if (currentContent) {
         console.debug("Текущее содержимое h4:", currentContent); // Выводим содержимое h4 в консоль
      }

      if (currentContent && currentContent !== storedContent) {
         // Если содержимое h4 изменилось, показываем попап Update
         openPopup(popupElement);
         saveUpdateContent(currentContent); // Сохраняем новое содержимое h4
      }
   }
}

// Сохраняем факт, что пользователь уже заходил
function markUserAsVisited() {
   localStorage.setItem("hasVisited", "true");
}

// Сохраняем текущее содержимое h4 из попапа Update
function saveUpdateContent(content) {
   localStorage.setItem("updatePopupContent", content);
}

// Использование для разных попапов
if (isNewUser()) {
   // Новый пользователь — показываем только "What's New"
   showPopupIfNeeded("whatsNewPopup", whatsNewPopup);
} else {
   // Старый пользователь — проверяем и открываем UpdatePopup, если h4 изменилось
   showPopupIfNeeded("UpdatePopup", UpdatePopup);
}

// function hasSeenPopup(popupName) {
//    return localStorage.getItem(popupName + "Seen") === "true";
// }

// // Универсальная функция для установки флага, что пользователь видел попап
// function markPopupAsSeen(popupName) {
//    localStorage.setItem(popupName + "Seen", "true");
// }

// // Универсальная функция для открытия попапа и проверки, нужно ли его показывать
// function showPopupIfNeeded(popupName, popupElement) {
//    if (!hasSeenPopup(popupName)) {
//       openPopup(popupElement);
//       markPopupAsSeen(popupName);
//    }
// }

// // Использование для разных попапов
// showPopupIfNeeded("whatsNewPopup", whatsNewPopup);
// showPopupIfNeeded("UpdatePopup", UpdatePopup);

const rangewww = document.querySelector("#rangeVolume");

export function updateHuy() {
   const percentage =
      ((rangewww.value - rangeInput.min) / (rangewww.max - rangewww.min)) * 100;

   // Обновляем градиент ползунка
   rangewww.style.background = `linear-gradient(to right, #fff ${percentage}%, transparent ${percentage}%)`;
}

// updateHuy();

generateBoard();

rangewww.addEventListener("input", updateHuy);

// При загрузке страницы выводим сохраненный индекс героя
loadChosenIndexFromLocalStorage();
// loadStartHeroesFromLocalStorage();
// loadLastHeroesFromLocalStorage();
// renderLastHeroesFromLocalStorage();
// renderPortraits(startHeroes)

export {
   portraitsList,
   portraitsListBox,
   portraitsListGroup,
   chooseButton,
   btnTop,
   btnBottom,
   resetButton,
   heroesList,
   heroesListBox,
   heroesListGroup,
   cardPortraitTemplate,
   strengthList,
   agilityList,
   intelligenceList,
   universalList,
   portraitsstrengthList,
   portraitsagilityList,
   portraitsintelligenceList,
   portraitsuniversalList,
   resetConfirm,
   resetAccept,
   resetCancel,
   windowList,
   windowHeroTemplate,
   lastHeroesList,
   lastHeroTemplate,
   showHeroBox,
   showHeroBoxButtons,
   showHeroBackground,
   // showHeroRertyButton,
   startHeroes,
   helpBox,
   songChanger,
   rouletteSong,
   roulette,
   box,
   loadingPopup,
   saveChosenIndexToLocalStorage,
   saveLastHeroesToLocalStorage,
   saveStartHeroesToLocalStorage,
   saveMyBansToLocalStorage,
   loadMyBansFromLocalStorage,
   currentLastHeroes,
   songChangerStatus,
   chooseButtonText,
   globalOverlay,
   headerOfPage,
   footerOfPage,
   lastHeroesBox,
   portraitsListButtons,
   clickSound,
   poofSound,
   portraitsListSkip,
   portraitsListSkipButton,
};
