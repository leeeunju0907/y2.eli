document.addEventListener('DOMContentLoaded', function() {
    const seatingTable = document.getElementById('seatingTable');
    const shuffleSeatsBtn = document.getElementById('shuffleSeatsBtn');

    function getGender(num) {
        if (!num) return '';
        num = Number(num);
        if (num >= 1 && num <= 13) return '여';
        if (num >= 14 && num <= 29) return '남';
        return '';
    }

    function setCell(td, num) {
        td.textContent = num;
        td.classList.remove('girl-seat', 'boy-seat');
        if (num) {
            const gender = getGender(num);
            if (gender === '여') {
                td.classList.add('girl-seat');
                td.innerHTML = `<span class="seat-label">${num}</span> <span class="gender-emoji">👧</span>`;
            } else if (gender === '남') {
                td.classList.add('boy-seat');
                td.innerHTML = `<span class="seat-label">${num}</span> <span class="gender-emoji">👦</span>`;
            }
        } else {
            td.innerHTML = '';
        }
    }

    function handleCellClick(e) {
        const td = e.target.closest('td');
        if (!td || !td.textContent) return;
        const tds = Array.from(seatingTable.querySelectorAll('td')).filter(cell => cell.textContent);
        if (tds.length < 2) return;
        let otherTds = tds.filter(cell => cell !== td);
        let randomTd = otherTds[Math.floor(Math.random() * otherTds.length)];
        // 자리 바꾸기
        const temp = td.querySelector('.seat-label').textContent;
        setCell(td, randomTd.querySelector('.seat-label').textContent);
        setCell(randomTd, temp);
    }

    function addSeatCellListeners() {
        const tds = seatingTable.querySelectorAll('td');
        tds.forEach(td => {
            td.removeEventListener('click', handleCellClick);
            td.addEventListener('click', handleCellClick);
        });
    }

    function shuffleSeats() {
        const total = 29;
        let numbers = Array.from({length: total}, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        let rows = [];
        for (let r = 0; r < 5; r++) {
            rows.push(numbers.slice(r * 6, (r + 1) * 6));
        }
        while (rows[4].length < 6) rows[4].push('');
        const tbody = seatingTable.querySelector('tbody');
        tbody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(num => {
                const td = document.createElement('td');
                setCell(td, num);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        addSeatCellListeners();
    }

    // 초기 셀에도 성별 표시 적용
    Array.from(seatingTable.querySelectorAll('td')).forEach(td => {
        setCell(td, td.textContent);
    });

    if (shuffleSeatsBtn) {
        shuffleSeatsBtn.addEventListener('click', shuffleSeats);
    }
    addSeatCellListeners();
});
// ...existing code...
// 자리 섞기 기능
const seatingTable = document.getElementById('seatingTable');
const shuffleSeatsBtn = document.getElementById('shuffleSeatsBtn');

function shuffleSeats() {
    const total = 29;
    let numbers = Array.from({length: total}, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    // 5줄 6칸으로 나누기
    let rows = [];
    for (let r = 0; r < 5; r++) {
        rows.push(numbers.slice(r * 6, (r + 1) * 6));
    }
    // 마지막 줄 빈칸 처리
    while (rows[4].length < 6) rows[4].push('');
    // 테이블 갱신
    const tbody = seatingTable.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(num => {
            const td = document.createElement('td');
            td.textContent = num;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

if (shuffleSeatsBtn) {
    shuffleSeatsBtn.addEventListener('click', shuffleSeats);
}
let timerInterval;
let elapsedSeconds = 0;
let isRunning = false;
let mode = 'timer'; // 'timer' or 'stopwatch'
const TIMER_MAX_SECONDS = 60; // 진행바 1분 기준

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtn = document.getElementById('modeBtn');
const progressBar = document.getElementById('progress-bar');

function updateDisplay() {
    const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    updateProgressBar();
}

function updateProgressBar() {
    if (mode === 'timer') {
        let percent = Math.min((elapsedSeconds / TIMER_MAX_SECONDS) * 100, 100);
        progressBar.style.width = percent + '%';
    } else {
        // 스톱워치: 60초마다 진행바 반복
        let percent = (elapsedSeconds % TIMER_MAX_SECONDS) / TIMER_MAX_SECONDS * 100;
        progressBar.style.width = percent + '%';
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            updateDisplay();
            if (mode === 'timer' && elapsedSeconds >= TIMER_MAX_SECONDS) {
                pauseTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }
}

function resetTimer() {
    pauseTimer();
    elapsedSeconds = 0;
    updateDisplay();
}

function toggleMode() {
    if (mode === 'timer') {
        mode = 'stopwatch';
        modeBtn.textContent = '타이머';
    } else {
        mode = 'timer';
        modeBtn.textContent = '스톱워치';
    }
    resetTimer();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
modeBtn.addEventListener('click', toggleMode);

updateDisplay();
