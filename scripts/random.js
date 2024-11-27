import { initialHeroes } from "./heroes.js";
import {
   windowList,
   lastHeroesList,
   songChanger,
   rouletteSong,
   startHeroes,
   saveChosenIndexToLocalStorage,
   saveLastHeroesToLocalStorage,
   saveStartHeroesToLocalStorage,
   currentLastHeroes,
   songChangerStatus,
   chooseButton,
   chooseButtonText,
   btnTop,
   btnBottom,
   // getInitialHeroes,
   // reloadStartHeroes
} from "../index.js";
import {
   showHeroWindowDelay,
   addShowHeroDataDelay,
   enableChooseButtonDelay,
   animateHeroSelection,
   showHeroWindow,
   getRandomHeroes,
   getRandomHeroesElements,
   chooseFinalHero,
   runAllPhases,
   filterSelectedHeroes,
   findFinalHeroElement,
} from "./rolling.js";
import { addShowHeroData } from "./showhero.js";
import { updatePortraits } from "./portraits.js";
import { lastHeroes } from "./lastheroes.js";
import { songslist } from "./songslist.js";

// export let currentSelectableHeroes = []; // Глобальная переменная
// export let chosenIndex;
export let chosenHero;
export let totalTime;

function disableChooseButton() {
   chooseButton.disabled = true;
   // chooseButtonText.textContent = "ROLLING";

   // btnTop.style.setProperty("--color1", "#919191"); // Новый первый цвет
   // btnTop.style.setProperty("--color2", "#707070"); // Новый второй цвет
   // btnBottom.style.setProperty("--color3", "#3c3c3c"); // Новый второй цвет
}

function enableChooseButton() {
   chooseButton.disabled = false;
   // chooseButtonText.textContent = "ROLL";

   // btnTop.style.setProperty("--color1", "#cd3f64"); // Новый первый цвет
   // btnTop.style.setProperty("--color2", "#9d3656"); // Новый второй цвет
   // btnBottom.style.setProperty("--color3", "#803"); // Новый второй цвет
}

export function deleteChosenHero(chosenHero) {
   if (chosenHero) {
      // Проверяем, был ли выбран герой
      const heroIndex = startHeroes.findIndex(
         (hero) => hero.name === chosenHero.name
      );
      if (heroIndex !== -1) {
         startHeroes[heroIndex].selected = false; // Меняем selected на false
         console.log(`Герой ${chosenHero.name} удален из выборки`);
      }
   }
}

export let selectedRandomHeroesElements;
export let randomHeroElement;

function selectRandomSong(songList, audioElementId) {
   if (!songList || songList.length === 0) {
      console.log("Список песен пуст");
      return;
   }

   // Выбираем случайную песню
   const randomIndex = Math.floor(Math.random() * songList.length);
   const randomSong = songList[randomIndex].link;

   // Находим аудио элемент
   const audioElement = document.getElementById(audioElementId);
   if (audioElement) {
      const sourceElement = audioElement.querySelector("source");
      if (sourceElement) {
         sourceElement.src = `./assets/sounds/${randomSong}`;
         audioElement.load();
      }
   }

   console.debug(`Выбрана случайная песня: ${randomSong}`);
}

function getRandomElement(heroesArray) {
   disableChooseButton();
   stopAudio();
   setTimeout(() => playAudio(rouletteSong), 500);

   const selectableHeroes = filterSelectedHeroes(heroesArray); // Фильтруем сразу

   if (selectableHeroes.length === 0) {
      console.log("Список героев для выборки пуст");
      resetHeroes(heroesArray);
      return;
   }

   // Выбираем 4 случайных героя
   const selectedRandomHeroes = getRandomHeroes(selectableHeroes, 10); // Используем отфильтрованных героев

   if (!selectedRandomHeroes) {
      console.log("Не удалось выбрать 4 героев.");
      return;
   }

   // Ищем HTML-элементы для выбранных героев
   selectedRandomHeroesElements = getRandomHeroesElements(selectedRandomHeroes);

   if (selectedRandomHeroesElements.length === 0) {
      console.log("Не удалось найти HTML элементы для выбранных героев.");
      return;
   }

   // Теперь выбираем финального героя из этих 4
   const randomHero = chooseFinalHero(selectedRandomHeroes);
   randomHeroElement = findFinalHeroElement(
      selectedRandomHeroesElements,
      randomHero
   );

   console.log(`Имя выбранного финального героя`, randomHero.name);

   // saveChosenIndexToLocalStorage(randomHero);

   selectRandomSong(songslist, "myAudio");

   // currentSelectableHeroes = selectableHeroes;
   chosenHero = randomHero; // Назначаем выбранного финального героя как chosenHero

   animateHeroSelection();
   setTimeout(async () => {
      try {
         await runAllPhases(
            heroesArray,
            selectableHeroes,
            selectedRandomHeroes
         );
         addShowHeroData(); // Вместо setTimeout
         showHeroWindow(); // Вызывается сразу после завершения runAllPhases
         enableChooseButton(); // Вместо setTimeout
      } catch (error) {
         console.error("Ошибка при выполнении фаз:", error);
      }
   }, 500);
}

function playAudio(songElement) {
   songElement.play();
}

export function stopAudio() {
   rouletteSong.pause();
   rouletteSong.currentTime = 0;
}

function resetHeroes(heroesArray) {
   stopAudio();

   // Сбрасываем массив startHeroes, копируя заново массив initialHeroes
   heroesArray.length = 0;
   heroesArray.push(...JSON.parse(JSON.stringify(initialHeroes)));

   // Сбрасываем массив currentLastHeroes к начальному состоянию
   currentLastHeroes.length = 0;
   currentLastHeroes.push(...JSON.parse(JSON.stringify(lastHeroes))); // Глубокая копия lastHeroes

   // Сохраняем текущие lastHeroes
   saveLastHeroesToLocalStorage();
   saveStartHeroesToLocalStorage();

   // Сброс интерфейса
   // windowList.innerHTML = "";
   lastHeroesList.innerHTML = "";

   // Перерендерим героев
   // renderDefaultHeroesList(heroesArray);
   updatePortraits(heroesArray);
   enableChooseButton();

   console.log(`———————————————————————————————————————`);
   console.log("Список героев сброшен");
}

export { getRandomElement, resetHeroes };
