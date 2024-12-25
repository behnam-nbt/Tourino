export const toPersianDigits = (str) => str.replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

export const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    // Format the date as yyyy/MM/dd
    const formattedDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);

    // Format the time as HH:mm
    const formattedTime = date.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    });

    // Concatenate time and date, time comes first
    return `${formattedTime} - ${formattedDate}`;
};

export const translateTypeOfTransaction = (transactionType) => {
    if (transactionType === 'Purchase') {
        return 'ثبت نام در تور گردشگری';
    }
}