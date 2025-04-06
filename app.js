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
     * 開始日時からの経過ミリ秒数
     * @type {number}
     */
    const elapsedMilliseconds = currentDate - startDate;
    
    /**
     * 開始日時からの経過日数（48時間サイクル内の日数）
     * @type {number}
     */
    const cycleDay = Math.floor(elapsedMilliseconds / (24 * 60 * 60 * 1000)) % 2;
    
    /**
     * 現在の時間（時）
     * @type {number}
     */
    const currentHour = currentDate.getHours();
    
    /**
     * 現在の時間（分）
     * @type {number}
     */
    const currentMinute = currentDate.getMinutes();
    
    /**
     * 現在の時間（秒）
     * @type {number}
     */
    const currentSecond = currentDate.getSeconds();
    
    /**
     * 食事期間かどうか（偶数日の10:00-18:00の間のみ食事可能）
     * @type {boolean}
     */
    const isEatingPeriod = cycleDay === 0 && currentHour >= 10 && currentHour < 18;
    
    // 状態を更新
    statusElement.textContent = isEatingPeriod ? '食事期間' : '絶食中';
    containerElement.classList.toggle('eating', isEatingPeriod);
    containerElement.classList.toggle('fasting', !isEatingPeriod);
    
    /**
     * 次の状態までの残り秒数を計算
     * @type {number}
     */
    let remainingSeconds;
    
    if (isEatingPeriod) {
        // 食事期間中 -> 次の絶食期間（18:00）までの残り秒数
        remainingSeconds = ((17 - currentHour) * 60 + (59 - currentMinute)) * 60 + (60 - currentSecond);
    } else {
        // 絶食期間中
        if (cycleDay === 0) {
            // 食事可能日の食事前 -> 今日の10:00までの残り秒数
            if (currentHour < 10) {
                remainingSeconds = ((9 - currentHour) * 60 + (59 - currentMinute)) * 60 + (60 - currentSecond);
            } else {
                // 食事可能日の食事後 -> 翌々日（次のサイクル）の10:00までの残り秒数
                const hoursUntilMidnight = ((23 - currentHour) * 60 + (59 - currentMinute)) * 60 + (60 - currentSecond);
                // 翌日の24時間（終日絶食）+ 翌々日の10時までの時間
                remainingSeconds = hoursUntilMidnight + 24 * 60 * 60 + 10 * 60 * 60;
            }
        } else {
            // 絶食日 -> 翌日の10:00までの残り秒数
            const hoursUntilMidnight = ((23 - currentHour) * 60 + (59 - currentMinute)) * 60 + (60 - currentSecond);
            remainingSeconds = hoursUntilMidnight + 10 * 60 * 60;
        }
    }
    
    // 残り時間を更新
    remainingTimeElement.textContent = `次の${isEatingPeriod ? '絶食' : '食事'}まで残り ${formatTime(remainingSeconds)}`;
}

// 1秒ごとに状態を更新
setInterval(updateStatus, 1000);
// 初回実行
updateStatus();
