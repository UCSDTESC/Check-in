import { TESCUser } from '@Shared/ModelTypes';

const QR_CODE_SIZE = 200;
const QR_CODE_API_ROOT = `https://api.qrserver.com/v1/create-qr-code/`

function generateQRCodeURL(user: TESCUser) {
    return `${QR_CODE_API_ROOT}?size=${QR_CODE_SIZE}x${QR_CODE_SIZE}&data=${user._id}`
}

export { generateQRCodeURL }