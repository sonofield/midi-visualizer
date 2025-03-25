export class NoteDegree {
	public static readonly one = new NoteDegree('1', 0);
	public static readonly flatTwo = new NoteDegree('b2', 1);
	public static readonly two = new NoteDegree('2', 2);
	public static readonly flatThree = new NoteDegree('b3', 3);
	public static readonly three = new NoteDegree('3', 4);
	public static readonly four = new NoteDegree('4', 5);
	public static readonly sharpFour = new NoteDegree('#4', 6);
	public static readonly five = new NoteDegree('5', 7);
	public static readonly flatSix = new NoteDegree('b6', 8);
	public static readonly six = new NoteDegree('6', 9);
	public static readonly flatSeven = new NoteDegree('b7', 10);
	public static readonly seven = new NoteDegree('7', 11);

	constructor(
		public name: string,
		public compareValue: number
	) {}

	public static readonly asCOFList = [
		this.one,
		this.five,
		this.two,
		this.six,
		this.three,
		this.seven,
		this.sharpFour,
		this.flatTwo,
		this.flatSix,
		this.flatThree,
		this.flatSeven,
		this.four
	];

	public static readonly asToneList = [
		this.one,
		this.flatTwo,
		this.two,
		this.flatThree,
		this.three,
		this.four,
		this.sharpFour,
		this.five,
		this.flatSix,
		this.six,
		this.flatSeven,
		this.seven
	];
}
