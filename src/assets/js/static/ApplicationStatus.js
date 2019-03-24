export const Statuses = [
  'Declined',
  'Unconfirmed',
  'Confirmed',
  'Rejected',
  'Waitlisted',
  'Late'
];

export const isAcceptable = (status) => {

  if (!status) {
    return false;
  }

  const acceptableStates = new Set([
    'Unconfirmed',
    'Confirmed',
  ]);

  return acceptableStates.has(status);
};
