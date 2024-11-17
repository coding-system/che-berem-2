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
   footerOfPage,
   lastHeroesBox,
   portraitsListButtons,
   clickSound,
   poofSound,
   rouletteSong
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
      console.debug("Selected в startHeroes:", hero.selected);
      console.debug("Deleted в currentLastHeroes:", currentLastHero.deleted);

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
   clearHeroStyles();
   showOverlay();
   markAllHeroesNotInvolved(startHeroes);
   // chooseFinalHero(startHeroes);
   movePageElement(headerOfPage, "header__moved");
   movePageElement(footerOfPage, "footer__moved");
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
export const showHeroWindowDelay = 13500; // 5750
export const addShowHeroDataDelay = 5000; // 5750
export const enableChooseButtonDelay = 8000;

// Функция для очистки всех стилей
export function clearHeroStyles() {
   const heroes = portraitsListBox.querySelectorAll("[data-hero-name]");
   heroes.forEach((heroElement) => {
      // Удаляем классы с самого heroElement
      heroElement.classList.remove(
         "selectable__random-not-involved",
         "selectable__random-involved",
         "selectable__random-not-involved-banned",
         "selectable__last-pre-final",
         "selectable__last-chosen",
         "selectable__last-final",
         "selectable__last-retired",
         "selectable__last-thinking",
         "selectable__last-chosen"
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
            "selectable__last-chosen-image",
            "selectable__last-final-image",
            "selectable__last-retired-image",
            "selectable__last-thinking-image",
            "selectable__last-chosen-image",
            "selectable__last-chosen-image__sparking"
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

export function makeDefaultPageElementsStyle() {
   returnPageElement(headerOfPage, "header__moved", 0);
   returnPageElement(footerOfPage, "footer__moved", 0);
   returnPageElement(lastHeroesBox, "last-box__moved", 0);
   returnPageElement(portraitsListButtons, "buttons-bar__moved", 0);
   returnPageElement(portraitsListBox, "portraits-list__box__moved", 0);
   const allTitles = portraitsListBox.querySelectorAll(
      ".portraits-list__title"
   );

   // Функция для добавления класса к каждому элементу
   allTitles.forEach((title) => {
      returnPageElement(title, "portraits-list__title__moved");
   });
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
      `${durationInSeconds/ 1}ms`
   ); // Преобразуем миллисекунды в секунды
}

// Функция для изменения времени transition в зависимости от highlightDuration
function setTransitionDuration(durationInSeconds) {
   // Предполагаем, что элемент с transition это весь document или конкретный элемент
   document.documentElement.style.setProperty(
      "--selectable-random-selectable-cards-transition-duration",
      `${durationInSeconds / 1}ms`
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
   clickSound.volume = rouletteSong.volume / 3;

   for (let i = 0; i < packetCount; i++) {
      setTimeout(() => {
         // Воспроизведение звука
         clickSound.currentTime = 0; // Сброс времени для повторного проигрывания
         clickSound.play();

         highlightHeroPacket(heroPackages[i], highlightDuration, randomHero); // Передаем randomHero
      }, i * packetInterval); // Каждый пакет через равные промежутки времени
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

// Функция для очистки стилей у всех героев
function clearRandomHeroes(heroes) {
   heroes.forEach(hero => {
      const heroElement = document.querySelector(`[data-hero-name="${hero.name}"]`);
      if (heroElement) {
         const imageBox = heroElement.querySelector('.card-portrait-image-box');

         // Удаляем стили у героя и его изображения
         if (heroElement.classList.contains('selectable__last-pre-final')) {
            heroElement.classList.remove('selectable__last-pre-final');
            heroElement.classList.add('selectable__last-final');
         }
         if (imageBox && imageBox.classList.contains('selectable__last-pre-final-image')) {
            imageBox.classList.remove('selectable__last-pre-final-image');
            imageBox.classList.remove('selectable__last-pre-final-image__sparking');
            imageBox.classList.add('selectable__last-final-image');
            // imageBox.classList.add('selectable__last-thinking__bang');
            // imageBox.classList.add('selectable__last-thinking-image__sparking');
         }
      }
   });
}

export async function runFinalPhase(cycles, phaseDuration, remainingHeroes, heroToRemove, chosenHero) {

   let highlightDuration = phaseDuration / cycles;

   // Проходим ровно cycles раз, при этом чередуем героев из оставшегося списка
   for (let i = 0; i < cycles; i++) {
      const hero = remainingHeroes[i % remainingHeroes.length]; // Выбираем героя по кругу
      const heroElement = document.querySelector(`[data-hero-name="${hero.name}"]`);

      // Проверяем, что элемент героя существует
      if (heroElement) {
         const imageBox = heroElement.querySelector('.card-portrait-image-box');

         // Проверяем наличие imageBox перед применением классов
         if (imageBox) {
            // Подсветка текущего героя (всем оставшимся героям, включая chosenHero)
            heroElement.classList.add("selectable__last-thinking");
            heroElement.classList.remove("selectable__last-final");
            imageBox.classList.add("selectable__last-thinking-image");
            imageBox.classList.remove("selectable__last-final-image");

            // Ожидание завершения подсветки для текущего героя
            await new Promise((resolve) => setTimeout(resolve, highlightDuration));

            // Сброс подсветки
            // heroElement.classList.remove("selectable__last-thinking");
            heroElement.classList.remove("selectable__last-thinking");
            heroElement.classList.add("selectable__last-final");
            // imageBox.classList.remove("selectable__last-thinking-image");
            imageBox.classList.remove("selectable__last-thinking-image");
            imageBox.classList.add("selectable__last-final-image");
         } else {
            console.warn(`Image box not found for hero: ${hero.name}`);
         }
      } else {
         console.warn(`Hero element not found for hero: ${hero.name}`);
      }
   }

   // После завершения циклов помечаем героя для удаления
   const heroElementToRemove = document.querySelector(`[data-hero-name="${heroToRemove.name}"]`);
   if (heroElementToRemove && heroToRemove.name !== chosenHero.name) {
      const imageBoxToRemove = heroElementToRemove.querySelector('.card-portrait-image-box');
      
      if (imageBoxToRemove) {
         // Применяем стили удаления для heroToRemove
         heroElementToRemove.classList.add("selectable__last-retired");
         heroElementToRemove.classList.remove("selectable__last-pre-final");
         heroElementToRemove.classList.remove("selectable__last-final");
         imageBoxToRemove.classList.add("selectable__last-retired-image");
         imageBoxToRemove.classList.remove("selectable__last-pre-fanal-image");
         imageBoxToRemove.classList.remove("selectable__last-pre-final-image__sparking");
         imageBoxToRemove.classList.remove("selectable__last-fanal-image");
      } else {
         console.warn(`Image box not found for hero to remove: ${heroToRemove.name}`);
      }
   }

   // Возвращаем массив героев, исключая удалённого
   return remainingHeroes.filter(hero => hero.name !== heroToRemove.name);
}

// Функция для поочередного скрытия случайных элементов из массива, кроме chosenHero
async function hideHeroesRandomly(
   heroesArray,
   delaysArray,
   chosenHero,
   initialDelay
) {
   // Ждем начальную задержку перед началом скрытия
   await new Promise((resolve) => setTimeout(resolve, initialDelay));

   // Копируем массив и отфильтровываем выбранного героя, чтобы он не скрывался
   let remainingHeroes = heroesArray.filter(
      (hero) => hero.name !== chosenHero.name
   );

   // Проверяем, что длина delaysArray соответствует количеству оставшихся героев
   if (delaysArray.length !== remainingHeroes.length) {
      console.warn(
         "Количество задержек не совпадает с количеством оставшихся героев."
      );
   }

   let i = 0; // Счетчик для индекса задержки

   while (remainingHeroes.length > 0 && i < delaysArray.length) {
      // Случайный индекс для выбора героя
      const randomIndex = Math.floor(Math.random() * remainingHeroes.length);
      const hero = remainingHeroes[randomIndex];

      // Находим элементы героя и imageBox на странице
      const heroElement = portraitsListBox.querySelector(
         `[data-hero-name="${hero.name}"]`
      );
      const imageBox = heroElement?.querySelector(".card-portrait-image-box");

      // Проверяем, что элементы найдены
      if (heroElement && imageBox) {
         // Добавляем классы для скрытия героя и imageBox
         heroElement.classList.add("selectable__last-retired");
         imageBox.classList.add("selectable__last-retired-image");

         // Убираем текущего героя из массива, чтобы он больше не скрывался
         remainingHeroes.splice(randomIndex, 1);

         // Воспроизводим звук клика для текущего героя
         poofSound.volume = rouletteSong.volume / 3;
         poofSound.currentTime = 0; // Сброс времени для повторного проигрывания
         poofSound.play();
      } else {
         console.warn(
            `Hero element or image box not found for hero: ${hero.name}`
         );
      }

      // // Изменяем длительность transition для текущего героя
      // setTransitionDuration(delaysArray[i]);
      // setAnimationDuration(delaysArray[i]); // Устанавливаем длительность анимации

      // Ждем время, указанное для текущего элемента в delaysArray
      await new Promise((resolve) => setTimeout(resolve, delaysArray[i]));

      // Увеличиваем счетчик для задержек
      i++;
   }
}
// dsfsdf







// Функция запуска финальной фазы с выбранным героем
async function runFinalHero(chosenHero, highlightDuration) {
   let phaseDuration = highlightDuration;

   // console.debug(`Подсвечиваем выбранного героя: ${chosenHero.name}`);

   // Подсвечиваем выбранного героя
   const heroElement = portraitsListBox.querySelector(
      `[data-hero-name="${chosenHero.name}"]`
   );

   if (heroElement) {
      // Убираем класс невыбранных и добавляем класс подсвеченного
      heroElement.classList.remove("selectable__random-not-involved");
      heroElement.classList.remove("selectable__last-final");
      heroElement.classList.add("selectable__last-chosen");

      // Работаем с элементом .card-portrait-image-box
      const imageBox = heroElement.querySelector(".card-portrait-image-box");
      if (imageBox) {
         imageBox.classList.remove("selectable__random-not-involved-image");
         imageBox.classList.remove("selectable__last-final-image");
         imageBox.classList.add("selectable__last-chosen-image");
         imageBox.classList.add("selectable__last-chosen-image__sparking");
      }

      // Убираем подсветку через указанное время
      setTimeout(() => {
         heroElement.classList.remove("selectable__last-chosen");
         heroElement.classList.add("selectable__random-not-involved");

         if (imageBox) {
            imageBox.classList.remove("selectable__last-chosen-image");
            imageBox.classList.add("selectable__random-not-involved-image");
         }
      }, highlightDuration);
   }

   // Ждем завершения фазы
   await new Promise((resolve) => setTimeout(resolve, phaseDuration));

   // Добавляем длительность текущей фазы в глобальную переменную
   totalDuration += phaseDuration;
   // console.debug(
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

   // await runPhase(selectedHeroes, 32, 1, 60); // Фаза 1
   // await runPhase(selectedHeroes, 16, 1, 80); // Фаза 1
   // await runPhase(selectedHeroes, 8, 1, 100); // Фаза 1
   // await runPhase(selectedHeroes, 8, 1, 120); // Фаза 1
   // await runPhase(selectedHeroes, 8, 1, 140); // Фаза 1
   // await runPhase(selectedHeroes, 8, 1, 160); // Фаза 1
   // await runPhase(selectedHeroes, 4, 1, 180); // Фаза 1
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[0]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[0].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[1]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[1].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[2]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[2].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[3]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[3].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[4]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[4].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[5]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[5].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[6]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[6].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[7]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[7].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[8]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[8].name
   );
   await runPhase(selectedHeroes, 1, 1, 200, true, randomHeroes[9]);
   selectedHeroes = selectedHeroes.filter(
      (hero) => hero.name !== randomHeroes[9].name
   );

   clearRandomHeroes(randomHeroes);

   // // Создаем массив героев, которые будут удаляться
   // let heroesToRemove = randomHeroes.filter(hero => hero.name !== chosenHero.name);

   // let remainingHeroes;

   // setAnimationDuration(1750/4);
   // setTransitionDuration(1750/4);
   // remainingHeroes = await runFinalPhase(4, 2000, randomHeroes, heroesToRemove[0], chosenHero);
   
   // setAnimationDuration(2000/4);
   // setTransitionDuration(2000/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[1], chosenHero);
   
   // setAnimationDuration(2600/4);
   // setTransitionDuration(2600/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[2], chosenHero);

   // setAnimationDuration(2600/4);
   // setTransitionDuration(2600/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[3], chosenHero);

   // setAnimationDuration(2600/4);
   // setTransitionDuration(2600/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[4], chosenHero);

   // setAnimationDuration(2600/4);
   // setTransitionDuration(2600/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[5], chosenHero);

   // setAnimationDuration(2600/4);
   // setTransitionDuration(2600/4);
   // remainingHeroes = await runFinalPhase(4, 2000, remainingHeroes, heroesToRemove[6], chosenHero);

   // Вызываем функцию для поочередного скрытия героев из randomHeroes, кроме chosenHero
   // await hideHeroesRandomly(randomHeroes, 700, chosenHero, 1000);
   const delaysArray = [845, 845, 845, 845, 845, 845, 1650, 1650, 1650]; // для каждого героя своя задержка
   const initialDelay = 850; // Начальная задержка перед началом скрытия героев
   await hideHeroesRandomly(
      randomHeroes,
      delaysArray,
      chosenHero,
      initialDelay
   );

   // Запуск финальной фазы с выбранным героем
   await runFinalHero(chosenHero, 300); // Длительность подсветки финального героя

   hideOverlay(1000);
   makeDefaultPageElementsStyle();
   clearHeroStyles();

   console.debug("Общая длительность всех фаз: ", totalDuration);
}

export function filterSelectedHeroes(heroesList) {
   return heroesList.filter((hero) => hero.selected === true);
}

// Оверлей для визуализации
function showOverlay() {
   globalOverlay.classList.add("global-overlay__visible");
}

export function hideOverlay(extraTime) {
   setTimeout(() => {
      console.debug(`Оверлей скрыт через ${extraTime} миллисекунд`);
      globalOverlay.classList.remove("global-overlay__visible");
   }, extraTime);
}

///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---

export function getRandomHeroes(selectedHeroes, heroesCount) {
   if (selectedHeroes.length < heroesCount) {
      console.debug("Недостаточно героев для выбора.");
      return null; // Если героев меньше 4, завершаем выполнение
   }

   // Выбираем 4 случайных героя
   const selectedRandomHeroes = [];
   while (selectedRandomHeroes.length < heroesCount) {
      const randomIndex = Math.floor(Math.random() * selectedHeroes.length);
      const randomHero = selectedHeroes[randomIndex];

      // Проверяем, чтобы герой не был уже выбран
      if (!selectedRandomHeroes.includes(randomHero)) {
         selectedRandomHeroes.push(randomHero);
      }
   }

   console.debug(
      "Выбранные герои:",
      selectedRandomHeroes.map((hero) => hero.name).join(", ")
   );
   return selectedRandomHeroes; // Возвращаем массив из 4 выбранных героев
}

export function chooseFinalHero(selectedRandomHeroes) {
   if (!selectedRandomHeroes || selectedRandomHeroes.length === 0) {
      console.debug("Не удалось выбрать финального героя.");
      return null;
   }

   // Выбираем финального героя из 4 случайных
   const finalHeroIndex = Math.floor(
      Math.random() * selectedRandomHeroes.length
   );
   const finalHero = selectedRandomHeroes[finalHeroIndex];

   console.debug("Финальный герой:", finalHero.name);
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
