// 게임 상태 변수
let balance = 1000;
let betAmount = 50;
let isSpinning = false;

// DOM 요소 선택
const balanceElement = document.getElementById('balance');
const betAmountElement = document.getElementById('bet-amount');
const spinButton = document.getElementById('spin-btn');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const resultElement = document.getElementById('result');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// 슬롯 심볼 배열
const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '🔔', '⭐'];

// 배당 테이블
const payouts = {
    '🍒🍒🍒': 10,
    '🍋🍋🍋': 15,
    '🍊🍊🍊': 20,
    '🍇🍇🍇': 25,
    '💎💎💎': 50,
    '🔔🔔🔔': 30,
    '⭐⭐⭐': 40
};

// 초기화
function init() {
    updateDisplay();
    updateBetControls();
}

// 디스플레이 업데이트
function updateDisplay() {
    balanceElement.textContent = balance;
    betAmountElement.textContent = betAmount;
}

// 베팅 컨트롤 업데이트
function updateBetControls() {
    decreaseBetButton.disabled = betAmount <= 10;
    increaseBetButton.disabled = betAmount >= balance || betAmount >= 200;
    spinButton.disabled = balance < betAmount;
}

// 랜덤 심볼 생성
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// 스핀 애니메이션
function spinReels() {
    const reels = [reel1, reel2, reel3];
    
    // 스핀 애니메이션 시작
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });
    
    // 각 릴을 다른 시간에 멈춤
    const stopTimes = [1000, 1500, 2000];
    const results = [];
    
    stopTimes.forEach((time, index) => {
        setTimeout(() => {
            const symbol = getRandomSymbol();
            reels[index].textContent = symbol;
            reels[index].classList.remove('spinning');
            results.push(symbol);
            
            // 마지막 릴이 멈췄을 때 결과 계산
            if (index === 2) {
                setTimeout(() => {
                    calculateResult(results);
                }, 500);
            }
        }, time);
    });
}

// 결과 계산
function calculateResult(results) {
    const resultKey = results.join('');
    const payout = payouts[resultKey];
    
    if (payout) {
        const winAmount = betAmount * payout;
        balance += winAmount;
        showResult(`🎉 대박! ${winAmount}코인 획득!`, 'win');
    } else {
        showResult(`😢 아쉽게도 꽝! ${betAmount}코인 잃음`, 'lose');
    }
    
    isSpinning = false;
    updateDisplay();
    updateBetControls();
}

// 결과 메시지 표시
function showResult(message, type) {
    resultElement.textContent = message;
    resultElement.className = `result ${type}`;
    
    // 3초 후 메시지 사라짐
    setTimeout(() => {
        resultElement.textContent = '';
        resultElement.className = 'result';
    }, 3000);
}

// 스핀 버튼 클릭 이벤트
spinButton.addEventListener('click', () => {
    if (isSpinning || balance < betAmount) return;
    
    isSpinning = true;
    balance -= betAmount;
    updateDisplay();
    updateBetControls();
    
    spinReels();
});

// 베팅 금액 감소 버튼
decreaseBetButton.addEventListener('click', () => {
    if (betAmount > 10) {
        betAmount -= 10;
        updateDisplay();
        updateBetControls();
    }
});

// 베팅 금액 증가 버튼
increaseBetButton.addEventListener('click', () => {
    if (betAmount < balance && betAmount < 200) {
        betAmount += 10;
        updateDisplay();
        updateBetControls();
    }
});

// 게임 시작
init();

// 게임 오버 체크
function checkGameOver() {
    if (balance <= 0) {
        showResult('게임 오버! 코인이 모두 소진되었습니다.', 'lose');
        spinButton.disabled = true;
    }
}

// 주기적으로 게임 오버 체크
setInterval(checkGameOver, 1000);