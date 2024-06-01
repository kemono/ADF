const startDate = new Date('2024-06-01T08:00:00');

function formatTime(hours, minutes, seconds) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStatus() {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const cycleNum = Math.floor(hoursDiff / 48);
    const remainingHours = hoursDiff % 48;

    const statusElement = document.getElementById('status');
    const remainingTimeElement = document.getElementById('remaining-time');
    const containerElement = document.querySelector('.container');

    if (remainingHours < 12) {
        statusElement.textContent = '食事期間';
        containerElement.classList.remove('fasting');
        containerElement.classList.add('eating');
        const remainingTime = (12 - remainingHours) * 60 * 60 - (currentDate.getMinutes() * 60 + currentDate.getSeconds());
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        remainingTimeElement.textContent = `次の絶食まで残り ${formatTime(hours, minutes, seconds)}`;
    } else {
        statusElement.textContent = '絶食中';
        containerElement.classList.remove('eating');
        containerElement.classList.add('fasting');
        const remainingTime = (48 - remainingHours) * 60 * 60 - (currentDate.getMinutes() * 60 + currentDate.getSeconds());
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        remainingTimeElement.textContent = `次の食事まで残り ${formatTime(hours, minutes, seconds)}`;
    }
}

setInterval(updateStatus, 1000);