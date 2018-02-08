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