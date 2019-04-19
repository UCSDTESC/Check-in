const createValidator = () => (values: any) => {
  const errors: any = {};

  const required = ['name', 'alias', 'closeTimeMonth', 'closeTimeDay',
    'closeTimeYear', 'email', 'homepage', 'description', 'logo'];

  const notValid = required.filter(name => !(name in values));
  notValid.forEach(name => errors[name] = 'Required');

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.closeTimeDay < 1 || values.closeTimeDay > 31) {
    errors.closeTimeDay = 'Invalid Day';
  }

  if (values.closeTimeMonth === 'Month' || values.closeTimeMonth < 1 ||
    values.closeTimeMonth > 12) {
    errors.closeTimeMonth = 'Invalid Month';
  }

  if (values.closeTimeYear < new Date().getFullYear()) {
    errors.closeTimeYear = 'Invalid Year';
  }

  if (values.homepage &&
      (!values.homepage.startsWith('http://') &&
      !values.homepage.startsWith('https://'))) {
    errors.homepage = 'URL must begin with http:// or https://';
  }

  return errors;
};

export default createValidator;
