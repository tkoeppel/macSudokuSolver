import {App} from "./App";
import {Conflict} from "./Conflict";
import {Sudoku} from "./Sudoku";

export class GUI {
	get video_canvas(): HTMLCanvasElement {
		return this._video_canvas;
	}

	set video_canvas(value: HTMLCanvasElement) {
		this._video_canvas = value;
	}
	get is_video_streaming(): boolean {
		return this._is_video_streaming;
	}

	set is_video_streaming(value: boolean) {
		this._is_video_streaming = value;
	}

	get video_stream(): HTMLVideoElement {
		return this._video_stream;
	}

	set video_stream(value: HTMLVideoElement) {
		this._video_stream = value;
	}

	get take_photo_btn(): HTMLButtonElement {
		return this._take_photo_btn;
	}

	set take_photo_btn(value: HTMLButtonElement) {
		this._take_photo_btn = value;
	}

	get mask(): HTMLDivElement {
		return this._mask;
	}

	set mask(value: HTMLDivElement) {
		this._mask = value;
	}

	get photo_btn(): HTMLButtonElement {
		return this._photo_btn;
	}

	set photo_btn(value: HTMLButtonElement) {
		this._photo_btn = value;
	}

	get message(): HTMLDivElement {
		return this._message;
	}

	set message(value: HTMLDivElement) {
		this._message = value;
	}

	get s_fields(): Array<HTMLInputElement> {
		return this._s_fields;
	}

	set s_fields(value: Array<HTMLInputElement>) {
		this._s_fields = value;
	}

	get app(): App {
		return this._app;
	}

	set app(value: App) {
		this._app = value;
	}

	get example_btn(): HTMLButtonElement {
		return this._example_btn;
	}

	set example_btn(value: HTMLButtonElement) {
		this._example_btn = value;
	}

	get reset_btn(): HTMLButtonElement {
		return this._reset_btn;
	}

	set reset_btn(value: HTMLButtonElement) {
		this._reset_btn = value;
	}

	get solve_btn(): HTMLButtonElement {
		return this._solve_btn;
	}

	set solve_btn(value: HTMLButtonElement) {
		this._solve_btn = value;
	}

	get sudoku_field(): HTMLDivElement {
		return this._sudoku_field;
	}

	set sudoku_field(value: HTMLDivElement) {
		this._sudoku_field = value;
	}

	private _app: App;

	// General
	private _sudoku_field: HTMLDivElement;
	private _s_fields: Array<HTMLInputElement>;
	private _message: HTMLDivElement;
	private _solve_btn: HTMLButtonElement;
	private _reset_btn: HTMLButtonElement;
	private _photo_btn: HTMLButtonElement;
	private _example_btn: HTMLButtonElement;

	// photo mask
	private _mask: HTMLDivElement;
	private _take_photo_btn: HTMLButtonElement;
	private _video_stream: HTMLVideoElement;
	private _video_canvas: HTMLCanvasElement;
	private _is_video_streaming: boolean;

	// messages
	public init_msg: string = "Please fill in your sudoku ...";
	public conflict_msg: string = "Please resolve the highlighted conflicts!";
	public failed_msg: string = "The sudoku you have entered is unsolvable!";
	public success_msg: string = "Success!";

	constructor(app: App) {
		this.app = app;

		document.addEventListener("DOMContentLoaded", async () => {


			// DOM
			this.sudoku_field = document.getElementById('sudoku-field') as HTMLDivElement;
			this.message = document.getElementById('msg') as HTMLDivElement;
			this.solve_btn = document.getElementById('solve-btn') as HTMLButtonElement;
			this.reset_btn = document.getElementById('reset-btn') as HTMLButtonElement;
			this.photo_btn = document.getElementById('img-capture') as HTMLButtonElement;
			this.example_btn = document.getElementById('example-btn') as HTMLButtonElement;
			this.mask = document.getElementById('mask') as HTMLDivElement;
			this.take_photo_btn = document.getElementById('take-photo-btn') as HTMLButtonElement;
			this.video_stream = document.getElementById('video-stream') as HTMLVideoElement;
			this.video_canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
			this.is_video_streaming = false;

			// Event listener
			this.solve_btn.addEventListener('click', () => this.app.solveSudoku(this.app.sudoku));
			this.reset_btn.addEventListener('click', () => this.app.resetSudokus());
			this.photo_btn.addEventListener('click', () => this.initiatePhotoMask());
			this.example_btn.addEventListener('click', () => this.app.establishExample());
			this.video_stream.addEventListener('canplay', e => this.is_video_streaming = true);
			this.take_photo_btn.addEventListener('click', () => this.takePhoto());

			// Init
			await this.drawSudokuBoard(this.sudoku_field);
			this.s_fields = Array.from(document.getElementsByClassName('s-field')) as Array<HTMLInputElement>;
			await this.app.sudoku.resetBoard();
			await this.establishNumberInputListener(this.s_fields);
		});
	}

