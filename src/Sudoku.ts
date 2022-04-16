import {App} from "./App";
import {Conflict} from "./Conflict";

export class Sudoku {
	get app(): App {
		return this._app;
	}

	set app(value: App) {
		this._app = value;
	}

	get board(): Array<Array<number | Array<number>>> {
		return this._board;
	}

	set board(value: Array<Array<number | Array<number>>>) {
		this._board = value;
	}

	private _app: App;
	private _board: Array<Array<number | Array<number>>>;
	private _conflicts: Array<Conflict>;

	constructor(app: App) {
		this.app = app;
	}

	public synchronizeSudoku() {
		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				let id = "s" + m + n;
				const val: number | Array<number> = this.board[m][n];
				let input = document.getElementById(id) as HTMLInputElement;

				if (Number.isInteger(val) && val !== 0) {
					input.value = val.toString();
				} else {
					input.value = "";
				}
			}
		}
	}

	public resetBoard() {
		this.board = [];
		const POSS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		for (let i = 0; i < 9; i++) {
			this.board.push(new Array(9).fill(POSS));
		}
	}

	public synchronizeSudokuWithVal(id: string, val: number | Array<number>) {
		// m rows, n cols
		const m = Number(id.charAt(1));
		const n = Number(id.charAt(2));

		this.board[m][n] = val;
		this.app.gui.refreshConflictMarkers(Conflict.checkConflicts(this));
	}

	public isComplete() {
		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				if (Array.isArray(this.board[m][n]) || !Number.isInteger(this.board[m][n])) {
					return false;
				}
			}
		}
		return true;
	}
}