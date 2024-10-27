import { chosenHero } from "./random.js";
import {
   windowList,
   windowHeroTemplate,
   lastHeroesList,
   lastHeroTemplate,
   helpBox,
   currentLastHeroes,
   showHeroBoxButtons,
   startHeroes,
   saveLastHeroesToLocalStorage,
   saveStartHeroesToLocalStorage,
   globalOverlay,
   portraitsListBox,
   headerOfPage,
   lastHeroesBox,
   portraitsListButtons,
} from "../index.js";
import { showHeroBox } from "../index.js";
import { openPopup, closePopup } from "./modal.js";
import { updatePortraits } from "./portraits.js";

export let lastHeroesArray = Array(16).fill({ link: "" }); // Инициализация массива с 16 пустыми объектами

export function updateDelLabel(heroElement, isDeleted) {
   // Проверяем, есть ли уже лейблы "deleted-label" и "undeleted-label"
   const existingDelLabel = heroElement.querySelector(".deleted-label");
   const existingUndelLabel = heroElement.querySelector(".undeleted-label");

   if (isDeleted) {
      // Если герой удален, добавляем лейбл "deleted-label" и удаляем "undeleted-label"
      if (!existingDelLabel) {
         const deletedLabel = document.createElement("div");
         deletedLabel.classList.add("deleted-label");
         heroElement.appendChild(deletedLabel);
      }
      if (existingUndelLabel) {
         heroElement.removeChild(existingUndelLabel);
      }
   } else {
      // Если герой не удален, добавляем лейбл "undeleted-label" и удаляем "deleted-label"
      if (!existingUndelLabel) {
         const undeletedLabel = document.createElement("div");
         undeletedLabel.classList.add("undeleted-label");
         heroElement.appendChild(undeletedLabel);
      }
      if (existingDelLabel) {
         heroElement.removeChild(existingDelLabel);
      }
   }
}

// Функция, которая обрабатывает клик по карточке
export function handleHeroClick(lastHeroUl) {
   const heroName = lastHeroUl.dataset.heroName;

   // Находим героя в массиве startHeroes по имени
   const hero = startHeroes.find((h) => h.name === heroName);

   // Находим героя в массиве currentLastHeroes по имени
   const currentLastHero = currentLastHeroes.find((h) => h.name === heroName);

   if (hero && currentLastHero) {
      // Теперь переключаем состояние в массиве currentLastHeroes
      // Если герой помечен как deleted, значит он не выбран, поэтому переключаем состояние
      currentLastHero.deleted = !currentLastHero.deleted;

      // Синхронизируем состояние selected в startHeroes с состоянием deleted
      // Если герой не удален (deleted: false), то он выбран (selected: true)
      hero.selected = !currentLastHero.deleted;

      // Выводим новое значение selected в консоль для проверки
      console.log("Selected в startHeroes:", hero.selected);
      console.log("Deleted в currentLastHeroes:", currentLastHero.deleted);

      // Обновляем видимость оверлеев в зависимости от состояния selected
      updateOverlayVisibility(lastHeroUl, hero.selected);

      // Универсальная функция для добавления/удаления лейбла "DEL"
      updateDelLabel(lastHeroUl, currentLastHero.deleted);
      updatePortraits(startHeroes);

      // Сохраняем обновленный currentLastHeroes в localStorage
      saveLastHeroesToLocalStorage();
      saveStartHeroesToLocalStorage();
   }
}

export function updateOverlayVisibility(lastHeroUl, selected) {
   const deleteOverlay = lastHeroUl.querySelector(".last-heroes__delete-hero");
   const returnOverlay = lastHeroUl.querySelector(".last-heroes__return-hero");

   if (selected) {
      deleteOverlay.style.opacity = 1; // Показываем "Удалить?"
      returnOverlay.style.opacity = 0; // Скрываем "Вернуть?"
   } else {
      deleteOverlay.style.opacity = 0; // Скрываем "Удалить?"
      returnOverlay.style.opacity = 1; // Показываем "Вернуть?"
   }
}

