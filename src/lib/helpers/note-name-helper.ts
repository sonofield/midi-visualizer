import { NoteName } from '$lib/types/note-name';
import type { Octave } from '$lib/types/octave';

export class NoteNameHelper {
	private static cofMemory: { [key: string]: NoteName[] } = {};
	private static toneMemory: { [key: string]: NoteName[] } = {};

	public static getNoteNameByName(name: string): NoteName {
		return NoteName.asToneList.find((note) => note.name === name)!;
	}

	public static getTonicRootedCOFList(tonic: NoteName): NoteName[] {
		if (this.cofMemory[tonic.name]) {
			return this.cofMemory[tonic.name];
		}

		const tonicIndex = NoteName.asCOFList.findIndex((note) => note.name === tonic.name);
		const end = NoteName.asCOFList.slice(0, tonicIndex);
		const start = NoteName.asCOFList.slice(tonicIndex);
		const result = [...start, ...end];

		this.cofMemory[tonic.name] = result;
		return result;
	}

	public static getTonicRootedToneList(tonic: NoteName): NoteName[] {
		if (this.toneMemory[tonic.name]) {
			return this.toneMemory[tonic.name];
		}

		const tonicIndex = NoteName.asToneList.findIndex((note) => note.name === tonic.name);
		const end = NoteName.asToneList.slice(0, tonicIndex);
		const start = NoteName.asToneList.slice(tonicIndex);
		const result = [...start, ...end];

		this.toneMemory[tonic.name] = result;
		return result;
	}

	public static keyRelativeToIndexAndTonicGRoot({
		index,
		tonic,
		octave
	}: {
		index: number;
		tonic: NoteName;
		octave: Octave;
	}): number {
		const cofList = this.getTonicRootedCOFList(tonic);
		const note = cofList[index];
		const toneList = this.getTonicRootedToneList(tonic);
		const toneDistance = toneList.findIndex((n) => n.name === note.name);
		const rootDistance = NoteName.asGRootList.findIndex((n) => n.name === tonic.name);
		const octaveRootKey = 55 + rootDistance;
		const degreeKey = octaveRootKey + octave.tuning + toneDistance;
		return degreeKey;
	}

	public static keyRelativeToIndexAndTonic({
		index,
		tonic,
		octave
	}: {
		index: number;
		tonic: NoteName;
		octave: Octave;
	}): number {
		const cofList = this.getTonicRootedCOFList(tonic);
		const note = cofList[index];
		return 60 + octave.tuning + note.distance;
	}

	public static keyTonicFromOctave({ tonic, octave }: { tonic: NoteName; octave: Octave }): number {
		const tonicIndex = NoteName.asToneList.findIndex((note) => note.name === tonic.name);
		return 60 + octave.tuning + tonicIndex;
	}
}
