export class UnsolvableSudokuError extends Error{
	constructor() {
		super();
		Object.setPrototypeOf(this, UnsolvableSudokuError.prototype);

		this.name = "UnsolvableSudokuError";
		this.message = "The sudoku is unsolvable!";
	}
}