export function renderLastHero() {
   const lastHeroItem = lastHeroTemplate.cloneNode(true);
   const lastHeroUl = lastHeroItem.querySelector(".last-heroes__item");
   lastHeroUl.style.backgroundImage = `url("./assets/heroes/${chosenHero.image}")`;

   // Добавляем атрибут data-hero-name к элементу
   lastHeroUl.dataset.heroName = chosenHero.name;

   // Проверяем, был ли герой выбран
   const isDeleted = !chosenHero.selected;

   // Добавляем нового героя в начало массива currentLastHeroes с параметром deleted
   currentLastHeroes.unshift({
      name: chosenHero.name,
      image: chosenHero.image,
      deleted: isDeleted,
   });

   // Если длина массива больше 16, удаляем самого старого героя
   if (currentLastHeroes.length > 16) {
      currentLastHeroes.pop();
   }

   // Добавляем на страницу нового героя с задержкой
   lastHeroesList.prepend(lastHeroItem);

   // Если на странице больше 16 элементов, удаляем последний (старый) элемент
   if (lastHeroesList.children.length > 16) {
      lastHeroesList.removeChild(lastHeroesList.lastElementChild);
   }

   // Устанавливаем opacity оверлеев в зависимости от значения selected
   updateOverlayVisibility(lastHeroUl, !isDeleted); // Передаем true, если selected

   // Универсальная функция для добавления/удаления лейбла "DEL"
   updateDelLabel(lastHeroUl, isDeleted);

   // Добавляем обработчик клика для карточки героя
   lastHeroUl.addEventListener("click", () => {
      handleHeroClick(lastHeroUl);
   });
}

export function showHeroWindow() {
   showHeroBoxButtons.style.opacity = "1";
   showHeroBoxButtons.style.pointerEvents = "all";
   openPopup(showHeroBox);
   // setTimeout(() => openPopup(showHeroBox), 6500);
   // setTimeout(() => showHeroBox.classList.remove("popup_is-opened"), 15750);
}

export function animateHeroSelection() {
   // clearHeroStyles();
   showOverlay();
   markAllHeroesNotInvolved(startHeroes);
   // chooseFinalHero(startHeroes);
   movePageElement(headerOfPage, "header__moved");
   movePageElement(lastHeroesBox, "last-box__moved");
   movePageElement(portraitsListButtons, "buttons-bar__moved");
   movePageElement(portraitsListBox, "portraits-list__box__moved");
   // Выбираем все элементы с классом .portraits-list__title
   const allTitles = portraitsListBox.querySelectorAll(
      ".portraits-list__title"
   );

   // Функция для добавления класса к каждому элементу
   allTitles.forEach((title) => {
      movePageElement(title, "portraits-list__title__moved");
   });
   
}

let totalDuration; // Глобальная переменная для общей длительности
export const showHeroWindowDelay = 10500; // 5750
export const addShowHeroDataDelay = totalDuration; // 5750
export const enableChooseButtonDelay = totalDuration;

// Функция для очистки всех стилей
function clearHeroStyles() {
   const heroes = portraitsListBox.querySelectorAll("[data-hero-name]");
   heroes.forEach((heroElement) => {
      // Удаляем классы с самого heroElement
      heroElement.classList.remove(
         "selectable__random-not-involved",
         "selectable__random-involved",
         "selectable__random-not-involved-banned",
         "selectable__last-pre-final",
         "selectable__last-final"
      );

      // Находим элемент с классом .card-portrait-image-box и удаляем классы
      const imageBox = heroElement.querySelector(".card-portrait-image-box");
      if (imageBox) {
         imageBox.classList.remove(
            "selectable__random-involved-image",
            "selectable__random-not-involved-image",
            "selectable__random-not-involved-banned-overlay",
            "selectable__last-pre-final-image",
            "selectable__last-pre-final-image__sparking",
            "selectable__last-final-image"
         );
      }

      // Находим элемент с классом .banned-overlay и удаляем класс
      const imageBoxBannedOverlay =
         heroElement.querySelector(".banned-overlay");
      if (imageBoxBannedOverlay) {
         imageBoxBannedOverlay.classList.remove("banned-overlay-invisible");
      }
   });
}

