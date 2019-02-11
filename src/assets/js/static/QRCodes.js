export const qrLevel = 'M';

export function generateUserQRCode(user) {
  const qrData = {
    _id: user._id
  };

  return JSON.stringify(qrData);
};

export function parseUserQRCode(data) {
  return JSON.parse(data);
};
