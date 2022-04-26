export class NN {
	get img_height(): number {
		return this._img_height;
	}

	set img_height(value: number) {
		this._img_height = value;
	}
	get img_width(): number {
		return this._img_width;
	}

	set img_width(value: number) {
		this._img_width = value;
	}
	private _img_width: number;
	private _img_height: number;

	constructor(width:number, height: number) {
		this.img_width = width;
		this.img_height = height;
	}
}