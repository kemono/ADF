/**
 * Alternate-Day Fasting Timer
 * 48時間周期で食事期間と絶食期間を交互に表示するアプリケーション
 */

// アプリケーション設定
const CONFIG = {
  startDate: new Date('2024-06-01T08:00:00'),
  eatingHours: {
    start: 9, // 食事開始時間
    end: 21    // 食事終了時間
  },
  updateInterval: 1000, // 更新間隔（ミリ秒）
  texts: {
    eating: '食事期間',
    fasting: '絶食中',
    nextPeriod: '次の{0}まで残り {1}'
  }
};

// DOM要素の参照をキャッシュ
const elements = {
  status: document.getElementById('status'),
  remainingTime: document.getElementById('remaining-time'),
  container: document.querySelector('.container')
};

/**
 * 秒数を時間、分、秒にフォーマットする
 * @param {number} totalSeconds - 総秒数
 * @returns {string} - フォーマットされた時間文字列 (HH:MM:SS)
 */
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return [hours, minutes, seconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}

/**
 * 現在の状態（食事期間または絶食期間）を計算する
 * @returns {Object} - 現在の状態と次の状態までの残り時間
 */
function calculateCurrentState() {
  const now = new Date();
  const elapsedMs = now - CONFIG.startDate;
  
  // 48時間周期内の日数（0 = 食事可能日, 1 = 絶食日）
  const cycleDay = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) % 2;
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  // 食事期間かどうか（偶数日の9:00-21:00の間のみ食事可能）
  const isEatingPeriod = cycleDay === 0 && 
                         currentHour >= CONFIG.eatingHours.start && 
                         currentHour < CONFIG.eatingHours.end;
  
  // 次の状態までの残り秒数を計算
  let remainingSeconds;
  
  if (isEatingPeriod) {
    // 食事期間中 -> 次の絶食期間までの残り秒数
    remainingSeconds = (
      (CONFIG.eatingHours.end - 1 - currentHour) * 3600 + 
      (59 - currentMinute) * 60 + 
      (60 - currentSecond)
    );
  } else {
    // 絶食期間中
    if (cycleDay === 0) {
      if (currentHour < CONFIG.eatingHours.start) {
        // 食事可能日の食事前 -> 今日の食事開始時間までの残り秒数
        remainingSeconds = (
          (CONFIG.eatingHours.start - 1 - currentHour) * 3600 + 
          (59 - currentMinute) * 60 + 
          (60 - currentSecond)
        );
      } else {
        // 食事可能日の食事後 -> 翌々日の食事開始時間までの残り秒数
        const hoursUntilMidnight = (23 - currentHour) * 3600 + (59 - currentMinute) * 60 + (60 - currentSecond);
        remainingSeconds = hoursUntilMidnight + 24 * 3600 + CONFIG.eatingHours.start * 3600;
      }
    } else {
      // 絶食日 -> 翌日の食事開始時間までの残り秒数
      const hoursUntilMidnight = (23 - currentHour) * 3600 + (59 - currentMinute) * 60 + (60 - currentSecond);
      remainingSeconds = hoursUntilMidnight + CONFIG.eatingHours.start * 3600;
    }
  }
  
  return {
    isEatingPeriod,
    remainingSeconds
  };
}

/**
 * UI要素を更新する
 */
function updateUI() {
  const state = calculateCurrentState();
  
  // テキスト更新
  elements.status.textContent = state.isEatingPeriod ? CONFIG.texts.eating : CONFIG.texts.fasting;
  
  const nextPeriodText = state.isEatingPeriod ? CONFIG.texts.fasting : CONFIG.texts.eating;
  elements.remainingTime.textContent = CONFIG.texts.nextPeriod
    .replace('{0}', nextPeriodText)
    .replace('{1}', formatTime(state.remainingSeconds));
  
  // クラス更新
  elements.container.classList.toggle('eating', state.isEatingPeriod);
  elements.container.classList.toggle('fasting', !state.isEatingPeriod);
}

/**
 * アプリケーションの初期化
 */
function initApp() {
  // 初回更新
  updateUI();
  
  // 定期更新のタイマーをセット
  setInterval(updateUI, CONFIG.updateInterval);
}

// DOMの読み込みが完了したらアプリケーションを初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}