	public drawSudokuBoard(sudoku_field_div: HTMLDivElement) {
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
                                data-previous=""
                                pattern="[0-9]"
                                type="number">
                        </div>`;
					}
					quadrant += quadrant_row + `</div>`;
				}
				sudoku_row += quadrant + `</div>`;
			}
			sudoku_field += sudoku_row + `</div>`;
		}
		sudoku_field_div.innerHTML = sudoku_field;
	}

	public async establishNumberInputListener(s_fields: Array<HTMLInputElement>) {
		for (let i = 0; i < s_fields.length; i++) {
			s_fields[i].addEventListener('input', (e: Event) => {
				// set previous on input
				let target = e.target as HTMLInputElement;
				target.value = target.dataset.previous;
				// refresh value in inner main
				const id = target.id;
				const val = target.value;
				this.app.sudoku.synchronizeSudokuWithVal(id, parseInt(val));
			});

			s_fields[i].addEventListener('keydown', (e: KeyboardEvent) => {
				let target = e.target as HTMLInputElement;

				// allow digits
				if (Number.isInteger(Number(e.key)) && Number(e.key) > 0 && Number(e.key) < 10) {
					target.value = e.key;
					target.dataset.previous = e.key;
				}
				// delete digits
				else if (e.key === 'Delete' || e.key === 'Backspace') {
					target.value = "";
					target.dataset.previous = "";

					// refresh 0 in inner main
					const id = target.id;
					this.app.sudoku.synchronizeSudokuWithVal(id, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
				} else {
					target.value = target.dataset.previous;
				}
			});
		}
	}

	public resetSudokuFields(s_fields: Array<HTMLInputElement>) {
		for (let i = 0; i < s_fields.length; i++) {
			s_fields[i].value = "";
			s_fields[i].dataset.previous = "";
		}
	}

	public markSolvedValues(sudoku: Sudoku) {
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (Array.isArray(sudoku.board[i][j])) {
					const id = "s" + i + j;
					document.getElementById(id).classList.add('text-primary');
				}
			}
		}
	}

	public markConflicts(conflicts: Array<Conflict>) {
		if (conflicts.length === 0) {
			// refresh user message
			this.message.innerHTML = this.init_msg;
			this.message.className = "";
			this.message.classList.add('alert', 'alert-secondary');

			this.solve_btn.classList.remove('disabled');
		} else {
			// mark conflicted fields red
			for (let i = 0; i < conflicts.length; i++) {
				let id1 = "s" + conflicts[i].conflict1[0] + conflicts[i].conflict1[1],
					id2 = "s" + conflicts[i].conflict2[0] + conflicts[i].conflict2[1];
				document.getElementById(id1).classList.add('text-warning', 'font-weight-bold');
				document.getElementById(id2).classList.add('text-warning', 'font-weight-bold');
			}

			// refresh user message
			this.message.innerHTML = this.conflict_msg;
			this.message.className = "";
			this.message.classList.add('alert', 'alert-warning');

			this.solve_btn.classList.add('disabled')
		}
	}

	public refreshConflictMarkers(conflicts: Array<Conflict>) {
		this.removeAllConflictMarkers();
		this.markConflicts(conflicts);
	}

	public removeAllConflictMarkers() {
		let s_fields = document.getElementsByClassName('s-field');
		for (let i = 0; i < s_fields.length; i++) {
			s_fields[i].className = "s-field input-group text-center";
		}
	}

	public failedSudoku() {
		this.message.innerHTML = this.failed_msg;
		this.message.className = "";
		this.message.classList.add('alert', 'alert-danger');

		this.solve_btn.classList.add('disabled');
	}

	public successfulSudoku() {
		this.message.innerHTML = this.success_msg;
		this.message.className = "";
		this.message.classList.add('alert', 'alert-success');
	}

	private initiatePhotoMask() {
		this.mask.classList.remove("d-none");
		this.video_stream.height = this.app.nn.img_height;
		this.video_stream.width = this.app.nn.img_width;
		this.video_canvas.height = this.app.nn.img_height;
		this.video_canvas.width = this.app.nn.img_width;

		const options = {
			audio: false,
			video: {
				facingMode: 'environment',
			},
		};
		navigator.mediaDevices.getUserMedia(options)
			.then(stream => {
				this.video_stream.srcObject = stream;
				this.video_stream.play();
			})
			.catch(err => {
				console.log("An error occurred: " + err);
			});
	}

	private takePhoto(){
		const context = this.video_canvas.getContext('2d');
		context.drawImage(this.video_stream, 0, 0, this.video_stream.width, this.video_stream.height);

		// Termination
		navigator.mediaDevices.getUserMedia({video: true, audio: false})
			.then(stream => {
				this.video_stream.srcObject = null;
				stream.getTracks().forEach(track => {
					if (track.readyState == 'live' && track.kind === 'video') {
						track.stop();
					}
				})
			})
			.catch(err => {
				console.log("An error occurred: " + err);
			});
		this.mask.classList.add("d-none");
		this.is_video_streaming = false;

		// send photo
		const image_base64 = this.video_canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
		this.app.sendPhoto(image_base64);
	}
}
