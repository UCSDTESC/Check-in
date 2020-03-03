const createValidator = (requireLogo = true) => (values: any) => {
  console.log(values)
  const errors: any = {};

  const required = ['name', 'alias', 'closeTimeMonth', 'closeTimeDay',
    'closeTimeYear', 'email', 'homepage', 'description'];

  requireLogo && required.push('logo')

  const notValid = required.filter(name => !(name in values) || !values[name]);
  notValid.forEach(name => errors[name] = 'Required');

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.closeTimeDay < 1 || values.closeTimeDay > 31) {
    errors.closeTimeDay = 'Invalid Day';
  }

  if (values.closeTimeMonth === 'Month' || values.closeTimeMonth < 0 ||
    values.closeTimeMonth > 11) {
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
