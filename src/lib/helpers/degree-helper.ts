import { NoteDegree } from '$lib/types/note-degree';
import { NoteName } from '$lib/types/note-name';

export class DegreeHelper {
	public static getCOFIndexByKey(key: number, tonic: NoteName): number {
		const index = key % 12;
		const note = NoteName.asToneList[index];
		const tonicIndex = NoteName.asCOFList.findIndex((n) => n.id === tonic.id);
		const cofList = [...NoteName.asCOFList];
		const start = cofList.slice(tonicIndex);
		const end = cofList.slice(0, tonicIndex);
		const combined = [...start, ...end];
		const cofIndex = combined.findIndex((n) => n.id === note.id);
		return cofIndex;
	}

	public static getDegreeIndexCOF(degree: NoteDegree) {
		return NoteDegree.asCOFList.findIndex((d) => d.name === degree.name);
	}

	public static getDegreeByIndexCOF(index: number) {
		return NoteDegree.asCOFList[index];
	}
}