export function movePageElement(element, animatedClass) {
   element.classList.add(animatedClass);
}

export function returnPageElement(element, animatedClass, delay) {
   setTimeout(() => {
      element.classList.remove(animatedClass);
   }, delay);
}

// Функция для добавления класса всем героям
function markAllHeroesNotInvolved(heroesList) {
   heroesList.forEach((hero) => {
      const heroElement = portraitsListBox.querySelector(
         `[data-hero-name="${hero.name}"]`
      );
      if (heroElement) {
         // Добавляем класс невыбранных героев
         heroElement.classList.add("selectable__random-not-involved");

         // Находим элемент с классом .card-portrait-image-box
         const imageBox = heroElement.querySelector(".card-portrait-image-box");
         const imageBoxBannedOverlay =
            heroElement.querySelector(".banned-overlay");
         if (imageBox) {
            imageBox.classList.add("selectable__random-not-involved-image");

            // Если selected === false, добавляем класс selectable__random-not-involved-banned-overlay
            if (!hero.selected) {
               heroElement.classList.add(
                  "selectable__random-not-involved-banned"
               );
               imageBoxBannedOverlay.classList.add("banned-overlay-invisible");
            }
         }
      }
   });
}

function makeDefaultPageElementsStyle() {
   returnPageElement(headerOfPage, "header__moved", 800);
   returnPageElement(lastHeroesBox, "last-box__moved", 800);
   returnPageElement(portraitsListButtons, "buttons-bar__moved", 800);
   returnPageElement(portraitsListBox, "portraits-list__box__moved", 500);
}

// Функция для получения случайных героев
function getRandomHeroPackages(heroesList, heroesPerPacket, packetCount) {
   const selectedHeroes = heroesList.filter((hero) => hero.selected); // Выбираем только тех героев, у которых selected: true
   const heroPackages = []; // Массив для пакетов героев

   for (let i = 0; i < packetCount; i++) {
      const randomHeroes = [];
      const heroesCopy = [...selectedHeroes]; // Копируем список героев

      // Для каждого пакета выбираем случайных героев
      for (let j = 0; j < heroesPerPacket; j++) {
         const randomIndex = Math.floor(Math.random() * heroesCopy.length);
         randomHeroes.push(heroesCopy.splice(randomIndex, 1)[0]);
      }

      heroPackages.push(randomHeroes); // Добавляем пакет героев в массив
   }

   return heroPackages; // Возвращаем массив пакетов героев
}

// Функция для изменения переменной --selectable-random-animation-duration
function setAnimationDuration(durationInSeconds) {
   const element = document.documentElement; // Применяем ко всему документу (если анимация глобальная)
   element.style.setProperty(
      "--selectable-random-animation-duration",
      `${durationInSeconds/ 500}s`
   ); // Преобразуем миллисекунды в секунды
}

// Функция для изменения времени transition в зависимости от highlightDuration
function setTransitionDuration(durationInSeconds) {
   // Предполагаем, что элемент с transition это весь document или конкретный элемент
   document.documentElement.style.setProperty(
      "--selectable-random-selectable-cards-transition-duration",
      `${durationInSeconds / 500}s`
   );
}

