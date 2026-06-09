import leoProfanity from 'leo-profanity';

// Загружаем английский словарь
leoProfanity.loadDictionary('en');
// Сохраняем английские слова
const englishWords = leoProfanity.list();

// Загружаем русский словарь
leoProfanity.loadDictionary('ru');
// Сохраняем русские слова
const russianWords = leoProfanity.list();

// Создаём объединённый словарь
leoProfanity.clearList(); // очищаем текущий словарь
leoProfanity.add(englishWords); // добавляем английские слова
leoProfanity.add(russianWords); // добавляем русские слова

// Функция для проверки наличия нецензурных слов
export const containsProfanity = (text) => {
  return leoProfanity.check(text);
};

// Функция для замены нецензурных слов на ***
export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return leoProfanity.clean(text);
};

// Функция для валидации (возвращает ошибку, если есть нецензурные слова)
export const validateNoProfanity = (value, t) => {
  if (value && containsProfanity(value)) {
    return t('errors.profanity');
  }
  return undefined;
};

export default {
  containsProfanity,
  filterProfanity,
  validateNoProfanity,
};