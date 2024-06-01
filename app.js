/**
 * 開始日時
 * @type {Date}
 */
const startDate = new Date('2024-06-01T08:00:00');

/**
 * 状態を表示する要素
 * @type {HTMLElement}
 */
const statusElement = document.getElementById('status');

/**
 * 残り時間を表示する要素
 * @type {HTMLElement}
 */
const remainingTimeElement = document.getElementById('remaining-time');

/**
 * コンテナ要素
 * @type {HTMLElement}
 */
const containerElement = document.querySelector('.container');

/**
 * 秒数を時間、分、秒にフォーマットする
 * @param {number} totalSeconds - 総秒数
 * @returns {string} - フォーマットされた時間文字列
 */
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 状態を更新する
 */
function updateStatus() {
    const currentDate = new Date();
    
    /**
     * 開始日時からの経過秒数
     * @type {number}
     */
    const timeDiff = Math.floor((currentDate - startDate) / 1000);
    
    /**
     * 48時間サイクル内の残り時間（時間単位）
     * @type {number}
     */
    const remainingHours = Math.floor(timeDiff / 3600) % 48;
    
    /**
     * 食事期間かどうか
     * @type {boolean}
     */
    const isEatingPeriod = remainingHours < 12;
    
    // 状態を更新
    statusElement.textContent = isEatingPeriod ? '食事期間' : '絶食中';
    containerElement.classList.toggle('eating', isEatingPeriod);
    containerElement.classList.toggle('fasting', !isEatingPeriod);
    
    /**
     * 次の状態までの残り秒数
     * @type {number}
     */
    const remainingSeconds = isEatingPeriod ? 
        (12 - remainingHours) * 3600 - (currentDate.getMinutes() * 60 + currentDate.getSeconds()) :
        (48 - remainingHours) * 3600 - (currentDate.getMinutes() * 60 + currentDate.getSeconds());
    
    // 残り時間を更新
    remainingTimeElement.textContent = `次の${isEatingPeriod ? '絶食' : '食事'}まで残り ${formatTime(remainingSeconds)}`;
}

// 1秒ごとに状態を更新
setInterval(updateStatus, 1000);