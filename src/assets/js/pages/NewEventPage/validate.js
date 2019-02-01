const createValidator = (options) => (values) => {
    const errors = {};

    let required = ['name', 'alias', 'closeTimeMonth', 'closeTimeDay',
    'closeTimeYear', 'email', 'url', 'description', 'logo'];

    const notValid = required.filter(name => !(name in values));
    notValid.forEach(name => errors[name] = 'Required');

    return errors;
}

export default createValidator;