// Функция для подсветки одного пакета героев
function highlightHeroPacket(
   heroPacket,
   highlightDuration,
   specialHero = null
) {
   // Устанавливаем длительность анимации перед началом подсветки
   setAnimationDuration(highlightDuration);
   setTransitionDuration(highlightDuration);

   heroPacket.forEach((hero) => {
      const heroElement = portraitsListBox.querySelector(
         `[data-hero-name="${hero.name}"]`
      );

      if (heroElement) {
         // Если это особый герой, применяем другие стили
         if (specialHero && hero.name === specialHero.name) {
            heroElement.classList.remove("selectable__random-not-involved");
            heroElement.classList.add("selectable__last-pre-final");

            const imageBox = heroElement.querySelector(
               ".card-portrait-image-box"
            );
            if (imageBox) {
               imageBox.classList.remove(
                  "selectable__random-not-involved-image"
               );
               imageBox.classList.add("selectable__last-pre-final-image");
               imageBox.classList.add("selectable__last-pre-final-image__sparking");
            }
         } else {
            // Обычные стили для обычных героев
            heroElement.classList.remove("selectable__random-not-involved");
            heroElement.classList.add("selectable__random-involved");

            const imageBox = heroElement.querySelector(
               ".card-portrait-image-box"
            );
            if (imageBox) {
               imageBox.classList.remove(
                  "selectable__random-not-involved-image"
               );
               imageBox.classList.add("selectable__random-involved-image");
            }
         }
      }
   });

   // Убираем подсветку только для обычных героев через указанное время
   setTimeout(() => {
      heroPacket.forEach((hero) => {
         const heroElement = portraitsListBox.querySelector(
            `[data-hero-name="${hero.name}"]`
         );

         if (heroElement && (!specialHero || hero.name !== specialHero.name)) {
            // Удаляем стили только для обычных героев
            heroElement.classList.add("selectable__random-not-involved");
            heroElement.classList.remove("selectable__random-involved");

            const imageBox = heroElement.querySelector(
               ".card-portrait-image-box"
            );
            if (imageBox) {
               imageBox.classList.add("selectable__random-not-involved-image");
               imageBox.classList.remove("selectable__random-involved-image");
            }
         }
      });
   }, highlightDuration);
}

// Функция запуска одной фазы с Promise
async function runPhase(
   heroesList,
   heroesPerPacket,
   packetCount,
   phaseDuration,
   hasChosenHero = false, // Новый параметр
   randomHero = null // Новый параметр (randomHeroes[i])
) {
   let highlightDuration = phaseDuration / packetCount;
   const heroPackages = getRandomHeroPackages(
      heroesList,
      heroesPerPacket,
      packetCount
   ); // Получаем пакеты героев
   const packetInterval = highlightDuration; // Время смены пакета

   // Если выбранный герой должен быть добавлен в последний пакет, то этот пакет должен содержать только его
   if (hasChosenHero && randomHero) {
      // Очищаем последний пакет и добавляем только randomHero
      heroPackages[heroPackages.length - 1] = [randomHero];
   }

   for (let i = 0; i < packetCount; i++) {
      setTimeout(() => {
         highlightHeroPacket(heroPackages[i], highlightDuration, randomHero); // Передаем randomHero
      }, i * packetInterval); // Каждый пакет через равные промежутки времени
   }

   await new Promise((resolve) => setTimeout(resolve, phaseDuration));

   // Добавляем длительность текущей фазы в глобальную переменную
   totalDuration += phaseDuration;

   // Возвращаем обновленный список героев
   return heroesList;
}

//
//
async function runPhaseBoth(
   heroesList,
   heroesPerPacket,
   packetCount,
   highlightDuration,
   hasChosenHero = false, // Новый параметр
   randomHero = null // Новый параметр (randomHeroes[i])
) {
   let phaseDuration = highlightDuration * packetCount;
   const heroPackages = getRandomHeroPackages(
      heroesList,
      heroesPerPacket,
      packetCount
   ); // Получаем пакеты героев
   const packetInterval = highlightDuration; // Время смены пакета

   // Если выбранный герой должен быть добавлен, включаем его в последний пакет
   if (hasChosenHero && randomHero) {
      heroPackages[heroPackages.length - 1].push(randomHero);
   }

   for (let i = 0; i < packetCount; i++) {
      setTimeout(() => {
         highlightHeroPacket(heroPackages[i], highlightDuration, randomHero); // Передаем randomHero
      }, i * packetInterval); // Каждый пакет через равные промежутки времени
   }

   await new Promise((resolve) => setTimeout(resolve, phaseDuration));

   // Добавляем длительность текущей фазы в глобальную переменную
   totalDuration += phaseDuration;

   // Возвращаем обновленный список героев
   return heroesList;
}
//
//

