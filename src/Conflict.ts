import {Sudoku} from "./Sudoku";

export class Conflict {
	get conflict2(): [number, number] {
		return this._conflict2;
	}

	set conflict2(value: [number, number]) {
		this._conflict2 = value;
	}
	get conflict1(): [number, number] {
		return this._conflict1;
	}

	set conflict1(value: [number, number]) {
		this._conflict1 = value;
	}

	private _conflict1: [number, number];
	private _conflict2: [number, number];

	constructor(s1: [number, number], s2: [number, number]) {
		this.conflict1 = s1;
		this.conflict2 = s2;
	}

	public static checkConflicts(s: Sudoku): Array<Conflict>{
		let conflicts: Array<Conflict> = [];
		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				if (Number.isInteger(s.board[m][n])) {
					const val = s.board[m][n] as number;
					conflicts = conflicts.concat(
						Conflict.checkRow(s, val, m, n),
						Conflict.checkCol(s, val, m, n),
						Conflict.checkQuad(s, val, m, n));
				}
			}
		}
		return conflicts;
	}

	public static checkRow(s: Sudoku, val: number, m:number, n:number): Array<Conflict> {
		let row_conflicts = [];
		for (let col = 0; col < 9; col++) {
			if (val === s.board[m][col] && col !== n) {
				row_conflicts.push(new Conflict([m, n], [m, col]));
			}
		}
		return row_conflicts;
	}

	public static checkCol(s: Sudoku, val: number, m:number, n:number): Array<Conflict>  {
		let col_conflicts = [];
		for (let row = 0; row < 9; row++) {
			if (val === s.board[row][n] && row !== m) {
				col_conflicts.push(new Conflict([m, n], [row, n]));
			}
		}
		return col_conflicts;
	}

	public static checkQuad(s: Sudoku, val: number, m:number, n:number): Array<Conflict>  {
		let quad_conflicts = [];
		let ini_row = Math.floor(m / 3) * 3,
			ini_col = Math.floor(n / 3) * 3;

		for (let row = ini_row; row < ini_row + 3; row++) {
			for (let col = ini_col; col < ini_col + 3; col++) {
				if (val === s.board[row][col] && row !== m && col !== n) {
					quad_conflicts.push(new Conflict([m, n], [row, col]));
				}
			}
		}
		return quad_conflicts;
	}
}