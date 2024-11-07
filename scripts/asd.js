const delaysArray = [800, 1000, 1000, 1000, 1000, 1200, 1500, 0]; // для каждого героя своя задержка
   const initialDelay = 800; // Начальная задержка перед началом скрытия героев
   await hideHeroesRandomly(
      randomHeroes,
      delaysArray,
      chosenHero,
      initialDelay
   );

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
      } else {
         console.warn(
            `Hero element or image box not found for hero: ${hero.name}`
         );
      }

      // Ждем время, указанное для текущего элемента в delaysArray
      await new Promise((resolve) => setTimeout(resolve, delaysArray[i]));

      // Увеличиваем счетчик для задержек
      i++;
   }
}