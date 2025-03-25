export class Octave {
	public static readonly one = new Octave('1', '1', 1, -36);
	public static readonly two = new Octave('2', '2', 2, -24);
	public static readonly three = new Octave('3', '3', 3, -12);
	public static readonly four = new Octave('4', '4', 4, 0);
	public static readonly five = new Octave('5', '5', 5, 12);

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly value: number,
		public readonly tuning: number
	) {}

	public static readonly asList = [this.one, this.two, this.three, this.four, this.five];
}
