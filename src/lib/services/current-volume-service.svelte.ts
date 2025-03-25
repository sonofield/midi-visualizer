import { getContext, setContext } from 'svelte';

export class CurrentVolumeService {
	private static readonly STORAGE_KEY = 'current-volume';

	private static getStorageKey(type: 'melody' | 'drone'): string {
		return `${this.STORAGE_KEY}-${type}`;
	}

	private static readonly key = {};

	public static initializeContext(): CurrentVolumeService {
		return setContext(this.key, new CurrentVolumeService());
	}

	public static getContext() {
		return getContext(this.key) as CurrentVolumeService;
	}

	private constructor() {}

	#currentMelodyVolume = $state<number>(this.getStoredVolume('melody'));
	#currentDroneVolume = $state<number>(this.getStoredVolume('drone'));

	public get currentMelodyVolume(): number {
		return this.#currentMelodyVolume;
	}

	public get currentDroneVolume(): number {
		return this.#currentDroneVolume;
	}

	public setDroneVolume(volume: number): void {
		this.#currentDroneVolume = volume;
		this.saveVolumeToStorage(volume, 'drone');
	}

	public setMelodyVolume(volume: number): void {
		this.#currentMelodyVolume = volume;
		this.saveVolumeToStorage(volume, 'melody');
	}

	private getStoredVolume(type: 'melody' | 'drone'): number {
		try {
			const stored = localStorage.getItem(CurrentVolumeService.getStorageKey(type));
			if (stored) {
				const volume = parseFloat(stored);
				if (!isNaN(volume)) {
					return volume;
				}
			}
		} catch (error) {
			console.warn('Failed to read volume from localStorage:', error);
		}
		return -6; // Default volume
	}

	private saveVolumeToStorage(volume: number, type: 'melody' | 'drone'): void {
		try {
			localStorage.setItem(CurrentVolumeService.getStorageKey(type), volume.toString());
		} catch (error) {
			console.warn('Failed to save volume to localStorage:', error);
		}
	}
}
