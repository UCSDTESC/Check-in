const createValidator = () => (values) => {
  const errors = {};

  let required = ['name', 'alias', 'closeTimeMonth', 'closeTimeDay',
    'closeTimeYear', 'email', 'url', 'description', 'logo'];

  const notValid = required.filter(name => !(name in values));
  notValid.forEach(name => errors[name] = 'Required');

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.closeTimeDay < 1 || values.closeTimeDay > 31) {
    errors.closeTimeDay = 'Invalid Day';
  }

  if (values.closeTimeMonth === 'Month' || values.closeTimeMonth < 1 || values.closeTimeMonth > 12) {
    errors.closeTimeMonth = 'Invalid Month';
  }

  if (values.closeTimeYear < 1900 + new Date().getYear()) {
    errors.closeTimeYear = 'Invalid Year';
  }

  return errors;
};

export default createValidator;
