import PropTypes from "prop-types";

import {QuestionTypes} from "~/static/Questions";

export const Column = {
  Header: PropTypes.string.isRequired,
  accessor: PropTypes.string.isRequired,
};

export const Filter = {
  displayName: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
};

export const Admin = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export const Question = {
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
};

export const CustomQuestionsShape = PropTypes.shape({
  [QuestionTypes.QUESTION_LONG]: PropTypes.arrayOf(PropTypes.shape(Question)),
  [QuestionTypes.QUESTION_SHORT]: PropTypes.arrayOf(PropTypes.shape(Question)),
  [QuestionTypes.QUESTION_CHECKBOX]:
    PropTypes.arrayOf(PropTypes.shape(Question)),
});

export const Event = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  organisers: PropTypes.arrayOf(PropTypes.shape(Admin)),
  logo: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  thirdPartyText: PropTypes.string,
  organisedBy: PropTypes.string.isRequired,
  users: PropTypes.number.isRequired,
  closeTime: PropTypes.string.isRequired,
  homepage: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  customQuestions: CustomQuestionsShape,
};
