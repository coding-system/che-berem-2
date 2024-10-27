////////////////////////////////////
/////  Диалог списка героев  ///////
////////////////////////////////////
import {
   heroesList,
   // cardHeroTemplate,
   // heroesListcloseButton,
   strengthList,
   agilityList,
   intelligenceList,
   universalList,
   // heroesListButton,
} from "../index.js";

// document.addEventListener("DOMContentLoaded", function () {
//    heroesListButton.addEventListener("click", function () {
//       heroesList.classList.add("popup_is-opened");
//    });

//    heroesListcloseButton.addEventListener("click", function () {
//       heroesList.classList.remove("popup_is-opened");
//    });
// });

function renderHeroes(heroes) {
   // Очищаем списки перед добавлением новых элементов
   strengthList.innerHTML = "";
   agilityList.innerHTML = "";
   intelligenceList.innerHTML = "";
   universalList.innerHTML = "";

   heroes.forEach((hero) => {
      const cardHeroItem = cardHeroTemplate.cloneNode(true); // Клонируем шаблон для каждого героя
      const cardHeroButton = cardHeroItem.querySelector(".card-hero-button");
      const cardBanned = cardHeroItem.querySelector(".banned-overlay");
      const cardLine = cardHeroItem.querySelector(".line");
      cardHeroButton.style.backgroundImage = `url("./assets/heroes/${hero.image}")`;

      cardBanned.style.opacity = "0";
      cardLine.style.opacity = "0";

      // Обновляем отображение стилей в зависимости от состояния hero.selected
      updateHeroDisplay(hero, cardBanned, cardLine);

      cardHeroButton.addEventListener("click", () => {
         hero.selected = !hero.selected;
         updateHeroDisplay(hero, cardBanned, cardLine);
         console.log(`${hero.name} => ${hero.selected}`);
      });

      switch (hero.attribute) {
         case "strength":
            strengthList.appendChild(cardHeroItem);
            break;
         case "agility":
            agilityList.appendChild(cardHeroItem);
            break;
         case "intelligence":
            intelligenceList.appendChild(cardHeroItem);
            break;
         case "universal":
            universalList.appendChild(cardHeroItem);
            break;
      }
   });

   // Функция обновления отображения героя
   function updateHeroDisplay(hero, cardBanned, cardLine) {
      if (hero.selected) {
         cardBanned.style.opacity = "0";
         cardLine.style.opacity = "0";
      } else {
         cardBanned.style.opacity = "1";
         cardLine.style.opacity = "1";
      }
   }

   // Функция массового изменения состояния героев
   function updateAllHeroes(selectAll = true) {
      heroes.forEach((hero) => {
         hero.selected = selectAll;
      });

      // Обновляем отображение всех героев
      heroes.forEach((hero) => {
         let cardHeroItem;
         switch (hero.attribute) {
            case "strength":
               cardHeroItem = Array.from(strengthList.children).find((item) =>
                  item
                     .querySelector(".card-hero-button")
                     .style.backgroundImage.includes(hero.image)
               );
               break;
            case "agility":
               cardHeroItem = Array.from(agilityList.children).find((item) =>
                  item
                     .querySelector(".card-hero-button")
                     .style.backgroundImage.includes(hero.image)
               );
               break;
            case "intelligence":
               cardHeroItem = Array.from(intelligenceList.children).find(
                  (item) =>
                     item
                        .querySelector(".card-hero-button")
                        .style.backgroundImage.includes(hero.image)
               );
               break;
            case "universal":
               cardHeroItem = Array.from(universalList.children).find((item) =>
                  item
                     .querySelector(".card-hero-button")
                     .style.backgroundImage.includes(hero.image)
               );
               break;
         }

         if (cardHeroItem) {
            const cardBanned = cardHeroItem.querySelector(".banned-overlay");
            const cardLine = cardHeroItem.querySelector(".line");
            updateHeroDisplay(hero, cardBanned, cardLine);
         }
      });
   }

   const selectAllButton = heroesList.querySelector(".select-all");
   const banAllButton = heroesList.querySelector(".ban-all");
   // Выбор всех героев
   selectAllButton.addEventListener("click", () => updateAllHeroes(true));

   // Бан всех героев
   banAllButton.addEventListener("click", () => updateAllHeroes(false));
}

export { renderHeroes };
