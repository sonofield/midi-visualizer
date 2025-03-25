export class NoteName {
	public static readonly c = new NoteName('c', 'C', 0, 5);
	public static readonly cSharpDb = new NoteName('db', 'C#/Db', 1, 6);
	public static readonly d = new NoteName('d', 'D', 2, 7);
	public static readonly dSharpEb = new NoteName('eb', 'D#/Eb', 3, 8);
	public static readonly e = new NoteName('e', 'E', 4, 9);
	public static readonly f = new NoteName('f', 'F', 5, 10);
	public static readonly fSharpGb = new NoteName('gb', 'F#/Gb', 6, 11);
	public static readonly g = new NoteName('g', 'G', 7, 0);
	public static readonly gSharpAb = new NoteName('ab', 'G#/Ab', 8, 1);
	public static readonly a = new NoteName('a', 'A', 9, 2);
	public static readonly aSharpBb = new NoteName('bb', 'A#/Bb', 10, 3);
	public static readonly b = new NoteName('b', 'B', 11, 4);

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly distance: number,
		public readonly distanceFromG: number
	) {}

	public static readonly asToneList: NoteName[] = [
		this.c,
		this.cSharpDb,
		this.d,
		this.dSharpEb,
		this.e,
		this.f,
		this.fSharpGb,
		this.g,
		this.gSharpAb,
		this.a,
		this.aSharpBb,
		this.b
	];

	public static readonly asCOFList: NoteName[] = [
		this.c,
		this.g,
		this.d,
		this.a,
		this.e,
		this.b,
		this.fSharpGb,
		this.cSharpDb,
		this.gSharpAb,
		this.dSharpEb,
		this.aSharpBb,
		this.f
	];

	public static readonly asGRootList: NoteName[] = [
		this.g,
		this.gSharpAb,
		this.a,
		this.aSharpBb,
		this.b,
		this.c,
		this.cSharpDb,
		this.d,
		this.dSharpEb,
		this.e,
		this.f,
		this.fSharpGb
	];
}
