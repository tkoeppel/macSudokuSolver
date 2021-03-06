// board initialization
function initializeSudokuBoard() {
    let sudoku_field = "";
    // quadrant rows
    for (let qr = 1; qr <= 3; qr++) {
        let sudoku_row = `<div class="row">`;
        // quadrant cols
        for (let qc = 1; qc <= 3; qc++) {
            let quadrant = `
                <div class="quadrant border border-2 border-secondary rounded">`;
            
            // sudoku fields in quadrants
            for (let r = (qr - 1) * 3; r < qr * 3; r++) {
                let quadrant_row = `<div class="row">`;
                for (let c = (qc - 1) * 3; c < qc * 3; c++) {
                    quadrant_row += `
                        <div class="col-3 m-1 p-0">
                            <input 
                                id="s${r}${c}" 
                                class="s-field input-group text-center"
                                data-previous="">
                        </div>`;
                }
                quadrant += quadrant_row + `</div>`;
            }
            sudoku_row += quadrant + `</div>`;
        }
        sudoku_field += sudoku_row + `</div>`;
    }
    document.getElementById('sudoku-field').innerHTML = sudoku_field;
}

// display inner macSudokuSolver for user
function realizeInternalSudoku() {
    for (let m = 0; m < 9; m++) {
        for (let n = 0; n < 9; n++) {
            let id = "s" + m + n,
                val = sudoku[m][n];
            if (Number.isInteger(val) && val !== 0) {
                document.getElementById(id).value = val;
            }else{
                document.getElementById(id).value = "";
            }
        }
    }
}

// conflict feedback
function refreshConflictMarkers(conflicts) {
    removeAllConflictMarkers();
    markConflicts(conflicts);
}

function removeAllConflictMarkers() {
    let s_fields = document.getElementsByClassName('s-field');
    for (let i = 0; i < s_fields.length; i++) {
        s_fields[i].className = "s-field input-group text-center";
    }
}

function markConflicts(conflicts) {
    if (conflicts.length === 0){
        // refresh user message
        document.getElementById('msg').innerHTML = init_msg;
        document.getElementById('msg').className = "";
        document.getElementById('msg').classList.add('alert', 'alert-secondary');

        document.getElementById('solve-btn').classList.remove('disabled');
    } else {
        // mark conflicted fields red
        for (let i = 0; i < conflicts.length; i++) {
            let id1 = "s" + conflicts[i][0][0] + conflicts[i][0][1],
                id2 = "s" + conflicts[i][1][0] + conflicts[i][1][1];
            document.getElementById(id1).classList.add('text-warning', 'font-weight-bold');
            document.getElementById(id2).classList.add('text-warning', 'font-weight-bold');
        }

        // refresh user message
        document.getElementById('msg').innerHTML = conflict_msg;
        document.getElementById('msg').className = "";
        document.getElementById('msg').classList.add('alert', 'alert-warning');

        document.getElementById('solve-btn').classList.add('disabled')
    }
}

// Resets macSudokuSolver board for user
function resetSudokuBoard(){
    let s_fields = document.getElementsByClassName('s-field');
    for (let i = 0; i < s_fields.length; i++) {
        s_fields[i].value = "";
        s_fields[i].dataset.previous = "";
    }
}

// Marking the values the AI filled in
function markSolvedValues(s){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(Array.isArray(s[i][j])){
                let id = "s" + i + j;
                document.getElementById(id).classList.add('text-primary');
            }
        }
    }
}

// macSudokuSolver status feedbacks
function failedSudoku() {
    document.getElementById('msg').innerHTML = failed_msg;
    document.getElementById('msg').className = "";
    document.getElementById('msg').classList.add('alert', 'alert-danger');

    document.getElementById('solve-btn').classList.add('disabled');
}

function successfulSudoku(){
    document.getElementById('msg').innerHTML = success_msg;
    document.getElementById('msg').className = "";
    document.getElementById('msg').classList.add('alert', 'alert-success');
}
