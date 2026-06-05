import leoProfanity from 'leo-profanity';

// Загружаем русский словарь
leoProfanity.loadDictionary('ru');

// // Добавляем дополнительные слова (опционально)
// const customWords = [
//   // При необходимости добавьте свои слова
// ];

// leoProfanity.add(customWords);

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