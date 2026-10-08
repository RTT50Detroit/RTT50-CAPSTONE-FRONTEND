export const MINIMUM_AGE = 21;
export const MAXIMUM_AGE = 120;

const pad = (value) => String(value).padStart(2, '0');

export const toDateInputValue = (date) => (
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
);

// Parses a YYYY-MM-DD string as a real calendar date; returns null if invalid.
export const parseDateOfBirth = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;

  return isRealDate ? date : null;
};

export const calculateAge = (dateOfBirth, today = new Date()) => {
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const hadBirthday = today.getMonth() > dateOfBirth.getMonth()
    || (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
};

// Latest and earliest selectable birth dates for the date input.
export const getBirthDateBounds = (today = new Date()) => ({
  max: toDateInputValue(today),
  min: toDateInputValue(new Date(today.getFullYear() - MAXIMUM_AGE, today.getMonth(), today.getDate())),
});

/**
 * Validates a date of birth. Returns { valid, age, reason } where reason is
 * 'required' | 'invalid' | 'future' | 'unrealistic' | 'underage' when invalid.
 */
export const validateDateOfBirth = (value, today = new Date()) => {
  if (!value) return { valid: false, reason: 'required' };

  const date = parseDateOfBirth(value);
  if (!date) return { valid: false, reason: 'invalid' };
  if (date > today) return { valid: false, reason: 'future' };

  const age = calculateAge(date, today);
  if (age > MAXIMUM_AGE) return { valid: false, age, reason: 'unrealistic' };
  if (age < MINIMUM_AGE) return { valid: false, age, reason: 'underage' };

  return { valid: true, age };
};

export const DATE_OF_BIRTH_MESSAGES = {
  required: 'Enter your date of birth.',
  invalid: 'Enter a valid date of birth.',
  future: 'Your date of birth cannot be in the future.',
  unrealistic: 'Enter a valid date of birth.',
  underage: `You must be at least ${MINIMUM_AGE} years old to join The Social Match Game.`,
};
