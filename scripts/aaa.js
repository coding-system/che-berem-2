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
   // chooseFinalHero(startHeroes);
   movePageElement(headerOfPage, "header__moved");
   movePageElement(lastHeroesBox, "last-box__moved");
   movePageElement(portraitsListButtons, "buttons-bar__moved");
   movePageElement(portraitsListBox, "portraits-list__box__moved");
   showOverlay();
   markAllHeroesNotInvolved(startHeroes);
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
         "selectable__last-final",
         "selectable__last-pre-final"
      );

      // Находим элемент с классом .card-portrait-image-box и удаляем классы
      const imageBox = heroElement.querySelector(".card-portrait-image-box");
      if (imageBox) {
         imageBox.classList.remove("selectable__random-involved-image");
         imageBox.classList.remove("selectable__random-not-involved-image");
         imageBox.classList.remove(
            "selectable__random-not-involved-banned-overlay"
         );
         imageBox.classList.remove(
            "selectable__last-final-image",
            "selectable__last-pre-final-image"
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
//banned-overlay

// Функция для получения случайных пакетов героев
function getRandomHeroPackages(heroesList, heroesPerPacket, packetCount) {
   const heroPackages = [];

   for (let i = 0; i < packetCount; i++) {
      const selectedHeroes = [];
      const availableHeroes = [...heroesList]; // Создаем копию списка

      for (let j = 0; j < heroesPerPacket; j++) {
         const randomIndex = Math.floor(Math.random() * availableHeroes.length);
         const hero = availableHeroes.splice(randomIndex, 1)[0]; // Извлекаем случайного героя
         selectedHeroes.push(hero);
      }

      heroPackages.push(selectedHeroes);
   }

   return heroPackages;
}

// Функция для изменения переменной --selectable-random-animation-duration
function setAnimationDuration(durationInSeconds) {
   const element = document.documentElement; // Применяем ко всему документу (если анимация глобальная)
   element.style.setProperty(
      "--selectable-random-animation-duration",
      `${durationInSeconds}s`
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
function highlightHeroPacket(heroPacket, highlightDuration) {
   // Устанавливаем длительность анимации
   setAnimationDuration(highlightDuration);
   setTransitionDuration(highlightDuration);

   // Проходим по каждому герою в пакете
   heroPacket.forEach((hero) => {
      const heroElement = portraitsListBox.querySelector(
         `[data-hero-name="${hero.name}"]`
      );
      if (heroElement) {
         heroElement.classList.remove("selectable__random-not-involved");
         heroElement.classList.add("selectable__random-involved");

         // Работаем с элементом .card-portrait-image-box
         const imageBox = heroElement.querySelector(".card-portrait-image-box");
         if (imageBox) {
            imageBox.classList.remove("selectable__random-not-involved-image");
            imageBox.classList.add("selectable__random-involved-image");
         }
      }
   });

   // Убираем подсветку через указанное время
   setTimeout(() => {
      heroPacket.forEach((hero) => {
         const heroElement = portraitsListBox.querySelector(
            `[data-hero-name="${hero.name}"]`
         );
         if (heroElement) {
            heroElement.classList.add("selectable__random-not-involved");
            heroElement.classList.remove("selectable__random-involved");

            const imageBox = heroElement.querySelector(".card-portrait-image-box");
            if (imageBox) {
               imageBox.classList.add("selectable__random-not-involved-image");
               imageBox.classList.remove("selectable__random-involved-image");
            }
         }
      });
   }, highlightDuration);
}

// Функция для подсветки последнего пакета героев, где один герой остается подсвеченным
function highlightLastHeroPacket(heroPacket, highlightDuration, specialHero) {
   // Устанавливаем длительность анимации
   setAnimationDuration(highlightDuration);
   setTransitionDuration(highlightDuration);

   // Подсвечиваем всех героев в пакете
   heroPacket.forEach((hero) => {
      const heroElement = portraitsListBox.querySelector(
         `[data-hero-name="${hero.name}"]`
      );
      if (heroElement) {
         heroElement.classList.remove("selectable__random-not-involved");
         heroElement.classList.add("selectable__random-involved");

         const imageBox = heroElement.querySelector(".card-portrait-image-box");
         if (imageBox) {
            imageBox.classList.remove("selectable__random-not-involved-image");
            imageBox.classList.add("selectable__random-involved-image");
         }
      }
   });

   // Обрабатываем специального героя отдельно
   const specialHeroElement = portraitsListBox.querySelector(
      `[data-hero-name="${specialHero.name}"]`
   );
   if (specialHeroElement) {
      specialHeroElement.classList.add("selectable__last-pre-final");
      specialHeroElement.classList.remove("selectable__random-involved");

      const imageBox = specialHeroElement.querySelector(".card-portrait-image-box");
      if (imageBox) {
         imageBox.classList.add("selectable__last-pre-final-image");
         imageBox.classList.remove("selectable__random-involved-image");
      }
   }

   // Убираем подсветку у обычных героев, но не у специального героя
   setTimeout(() => {
      heroPacket.forEach((hero) => {
         if (hero.name !== specialHero.name) {
            const heroElement = portraitsListBox.querySelector(
               `[data-hero-name="${hero.name}"]`
            );
            if (heroElement) {
               heroElement.classList.add("selectable__random-not-involved");
               heroElement.classList.remove("selectable__random-involved");

               const imageBox = heroElement.querySelector(".card-portrait-image-box");
               if (imageBox) {
                  imageBox.classList.add("selectable__random-not-involved-image");
                  imageBox.classList.remove("selectable__random-involved-image");
               }
            }
         }
      });
   }, highlightDuration);
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

// Функция запуска одной фазы с подсветкой случайных пакетов и фильтрацией героев
async function runPhase(
   heroesList,            // Список героев, переданных в фазу
   heroesPerPacket,       // Количество героев в каждом пакете
   packetCount,           // Количество пакетов в фазе
   highlightDuration,     // Длительность подсветки
   hasSpecialHero = false, // Есть ли специальный герой
   specialHero = null      // Сам специальный герой
) {
   // let highlightDuration = phaseDuration / packetCount;
   const heroPackages = getRandomHeroPackages(heroesList, heroesPerPacket, packetCount);

   // Подсвечиваем обычные пакеты героев
   for (let i = 0; i < packetCount - 1; i++) {
      highlightHeroPacket(heroPackages[i], highlightDuration);
      await new Promise((resolve) => setTimeout(resolve, highlightDuration));
   }

   // Последний пакет с добавлением специального героя
   const lastHeroPackage = heroPackages[packetCount - 1];
   if (hasSpecialHero && specialHero) {
      lastHeroPackage.push(specialHero);
      highlightLastHeroPacket(lastHeroPackage, highlightDuration, specialHero);

      // Удаляем специального героя из `heroesList` после завершения фазы
      const index = heroesList.findIndex((hero) => hero.name === specialHero.name);
      if (index !== -1) {
         heroesList.splice(index, 1);
      }
   } else {
      highlightHeroPacket(lastHeroPackage, highlightDuration);
   }

   // Завершаем фазу
   await new Promise((resolve) => setTimeout(resolve, highlightDuration));
}

// Функция запуска финальной фазы с выбранным героем
async function runFinalPhase(chosenHero, highlightDuration) {
   let phaseDuration = highlightDuration;
   // let highlightDuration = phaseDuration / packetCount;

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

      // // Убираем подсветку через указанное время
      // setTimeout(() => {
      //    heroElement.classList.remove("selectable__last-final");
      //    heroElement.classList.remove("selectable__last-pre-final");
      //    heroElement.classList.add("selectable__random-not-involved");

      //    if (imageBox) {
      //       imageBox.classList.remove("selectable__last-pre-final-image");
      //       imageBox.classList.remove("selectable__last-final-image");
      //       imageBox.classList.add("selectable__random-not-involved-image");
      //    }
      // }, highlightDuration);
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
   clearHeroStyles();

   // Сначала всем героям добавляем класс selectable__random-not-involved
   markAllHeroesNotInvolved(heroesList);

   // // Подсвечиваем и удаляем по одному герою

   // await runPhase(selectedHeroes, 10, 10, 100, true, randomHeroes[0]);  // Фаза с особым героем
   // await runPhase(selectedHeroes, 8, 8, 100, true, randomHeroes[1]);  // Фаза с особым героем
   // await runPhase(selectedHeroes, 6, 6, 100, true, randomHeroes[2]);  // Фаза с особым героем
   // await runPhase(selectedHeroes, 4, 4, 100, true, randomHeroes[3]);  // Фаза с особым героем
   await runPhase(selectedHeroes, 1, 3, 1000, true, randomHeroes[0]);  // Фаза с особым героем
   await runPhase(selectedHeroes, 1, 3, 1000, true, randomHeroes[1]);  // Фаза с особым героем
   await runPhase(selectedHeroes, 1, 3, 1000, true, randomHeroes[2]);  // Фаза с особым героем
   await runPhase(selectedHeroes, 1, 3, 1000, true, randomHeroes[3]);  // Фаза с особым героем
   // await runPhase(selectedHeroes, 3, 3, 1000); // Фаза 8
   // await runPhase(selectedHeroes, 2, 2, 1000); // Фаза 9
   // await runPhase(selectedHeroes, 1, 1, 1000); // Фаза 10
   // await runPhase(selectedHeroes, 1, 1, 600);  // Фаза 10 (по желанию)
   // await runPhase(selectedHeroes, 1, 1, 720);  // Фаза 10 (по желанию)

   // Запуск финальной фазы с выбранным героем
   // await runFinalPhase(chosenHero, 3000); // Длительность подсветки финального героя

   // hideOverlay(500);
   // returnPageElement(headerOfPage, "header__moved", 800);
   // returnPageElement(lastHeroesBox, "last-box__moved", 800);
   // returnPageElement(portraitsListButtons, "buttons-bar__moved", 800);
   // returnPageElement(portraitsListBox, "portraits-list__box__moved", 500);
   // clearHeroStyles();

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

///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////
///////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////---
//----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////----////

// Функция регистрации информации для отладки
// export function yo(displayedHeroes, currentSelectableHeroes) {
//    console.log(currentSelectableHeroes.length);
//    console.log(currentSelectableHeroes[chosenIndex]);
//    console.log(displayedHeroes);
//    console.log(`Выбранный герой в рулетке - ${displayedHeroes[25]}`);
//    console.log(`Длина начального массива - ${currentSelectableHeroes.length}`);
// }

// // Функция для отображения героев в списке окон
// export function renderHeroesList(displayedHeroes, windowItemsLastWidth) {
//    windowList.innerHTML = "";
//    // windowList.classList.remove("window__list-animated");
//    windowList.classList.remove("rolling-animation");

//    displayedHeroes.forEach((hero, index) => {
//       const windowHeroItem = windowHeroTemplate.cloneNode(true);
//       const windowHeroUl = windowHeroItem.querySelector(".window__item");
//       windowHeroUl.style.backgroundImage = `url("./assets/heroes/${hero}")`;

//       // const windowBox = windowHeroItem.querySelector(".window__box");
//       // windowBox.classList.add(
//       //    windowItemsLastWidth % 2 === 0 ? "window__box-odd" : "window__box-even"
//       // );

//       windowList.appendChild(windowHeroItem);
//    });
// }

// // Функция для генерации случайного изображения героя
// function getRandomHeroImage(currentSelectableHeroes) {
//    const randomIndex = Math.floor(
//       Math.random() * currentSelectableHeroes.length
//    );
//    return currentSelectableHeroes[randomIndex].image;
// }

// // Функция для создания отображаемого массива героев
// let savedDisplayedHeroes = [];

// function generateDisplayedHeroes(
//    totalArrayNumber,
//    displayedHeroIndex,
//    currentSelectableHeroes,
//    chosenIndex
// ) {
//    const displayedHeroes = new Array(totalArrayNumber);

//    // Генерация нового массива displayedHeroes для вывода их в рулетке
//    for (let i = 0; i < displayedHeroes.length; i++) {
//       if (i === displayedHeroIndex) {
//          displayedHeroes[displayedHeroIndex] =
//             currentSelectableHeroes[chosenIndex].image;
//       } else {
//          displayedHeroes[i] = getRandomHeroImage(currentSelectableHeroes);
//       }
//    }

//    // Если есть сохранённые элементы, переназначаем 21-29 элементы
//    if (savedDisplayedHeroes.length > 0) {
//       for (let i = 2; i <= 10; i++) {
//          displayedHeroes[i] = savedDisplayedHeroes[i + 19];
//       }
//    }

//    // Сохранение текущего displayedHeroes для следующего использования
//    savedDisplayedHeroes = [...displayedHeroes];

//    console.log("Ниже новые массивы");
//    console.log(savedDisplayedHeroes);
//    console.log(displayedHeroes);

//    return displayedHeroes;
// }

// // Функция для вычисления ширины последнего элемента
// function calculateLastItemWidth(width) {
//    return Math.floor(Math.random() * width);
// }

// export function renderDefaultHeroesList(arr) {
//    const newArr = [...arr];
//    windowList.innerHTML = "";
//    windowList.classList.remove("rolling-animation");
//    newArr.forEach((hero, index) => {
//       const windowHeroItem = windowHeroTemplate.cloneNode(true);
//       const windowHeroUl = windowHeroItem.querySelector(".window__item");
//       const rand = Math.floor(Math.random() * newArr.length);
//       windowHeroUl.style.backgroundImage = `url("./assets/heroes/${newArr[rand].image}")`;
//       windowList.appendChild(windowHeroItem);
//       windowList.classList.add("default-animation");
//       // windowList.style.transform = `translatex(-72000px)`
//       // windowList.style.transition = `all 700s linear`

//       // savedDisplayedHeroes = [...newArr]
//    });
// }

// export function updateDelLabel(heroElement, isDeleted) {
//    // Проверяем, есть ли уже лейбл "DEL"
//    const existingDelLabel = heroElement.querySelector(".deleted-label");

//    if (isDeleted) {
//       // Если герой удален и лейбла "DEL" нет, добавляем его
//       if (!existingDelLabel) {
//          const deletedLabel = document.createElement("div");
//          deletedLabel.classList.add("deleted-label");
//          // deletedLabel.textContent = "DEL";
//          heroElement.appendChild(deletedLabel);
//       }
//    } else {
//       // Если герой не удален и лейбл существует, удаляем его
//       if (existingDelLabel) {
//          heroElement.removeChild(existingDelLabel);
//       }
//    }
// }

// let previousWindowItemsLastWidth = 0; // Initialize with a default value
// let currentWindowItemsLastWidth = previousWindowItemsLastWidth; // Keep track of the current width during animation
// let itemWidth;

// function animateWindowList(
//    totalWidth,
//    currentWindowItemsLastWidth,
//    extraWidth,
//    previousWindowItemsLastWidth
// ) {
//    windowList.classList.remove("default-animation");
//    const wer = 4 * itemWidth + extraWidth + previousWindowItemsLastWidth;

//    // Log both values for debugging
//    console.log("Current windowItemsLastWidth:", currentWindowItemsLastWidth);
//    console.log("Previous windowItemsLastWidth:", previousWindowItemsLastWidth);

//    windowList.style.transform = `translateX(-${totalWidth}px)`;
//    requestAnimationFrame(() => {
//       windowList.classList.add("rolling-animation");

//       const styleSheet = document.createElement("style");
//       styleSheet.innerHTML = `
//    @keyframes rolling {
//       0% {
//          transform: translateX(-${wer}px);
//       }
//       5% {
//          transform: translateX(-${wer}px);
//       }
//       40% {
//          transform: translateX(0);
//       }
//       100% {
//          transform: translateX(-${totalWidth}px);
//       }
//    }
// `;

//       // Add the new stylesheet to the document
//       windowList.appendChild(styleSheet);
//    });
// }

// export function showHeroes() {
//    const rootStyles = getComputedStyle(document.documentElement);
//    const extraWidth = parseInt(rootStyles.getPropertyValue("--extra-width"));
//    const displayedHeroIndex = 25;
//    const totalArrayNumber = displayedHeroIndex + 4;
//    const windowItemsWidth = document.querySelector(".window__box").offsetWidth;

//    // Generate a new width only after the previous animation is complete
//    currentWindowItemsLastWidth = calculateLastItemWidth(windowItemsWidth);

//    const displayedHeroes = generateDisplayedHeroes(
//       totalArrayNumber,
//       displayedHeroIndex,
//       currentSelectableHeroes,
//       chosenIndex
//    );

//    renderHeroesList(displayedHeroes, currentWindowItemsLastWidth);
//    // renderLastHero();

//    const totalWidth =
//       windowItemsWidth * (displayedHeroIndex - 2) +
//       extraWidth +
//       currentWindowItemsLastWidth;

//    // Pass the current and previous values to the animation
//    animateWindowList(
//       totalWidth,
//       currentWindowItemsLastWidth,
//       extraWidth,
//       previousWindowItemsLastWidth
//    );

//    // Once the animation ends, update the previous value with the current one
//    previousWindowItemsLastWidth = currentWindowItemsLastWidth;
//    itemWidth = windowItemsWidth;
//    // yo(displayedHeroes, currentSelectableHeroes);
// }

// let showHeroTimeoutId;
// function showHeroWindow() {
//    // Если таймер уже был запущен, очищаем его
//    if (showHeroTimeoutId) {
//        clearTimeout(showHeroTimeoutId);
//    }
//    // Запускаем новый таймер и сохраняем его идентификатор
//    showHeroTimeoutId = setTimeout(() => openPopup(showHeroBox), 5750);
// }