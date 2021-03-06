// Initialize internal main board
let sudoku;

// Messages
const init_msg = "Please fill in your macSudokuSolver ...";
const conflict_msg = "Please resolve the highlighted conflicts!";
const failed_msg = "The macSudokuSolver you have entered is unsolvable!";
const success_msg = "Success!";

// (internal) macSudokuSolver field operations
function synchronizeSudokuWithVal(id, val) {
    // m rows, n cols
    let m = id.charAt(1);
    let n = id.charAt(2);

    sudoku[m][n] = val;
    refreshConflictMarkers(checkConflicts(sudoku));

}

function checkConflicts(s) {
    let conflicts = [];
    for (let m = 0; m < 9; m++) {
        for (let n = 0; n < 9; n++) {
            let val = s[m][n];
            if (Number.isInteger(val)) {
                conflicts = conflicts.concat(
                    checkRow(s, val, m, n),
                    checkCol(s, val, m, n),
                    checkQuad(s, val, m, n));
            }
        }
    }
    return conflicts;
}

function checkRow(s, val, m, n) {
    let row_conflicts = [];
    for (let col = 0; col < 9; col++) {
        if (val === s[m][col] && col !== n) {
            row_conflicts.push([[m, n], [m, col]]);
        }
    }
    return row_conflicts;
}

function checkCol(s, val, m, n) {
    let col_conflicts = [];
    for (let row = 0; row < 9; row++) {
        if (val === s[row][n] && row !== m) {
            col_conflicts.push([[m, n], [row, n]]);
        }
    }
    return col_conflicts;
}

function checkQuad(s, val, m, n) {
    let quad_conflicts = [];
    let ini_row = Math.floor(m / 3) * 3,
        ini_col = Math.floor(n / 3) * 3;

    for (let row = ini_row; row < ini_row + 3; row++) {
        for (let col = ini_col; col < ini_col + 3; col++) {
            if (val === s[row][col] && row !== m && col !== n) {
                quad_conflicts.push([[m, n], [row, col]]);
            }
        }
    }
    return quad_conflicts;
}

// RESET
function resetInternalSudoku() {
    sudoku = [];
    const POSS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < 9; i++) {
        sudoku.push(new Array(9).fill(POSS));
    }
}

function resetSudokus() {
    resetSudokuBoard()
    resetInternalSudoku();
    refreshConflictMarkers([]);
}

// INITIALIZATION
function init() {
    initializeSudokuBoard();
    resetInternalSudoku();

    // macSudokuSolver fields
    let s_fields = document.getElementsByClassName('s-field');
    for (let i = 0; i < s_fields.length; i++) {
        s_fields[i].addEventListener('input', (e) => {
            // set previous on input
            e.target.value = e.target.dataset.previous;

            // refresh value in inner main
            let id = e.target.id;
            let val = e.target.value;
            synchronizeSudokuWithVal(id, parseInt(val));
        });
        s_fields[i].addEventListener('keydown', (e) => {
            // allow digits
            if (e.key > 0 && e.key < 10) {
                e.target.value = e.key;
                e.target.dataset.previous = e.key;
            }
            // delete digits
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                e.target.value = "";
                e.target.dataset.previous = "";

                // refresh 0 in inner main
                let id = e.target.id;
                synchronizeSudokuWithVal(id, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
        });
    }

    // buttons
    document.getElementById('solve-btn').addEventListener('click', solveSudoku);
    document.getElementById('reset-btn').addEventListener('click', resetSudokus);
    document.getElementById('example').addEventListener('click', establishExample);
}

// IN GAME
function establishExample(){
    resetSudokus();
    const POSS = [1,2,3,4,5,6,7,8,9];
    sudoku = [
        [POSS, POSS, 3, POSS, 2, POSS, 6, POSS, POSS],
        [9, POSS, POSS, 3, POSS, POSS, POSS, POSS, 1],
        [POSS, POSS, 1, 8, POSS, POSS, 4, POSS, POSS, POSS],
        [POSS, POSS, 8, 1, POSS, 2, 9, POSS, POSS],
        [7, POSS, POSS, POSS, POSS, POSS, POSS, POSS, 8],
        [POSS, POSS, 6, 7, POSS, 8, 2, POSS, POSS],
        [POSS, POSS, 2, 6, POSS, 9, 5, POSS, POSS],
        [8, POSS, POSS, 2, POSS, 3, POSS, POSS, 9],
        [POSS, POSS, 5, POSS, 1, POSS, 3, POSS, POSS]
    ]
    realizeInternalSudoku();
}

function solveSudoku(){
    let input_sudoku = _.cloneDeep(sudoku);
    let result = mac(_.cloneDeep(sudoku));
    if (Array.isArray(result)) {
        sudoku = result;
        realizeInternalSudoku();
        markSolvedValues(input_sudoku);
        successfulSudoku();
    } else {
        failedSudoku();
    }
}


window.addEventListener('load', init);