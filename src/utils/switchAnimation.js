/**
 * 
 * @param {*} e - element
 * @param {*} a1 - array of classes to add
 * @param {*} a2 - array of classes to remove
 * @param {*} d - delay
 * @param {*} b1 - array of classes to add
 * @param {*} b2 - array of classes to remove
 */
function switchAnimation(e, a1, a2, d, b1, b2) {
    if(!e) return;
    if(!classesArrayIsValid(a1)) return;
    if(!classesArrayIsValid(a2)) return;
    if(!classesArrayIsValid(b1)) return;
    if(!classesArrayIsValid(b2)) return;
    for (let i = 0; i < a1.length; i++) { e.classList.add(a1[i]); }
    for (let i = 0; i < a2.length; i++) { e.classList.remove(a2[i]); }
    setTimeout(() => {
        for (let i = 0; i < b1.length; i++) { e.classList.add(b1[i]); }
        for (let i = 0; i < b2.length; i++) { e.classList.remove(b2[i]); }
    }, d);
}

function classesArrayIsValid(stringArray) {
  if (!Array.isArray(stringArray)) {
    console.error("Помилка: Вхідний аргумент повинен бути масивом.");
    return false; // Зупиняємо, якщо вхідний аргумент не масив
  }

  for (let i = 0; i < stringArray.length; i++) {
    const inputString = stringArray[i];

    if (typeof inputString !== 'string') {
      console.error(`Помилка: Елемент масиву з індексом ${i} не є рядком.`);
      return false; // Зупиняємо, якщо елемент масиву не є рядком
    }

    if (inputString.includes(" ")) {
      console.error(`Рядок "${inputString}" з індексом ${i} містить пробіл! Проблема з класом або ідентифікатором.`);
      return false; // Повертаємо false, якщо знайдено пробіл
    }
  }
  return true; // Повертаємо true, якщо все гаразд
}