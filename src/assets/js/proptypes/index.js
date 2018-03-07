import PropTypes from 'prop-types';

export const Column = {
  Header: PropTypes.string.isRequired,
  accessor: PropTypes.string.isRequired
};

export const Filter = {
  displayName: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired
};

export const Admin = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
};

export const Event = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  organisers: PropTypes.arrayOf(PropTypes.shape(Admin)),
  logo: PropTypes.string.isRequired,
  users: PropTypes.number.isRequired,
  closeTime: PropTypes.instanceOf(Date),
  homepage: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};
