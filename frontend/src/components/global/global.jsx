
export const ToRupiah = (nominals) => {
    if (typeof nominals !== 'number' || isNaN(nominals)) return "Rp 0";
    return nominals.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export const DateIndonesia = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: false,
    });
}

export const parseJson = (data) => {
    return data ? JSON.parse(data) : []
}

export const urlApi = () => {
    const url = 'http://127.0.0.1:8000/api'
    return url
}

export const urlImg = () => {
    const url = 'http://127.0.0.1:8000/image'
    return url
}

export const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return `${seconds} detik lalu`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}
