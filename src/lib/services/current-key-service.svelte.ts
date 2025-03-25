import { NoteName } from '$lib/types/note-name';
import { getContext, setContext } from 'svelte';

export class CurrentKeyService {
	private static readonly STORAGE_KEY = 'current-key-id';
	private static readonly key = {};

	public static initializeContext(): CurrentKeyService {
		return setContext(this.key, new CurrentKeyService());
	}

	public static getContext() {
		return getContext(this.key) as CurrentKeyService;
	}

	private constructor() {}

	#currentKey = $state<NoteName>(this.getStoredKey());

	public get currentKey(): NoteName {
		return this.#currentKey;
	}

	public setKey(key: NoteName): void {
		if (NoteName.asToneList.includes(key)) {
			this.#currentKey = key;
			this.saveKeyToStorage(key);
		}
	}

	public setRandomKey(): void {
		const randomIndex = Math.floor(Math.random() * 11);
		const notCurrentKey = NoteName.asToneList.filter((k) => k !== this.#currentKey);
		const key = notCurrentKey[randomIndex];
		this.#currentKey = key;
		this.saveKeyToStorage(key);
	}

	private getStoredKey(): NoteName {
		try {
			const stored = localStorage.getItem(CurrentKeyService.STORAGE_KEY);
			if (stored) {
				const key = NoteName.asToneList.find((k) => k.id === stored);
				if (key) {
					return key;
				}
			}
		} catch (error) {
			console.warn('Failed to read key from localStorage:', error);
		}
		return NoteName.c;
	}

	private saveKeyToStorage(key: NoteName): void {
		try {
			localStorage.setItem(CurrentKeyService.STORAGE_KEY, key.id);
		} catch (error) {
			console.warn('Failed to save key to localStorage:', error);
		}
	}
}
