import {Sudoku} from "./Sudoku";
import {UnsolvableSudokuError} from "./UnsolvableSudokuError";
import {cloneDeep} from "lodash";
import {Conflict} from "./Conflict";

export class AI {
	/**
	 * Arc-consistency algorithm 3
	 *
	 * @param s Sudoku
	 * @returns Sudoku
	 * @throws UnsolvableSudokuError
	 * false: ac3 failed (no inputs left for a field)
	 * array: an arc-consistent macSudokuSolver field
	 */
	private ac3(s: Sudoku): Sudoku {
		// Queue initialization
		let queue: Array<Array<number>> = [];
		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				if (Number.isInteger(s.board[m][n])) {
					queue.push([m, n]);
				}
			}
		}

		// Arc consistency
		while (queue.length > 0) {
			// node init
			const node = queue[0];
			queue.shift();
			let m: number = node[0],
				n: number = node[1],
				val: number | Array<number> = s.board[m][n];

			// skip if it is possibility-array
			if (Array.isArray(val)) {
				continue;
			}

			// check row
			for (let col = 0; col < 9; col++) {
				if(Array.isArray(s.board[m][col])){
					//const possibilities = s.board[m][col] as Array<number>;

					if ((s.board[m][col] as Array<number>).includes(val)) {
						// remove value from possibility array
						s.board[m][col] = (s.board[m][col] as Array<number>).filter(item => {
							return item !== val;
						});

						// if possibility array is only element
						if ((s.board[m][col] as Array<number>).length === 1) {
							s.board[m][col] = (s.board[m][col] as Array<number>)[0];
						}
						// macSudokuSolver not solvable
						else if ((s.board[m][col] as Array<number>).length === 0) {
							throw new UnsolvableSudokuError();
						}

						queue.push([m, col]);
					}
				}

			}

			//check col
			for (let row = 0; row < 9; row++) {
				if(Array.isArray(s.board[row][n])) {
					//const possibilities = s.board[row][n] as Array<number>;

					if ((s.board[row][n] as Array<number>).includes(val)) {
						// remove value from possibility array
						s.board[row][n] = (s.board[row][n] as Array<number>).filter(item => {
							return item !== val;
						});

						// if possibility array is only element
						if ((s.board[row][n] as Array<number>).length === 1) {
							s.board[row][n] = (s.board[row][n] as Array<number>)[0];
						}
						// macSudokuSolver not solvable
						else if ((s.board[row][n] as Array<number>).length === 0) {
							throw new UnsolvableSudokuError();
						}

						queue.push([row, n]);
					}
				}
			}

			// check quadrant
			let ini_row = Math.floor(m / 3) * 3,
				ini_col = Math.floor(n / 3) * 3;

			for (let row = ini_row; row < ini_row + 3; row++) {
				for (let col = ini_col; col < ini_col + 3; col++) {
					if(Array.isArray(s.board[row][col])){
						//const possibilities = s.board[row][col] as Array<number>;

						if ((s.board[row][col] as Array<number>).includes(val)) {
							// remove value from possibility array
							s.board[row][col] = (s.board[row][col] as Array<number>).filter(item => {
								return item !== val;
							});

							// if possibility array is only element
							if ((s.board[row][col] as Array<number>).length === 1) {
								s.board[row][col] = (s.board[row][col] as Array<number>)[0] ;
							}
							// macSudokuSolver not solvable
							else if ((s.board[row][col] as Array<number>).length === 0) {
								throw new UnsolvableSudokuError();
							}

							queue.push([row, col]);
						}
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
	private static lrv(s: Sudoku) {
		let lr_found = false;
		let lr_vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Dummy values
		let lr_pos: Array<number> = [];


		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				if (Array.isArray(s.board[m][n])) {
					const possibilities = s.board[m][n] as Array<number>;
					if (possibilities.length < lr_vals.length) {
						lr_vals = possibilities;
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
	public mac(s: Sudoku): Sudoku {
		// AC3
		const ac3_result = this.ac3(s);
		const conflicts = Conflict.checkConflicts(ac3_result);

		// final
		if (ac3_result.isComplete() && conflicts.length === 0) {
			return ac3_result;
		}

		// invalid
		if(conflicts.length !== 0){
			throw new UnsolvableSudokuError();
		}

		// Heuristic for next assignment
		const heuristic = AI.lrv(ac3_result);

		// try MAC for all assignment possibilities
		for (let i = 0; i < heuristic.length; i++) {
			// assignment
			let mod_result: Sudoku = cloneDeep(ac3_result);
			let mod_result_board = mod_result.board[heuristic[0]][heuristic[1]] as Array<number>;
			mod_result.board[heuristic[0]][heuristic[1]] = mod_result_board[i];

			// recursion of results until array(solution) found
			try{
				return this.mac(mod_result);
			} catch (e){
				if(e instanceof UnsolvableSudokuError && i === heuristic.length - 1){
					throw new UnsolvableSudokuError();
				}
			}
		}
	}

}