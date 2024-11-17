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
   chooseFinalHero,
   runAllPhases,
   filterSelectedHeroes
} from "./rolling.js";
import { addShowHeroData } from "./showhero.js";
import { updatePortraits } from "./portraits.js";
import { lastHeroes } from "./lastheroes.js";

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

function getRandomElement(heroesArray) {
   disableChooseButton();
   stopAudio();

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

   // Теперь выбираем финального героя из этих 4
   const randomHero = chooseFinalHero(selectedRandomHeroes);

   console.log(`Имя выбранного финального героя`, randomHero.name);

   saveChosenIndexToLocalStorage(randomHero);

   // currentSelectableHeroes = selectableHeroes;
   chosenHero = randomHero; // Назначаем выбранного финального героя как chosenHero

   animateHeroSelection();
   setTimeout(() => runAllPhases(heroesArray, selectableHeroes, selectedRandomHeroes), 850); // Передаем heroesArray и отфильтрованных героев
   setTimeout(() => addShowHeroData(), addShowHeroDataDelay);
   setTimeout(() => showHeroWindow(), showHeroWindowDelay);
   setTimeout(() => enableChooseButton(), enableChooseButtonDelay);
   setTimeout(() => playAudio(), 500);
   // playAudio();
}
// sdfsdfs
function playAudio() {
   // if (songChanger.checked) {
   //    rouletteSong.volume = 0.5;
   //    // songChangerStatus = true;
   // } else {
   //    rouletteSong.volume = 0;
   //    // songChangerStatus = false;
   // }
   rouletteSong.play();
}

function stopAudio() {
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
