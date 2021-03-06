/**
 * Arc-consistency algorithm 3
 *
 * @param s macSudokuSolver field (9x9 Matrix)
 * @returns {boolean|*}
 * false: ac3 failed (no inputs left for a field)
 * array: an arc-consistent macSudokuSolver field
 */
function ac3(s) {
    // Queue initialization
    let queue = [];
    for (let m = 0; m < 9; m++) {
        for (let n = 0; n < 9; n++) {
            if (Number.isInteger(s[m][n])) {
                queue.push([m, n]);
            }
        }
    }

    // Arc consistency
    while (queue.length > 0) {
        // node init
        let node = queue[0];
        queue.shift();
        let m = node[0],
            n = node[1],
            val = s[m][n];

        // skip if it is possibility-array
        if (Array.isArray(s[m][n])) {
            continue;
        }

        // check row
        for (let col = 0; col < 9; col++) {
            if (Array.isArray(s[m][col]) && s[m][col].includes(val)) {
                // remove value from possibility array
                s[m][col] = s[m][col].filter(item => {
                    return item !== val;
                });

                // if possibility array is only element
                if (s[m][col].length === 1) {
                    s[m][col] = s[m][col][0];
                }
                // macSudokuSolver not solvable
                else if (s[m][col].length === 0) {
                    return false;
                }

                queue.push([m, col]);
            }
        }

        //check col
        for (let row = 0; row < 9; row++) {
            if (Array.isArray(s[row][n]) && s[row][n].includes(val)) {
                // remove value from possibility array
                s[row][n] = s[row][n].filter(item => {
                    return item !== val;
                });

                // if possibility array is only element
                if (s[row][n].length === 1) {
                    s[row][n] = s[row][n][0];
                }
                // macSudokuSolver not solvable
                else if (s[row][n].length === 0) {
                    return false;
                }

                queue.push([row, n]);
            }
        }

        // check quadrant
        let ini_row = Math.floor(m / 3) * 3,
            ini_col = Math.floor(n / 3) * 3;

        for (let row = ini_row; row < ini_row + 3; row++) {
            for (let col = ini_col; col < ini_col + 3; col++) {
                if (Array.isArray(s[row][col]) && s[row][col].includes(val)) {
                    // remove value from possibility array
                    s[row][col] = s[row][col].filter(item => {
                        return item !== val;
                    });

                    // if possibility array is only element
                    if (s[row][col].length === 1) {
                        s[row][col] = s[row][col][0];
                    }
                    // macSudokuSolver not solvable
                    else if (s[row][col].length === 0) {
                        return false;
                    }

                    queue.push([row, col]);
                }
            }
        }
    }
    // successful AC-3
    return s;
}

/**
 * heuristic to find field with least remaining values
 *
 * @param s macSudokuSolver field (9x9 Matrix)
 * @returns {number[]} field position of heuristic
 */
function lrv(s) {
    let lr_found = false;
    let lr_vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Dummy values
    let lr_pos;


    for (let m = 0; m < 9; m++) {
        for (let n = 0; n < 9; n++) {
            if (Array.isArray(s[m][n])) {
                if (s[m][n].length < lr_vals.length) {
                    lr_vals = s[m][n];
                    lr_pos = [m, n];
                    lr_found = true;
                }
            }
        }
    }
    return lr_pos;
}

/**
 * Maintaining arc consistency algorithm
 *
 * @param s macSudokuSolver field (9x9 Matrix)
 * @returns {*|boolean}
 * false: the macSudokuSolver is not solvable
 * array: a solved macSudokuSolver field
 */
function mac(s) {
    // AC3
    let ac3_result = ac3(s);
    let conflicts = checkConflicts(ac3_result);

    // Determination factors
    let ac3_was_successful = Array.isArray(ac3_result);
    let ac3_result_is_legit = conflicts.length === 0;
    let ac3_result_is_final = allFilledOut(ac3_result) && ac3_result_is_legit;

    // final? (= ac3 successful + result legit + everything filled out)
    if (ac3_result_is_final) {
        return ac3_result;
    }
    // failed? (= ac3 failed or result not legit)
    else if (!ac3_was_successful || !ac3_result_is_legit) {
        return false;
    }

    // further processing (= ac3 successful + result legit but not all filled out)

    // Heuristic for next assignment
    let H = lrv(ac3_result);

    // try MAC for all assignment possibilities
    for (let i = 0; i < H.length; i++) {
        // assignment
        let mod_result = _.cloneDeep(ac3_result);
        mod_result[H[0]][H[1]] = mod_result[H[0]][H[1]][i];

        // recursion of results until array(solution) found
        let result = mac(mod_result);
        if (Array.isArray(result)) {
            return result;
        }
    }
    return false;

}

// -----------------
// Helper functions
// -----------------
function allFilledOut(s) {
    for (let m = 0; m < 9; m++) {
        for (let n = 0; n < 9; n++) {
            if (Array.isArray(s[m][n]) || s[m][n] === 0) {
                return false;
            }
        }
    }
    return true;
}