// Функция запуска финальной фазы с выбранным героем
async function runFinalHero(chosenHero, highlightDuration) {
   let phaseDuration = highlightDuration;

   // console.log(`Подсвечиваем выбранного героя: ${chosenHero.name}`);

   // Подсвечиваем выбранного героя
   const heroElement = portraitsListBox.querySelector(
      `[data-hero-name="${chosenHero.name}"]`
   );

   if (heroElement) {
      // Убираем класс невыбранных и добавляем класс подсвеченного
      heroElement.classList.remove("selectable__random-not-involved");
      heroElement.classList.add("selectable__last-final");

      // Работаем с элементом .card-portrait-image-box
      const imageBox = heroElement.querySelector(".card-portrait-image-box");
      if (imageBox) {
         imageBox.classList.remove("selectable__random-not-involved-image");
         imageBox.classList.add("selectable__last-final-image");
      }

      // Убираем подсветку через указанное время
      setTimeout(() => {
         heroElement.classList.remove("selectable__last-final");
         heroElement.classList.add("selectable__random-not-involved");

         if (imageBox) {
            imageBox.classList.remove("selectable__last-final-image");
            imageBox.classList.add("selectable__random-not-involved-image");
         }
      }, highlightDuration);
   }

   // Ждем завершения фазы
   await new Promise((resolve) => setTimeout(resolve, phaseDuration));

   // Добавляем длительность текущей фазы в глобальную переменную
   totalDuration += phaseDuration;
   // console.log(
   //    `Финальная фаза завершена. Текущая суммарная длительность: ${totalDuration}`
   // );
}

// Запуск всех фаз
export async function runAllPhases(heroesList, selectedHeroes, randomHeroes) {
   // Фильтруем героев по selected === true
   // const selectedHeroes = filterSelectedHeroes(heroesList);

   totalDuration = 0;
   // Очищаем все стили перед началом
   // clearHeroStyles();

   // Сначала всем героям добавляем класс selectable__random-not-involved
   markAllHeroesNotInvolved(heroesList);

   // // Подсвечиваем и удаляем по одному герою
   // await runHeroWithHero(selectedHeroes, 1, 3, 1200, 0, randomHeroes);
   // selectedHeroes = selectedHeroes.filter(
   //    (hero) => hero.name !== randomHeroes[0].name
   // ); // Удаление героя

   // await runPhase(selectedHeroes, 15, 5, 100); // Фаза 1
   // await runPhase(selectedHeroes, 12, 3, 167); // Фаза 1
   // await runPhase(selectedHeroes, 10, 4, 500, true, randomHeroes[0]);
   // selectedHeroes = selectedHeroes.filter(
   //    (hero) => hero.name !== randomHeroes[0].name
   // );
   // await runPhase(selectedHeroes, 6, 4, 500, true, randomHeroes[1]);
   // selectedHeroes = selectedHeroes.filter(
   //    (hero) => hero.name !== randomHeroes[1].name
   // );
   // await runPhase(selectedHeroes, 2, 4, 500, true, randomHeroes[2]);
   // selectedHeroes = selectedHeroes.filter(
   //    (hero) => hero.name !== randomHeroes[2].name
   // );
   // await runPhase(selectedHeroes, 1, 4, 500, true, randomHeroes[3]);
   // selectedHeroes = selectedHeroes.filter(
   //    (hero) => hero.name !== randomHeroes[3].name
   // );
   await runPhase(selectedHeroes, 8, 11, 1000); // Фаза 1
   await runPhase(selectedHeroes, 4, 10, 1000); // Фаза 1
   await runPhase(selectedHeroes, 2, 9, 1000); // Фаза 1
   await runPhase(selectedHeroes, 1, 8, 1000, true, randomHeroes[0]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[0].name
   );
   await runPhase(selectedHeroes, 1, 8, 1000, true, randomHeroes[1]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[1].name
   );
   await runPhase(selectedHeroes, 1, 8, 1000, true, randomHeroes[2]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[2].name
   );
   await runPhase(selectedHeroes, 1, 8, 1000, true, randomHeroes[3]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[3].name
   );

   // await runPhase(selectedHeroes, 12, 5, 60); // Фаза 1
   // await runPhase(selectedHeroes, 10, 5, 80); // Фаза 2
   // await runPhase(selectedHeroes, 8, 5, 100); // Фаза 3
   // await runPhase(selectedHeroes, 6, 5, 120); // Фаза 4
   // await runPhase(selectedHeroes, 4, 5, 160); // Фаза 5
   // await runPhase(selectedHeroes, 2, 5, 200); // Фаза 6
   // await runPhase(selectedHeroes, 1, 5, 260); // Фаза 7
   // await runPhase(selectedHeroes, 1, 4, 320); // Фаза 8
   // await runPhase(selectedHeroes, 1, 3, 400); // Фаза 9
   // await runPhase(selectedHeroes, 1, 2, 480); // Фаза 10
   // await runPhase(selectedHeroes, 1, 1, 600);  // Фаза 10 (по желанию)
   // await runPhase(selectedHeroes, 1, 1, 720);  // Фаза 10 (по желанию)

   // Запуск финальной фазы с выбранным героем
   await runFinalHero(chosenHero, 1111000); // Длительность подсветки финального героя

   hideOverlay(1000);
   makeDefaultPageElementsStyle();
   clearHeroStyles();

   console.log("Общая длительность всех фаз: ", totalDuration);
}

