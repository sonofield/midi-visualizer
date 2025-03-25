import { Octave } from '$lib/types/octave';

export class OctaveHelper {
	public static getOctaveByValue(value: number): Octave {
		return Octave.asList.find((octave) => octave.value === value)!;
	}
}
