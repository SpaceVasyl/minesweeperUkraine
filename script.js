document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('game');
    const width = 10;
    const height = 10;
    const mineCount = 20;
    const cells = [];
    let gameOver = false;

    function createBoard() {
        const minesArray = Array(mineCount).fill('mine');
        const emptyArray = Array(width * height - mineCount).fill('valid');
        const gameArray = emptyArray.concat(minesArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add('cell');
            cell.classList.add(shuffledArray[i]);
            grid.appendChild(cell);
            cells.push(cell);

            cell.addEventListener('click', function (e) {
                click(cell);
            });

            cell.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(cell);
            };
        }

        for (let i = 0; i < cells.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (cells[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
                if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
                if (i > 10 && cells[i - width].classList.contains('mine')) total++;
                if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
                if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
                if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
                if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
                if (i < 89 && cells[i + width].classList.contains('mine')) total++;
                cells[i].setAttribute('data', total);
            }
        }
    }

    function click(cell) {
        let currentId = cell.id;
        if (gameOver || cell.classList.contains('revealed') || cell.classList.contains('flag')) return;
        if (cell.classList.contains('mine')) {
            gameOver = true;
            revealMines();
        } else {
            let total = cell.getAttribute('data');
            if (total != 0) {
                cell.classList.add('revealed');
                cell.innerHTML = total;
                return;
            }
            checkCell(cell, currentId);
        }
        cell.classList.add('revealed');
        if (document.querySelectorAll('.cell.revealed').length === width * height - mineCount) {
            gameOver = true;
            setTimeout(() => showMessage('Це перемога! З днем народження!'), 2000);
        }
    }

    function checkCell(cell, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);
        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = cells[parseInt(currentId) - 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = cells[parseInt(currentId) + 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 10) {
                const newId = cells[parseInt(currentId - width)].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = cells[parseInt(currentId) - 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = cells[parseInt(currentId) + 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = cells[parseInt(currentId) - 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = cells[parseInt(currentId) + 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (currentId < 89) {
                const newId = cells[parseInt(currentId) + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
        }, 10);
    }

    function addFlag(cell) {
        if (gameOver || cell.classList.contains('revealed')) return;
        if (!cell.classList.contains('flag')) {
            cell.classList.add('flag');
            cell.innerHTML = '🚩';
        } else {
            cell.classList.remove('flag');
            cell.innerHTML = '';
        }
    }

    function revealMines() {
        cells.forEach(cell => {
            if (cell.classList.contains('mine')) {
                cell.innerHTML = '💣';
                cell.classList.add('revealed');
            }
        });
        setTimeout(() => showMessage('На жаль, ти програла... Але вітаю з днем народження!!!'), 2000);
    }

    createBoard();
});

function showMessage(text) {
    const message = document.getElementById('message');
    message.innerText = text;
    message.classList.remove('hidden');
    setTimeout(() => {
        message.classList.add('show');
    }, 10);
}