export function filterSelectedHeroes(heroesList) {
   return heroesList.filter((hero) => hero.selected === true);
}

// Оверлей для визуализации
function showOverlay() {
   globalOverlay.classList.add("global-overlay__visible");
}

function hideOverlay(extraTime) {
   setTimeout(() => {
      console.log(`Оверлей скрыт через ${extraTime} миллисекунд`);
      globalOverlay.classList.remove("global-overlay__visible");
   }, extraTime);
}

///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---

export function getRandomHeroes(selectedHeroes) {
   if (selectedHeroes.length < 4) {
      console.log("Недостаточно героев для выбора.");
      return null; // Если героев меньше 4, завершаем выполнение
   }

   // Выбираем 4 случайных героя
   const selectedRandomHeroes = [];
   while (selectedRandomHeroes.length < 4) {
      const randomIndex = Math.floor(Math.random() * selectedHeroes.length);
      const randomHero = selectedHeroes[randomIndex];

      // Проверяем, чтобы герой не был уже выбран
      if (!selectedRandomHeroes.includes(randomHero)) {
         selectedRandomHeroes.push(randomHero);
      }
   }

   console.log(
      "Выбранные 4 героя:",
      selectedRandomHeroes.map((hero) => hero.name).join(", ")
   );
   return selectedRandomHeroes; // Возвращаем массив из 4 выбранных героев
}

export function chooseFinalHero(selectedRandomHeroes) {
   if (!selectedRandomHeroes || selectedRandomHeroes.length === 0) {
      console.log("Не удалось выбрать финального героя.");
      return null;
   }

   // Выбираем финального героя из 4 случайных
   const finalHeroIndex = Math.floor(
      Math.random() * selectedRandomHeroes.length
   );
   const finalHero = selectedRandomHeroes[finalHeroIndex];

   console.log("Финальный герой:", finalHero.name);
   return finalHero; // Возвращаем финального героя
}

function highlightHeroStyle(element, addSelector, removeSelector) {
   if (element) {
      element.classList.add(addSelector);
      element.classList.remove(removeSelector);
   }
}

function toggleStyle(element, action, selector) {
   if (element && (action === "add" || action === "remove")) {
      element.classList[action](selector);
   } else {
      console.error("Invalid action. Use 'add' or 'remove'.");
   }
}
