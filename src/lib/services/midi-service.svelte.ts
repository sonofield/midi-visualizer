import { getContext, setContext } from 'svelte';

export interface MidiDevice {
	id: string | null;
	name: string | null;
	manufacturer: string | null;
}

export class MidiService {
	private static readonly allDevicesItem: MidiDevice = {
		id: null,
		name: 'All Devices',
		manufacturer: null
	};
	private static readonly key = {};

	public static initializeContext(): MidiService {
		return setContext(this.key, new MidiService());
	}

	public static getContext() {
		return getContext(this.key) as MidiService;
	}

	#hasAccess: boolean | null = $state(null);
	public get hasAccess(): boolean | null {
		return this.#hasAccess;
	}

	#devices: MIDIInput[] = $state([]);
	public readonly availableDevices = $derived([
		MidiService.allDevicesItem,
		...this.#devices.map((device) => ({
			id: device.id,
			name: device.name,
			manufacturer: device.manufacturer
		}))
	]);

	#selectedDevice: MIDIInput | null = $state(null);
	public get selectedDevice(): MIDIInput | null {
		return this.#selectedDevice;
	}

	private constructor() {}

	#onMidiDown?: (key: number, velocity: number) => void;
	public setOnMidiDown = (onMidiDown: (key: number, velocity: number) => void) => {
		this.#onMidiDown = onMidiDown;
	};

	#onMidiUp?: (key: number) => void;
	public setOnMidiUp = (onMidiUp: (key: number) => void) => {
		this.#onMidiUp = onMidiUp;
	};

	public setSelectedDevice = (deviceId?: string) => {
		if (!deviceId) {
			return this.setAllDevices();
		}

		// empty the onmidimessage event
		this.#devices.forEach((device) => {
			device.onmidimessage = (event) => {};
		});

		this.#selectedDevice = this.#devices.find((device) => device.id === deviceId)!;
		this.#selectedDevice.onmidimessage = (event) => this.onMIDIMessage(event);
	};

	private setAllDevices = () => {
		this.#devices.forEach((device) => {
			device.onmidimessage = (event) => this.onMIDIMessage(event);
		});
	};

	public requestAccessAndGetDevices = () => {
		if (navigator.requestMIDIAccess) {
			navigator
				.requestMIDIAccess({
					sysex: true,
					software: true
				})
				.then(
					(access) => {
						this.#hasAccess = true;
						this.#devices = Array.from(access.inputs.values()) as MIDIInput[];
						this.setAllDevices();
					},
					(failure) => {
						console.error(failure);
						this.#hasAccess = false;
						this.#devices = [];
					}
				);
		} else {
			console.error('Web MIDI API is not supported in your browser');
		}
	};

	private onMIDIMessage = (event: MIDIMessageEvent) => {
		if (!event.data || event.data.length < 3) return;

		const [status, note, velocity] = event.data;

		// Check if it's a note on or note off event
		const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
		const isNoteOff = (status & 0xf0) === 0x80 || ((status & 0xf0) === 0x90 && velocity === 0);

		if (isNoteOn) {
			this.#onMidiDown?.(note, this.normalizeVelocity(velocity));
		} else if (isNoteOff) {
			this.#onMidiUp?.(note);
		}
	};

	private normalizeVelocity(value: number): number {
		// Ensure input is within bounds
		const clampedValue = Math.max(0, Math.min(127, value));

		// Convert to 0-1 range
		return clampedValue / 127;
	}
}
