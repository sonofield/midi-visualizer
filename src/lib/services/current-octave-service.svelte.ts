import { Octave } from '$lib/types/octave';
import { getContext, setContext } from 'svelte';

export class CurrentOctaveService {
	private static readonly STORAGE_KEY = 'current-octave-id';

	private getStorageKey = (type: 'melody' | 'drone') => {
		return `${CurrentOctaveService.STORAGE_KEY}-${type}`;
	};

	private static readonly key = {};

	public static initializeContext(): CurrentOctaveService {
		return setContext(this.key, new CurrentOctaveService());
	}

	public static getContext() {
		return getContext(this.key) as CurrentOctaveService;
	}

	private constructor() {}

	#currentMelodyOctave = $state<Octave>(this.getStoredOctave('melody'));
	#currentDroneOctave = $state<Octave>(this.getStoredOctave('drone'));

	public get currentMelodyOctave(): Octave {
		return this.#currentMelodyOctave;
	}

	public get currentDroneOctave(): Octave {
		return this.#currentDroneOctave;
	}

	public setOctave(type: 'melody' | 'drone', octave: Octave): void {
		if (Octave.asList.includes(octave)) {
			if (type === 'melody') {
				this.#currentMelodyOctave = octave;
			} else {
				this.#currentDroneOctave = octave;
			}
			this.saveOctaveToStorage(type, octave);
		}
	}

	private getStoredOctave(type: 'melody' | 'drone'): Octave {
		try {
			const stored = localStorage.getItem(this.getStorageKey(type));
			const octave = Octave.asList.find((o) => o.id === stored);
			if (octave) {
				return octave;
			}
		} catch (error) {
			console.warn('Failed to read octave from localStorage:', error);
		}
		return type === 'melody' ? Octave.four : Octave.three;
	}

	private saveOctaveToStorage(type: 'melody' | 'drone', octave: Octave): void {
		try {
			localStorage.setItem(this.getStorageKey(type), octave.id);
		} catch (error) {
			console.warn('Failed to save octave to localStorage:', error);
		}
	}
}
