import leoProfanity from 'leo-profanity';

export const initProfanity = () => {
  leoProfanity.loadDictionary('ru');
  leoProfanity.loadDictionary('en');
};

export const containsProfanity = (text) => {
  return leoProfanity.check(text);
};

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return leoProfanity.clean(text);
};

export const validateNoProfanity = (value, t) => {
  if (value && containsProfanity(value)) {
    return t('errors.profanity');
  }
  return undefined;
};

export default {
  initProfanity,
  containsProfanity,
  filterProfanity,
  validateNoProfanity,
};
