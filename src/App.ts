import {Sudoku} from './Sudoku';
import {Gui} from './Gui';
import {AI} from "./AI";
import {UnsolvableSudokuError} from "./UnsolvableSudokuError";
import {cloneDeep} from 'lodash';

export class App {
	get ai(): AI {
		return this._ai;
	}

	set ai(value: AI) {
		this._ai = value;
	}
	get gui(): Gui {
		return this._gui;
	}

	set gui(value: Gui) {
		this._gui = value;
	}

	get sudoku(): Sudoku {
		return this._sudoku;
	}

	set sudoku(value: Sudoku) {
		this._sudoku = value;
	}

	private _sudoku: Sudoku;
	private _gui: Gui;
	private _ai: AI;

	constructor() {
		this.sudoku = new Sudoku(this);
		this.gui = new Gui(this);
		this.ai = new AI();
	}

	public resetSudokus() {
		this.gui.resetSudokuFields(this.gui.s_fields);
		this.sudoku.resetBoard();
		this.gui.refreshConflictMarkers([]);
	}

	public establishExample() {
		this.resetSudokus();
		const POSS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.sudoku.board = [
			[POSS, POSS, 3, POSS, 2, POSS, 6, POSS, POSS],
			[9, POSS, POSS, 3, POSS, POSS, POSS, POSS, 1],
			[POSS, POSS, 1, 8, POSS, POSS, 4, POSS, POSS],
			[POSS, POSS, 8, 1, POSS, 2, 9, POSS, POSS],
			[7, POSS, POSS, POSS, POSS, POSS, POSS, POSS, 8],
			[POSS, POSS, 6, 7, POSS, 8, 2, POSS, POSS],
			[POSS, POSS, 2, 6, POSS, 9, 5, POSS, POSS],
			[8, POSS, POSS, 2, POSS, 3, POSS, POSS, 9],
			[POSS, POSS, 5, POSS, 1, POSS, 3, POSS, POSS]
		];
		this.sudoku.synchronizeSudoku();
	}

	public async solveSudoku(sudoku: Sudoku): Promise<void>{
		const input_sudoku = cloneDeep(sudoku);

		try {
			this.sudoku = this.ai.mac(cloneDeep(sudoku));
			this.sudoku.synchronizeSudoku();
			this.gui.markSolvedValues(input_sudoku);
			this.gui.successfulSudoku();
		} catch (e){
			if(e instanceof UnsolvableSudokuError){
				this.gui.failedSudoku()
			}
		}
	}

	public async getPhoto(event: Event): Promise<void>{
		const files = (event.target as HTMLInputElement).files;
		const form_data = new FormData();
		form_data.append('sudoku_photo', files[0]);

		fetch('/nn', {
			method: 'POST',
			body: form_data
		})
			.then(response => response.json())
			.then(result => {
				this.establishSudokuFromPhoto(result.data.matrix)
			})
			.catch(error => {
				console.error(error)
			})
	}

	private establishSudokuFromPhoto(board: Array<Array<number>>){
		this.resetSudokus();
		const POSS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		for(let i = 0; i < 9; i++){
			for(let j = 0; j < 9; j++){
				this.sudoku.board[i][j] = (board[i][j] === 0) ? POSS : board[i][j];
			}
		}
		this.sudoku.synchronizeSudoku();
	}
}