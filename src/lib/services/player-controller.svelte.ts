import {
	CurrentOctaveService,
	CurrentVolumeService,
	DegreeHelper,
	MidiService,
	NoteNameHelper
} from '$lib';
import type { MidiHistory } from '$lib/types/midi-history';
import type { NoteName } from '$lib/types/note-name';
import type { Octave } from '$lib/types/octave';
import type { SynthConfig } from '$lib/types/synth-preset';
import { getContext, setContext } from 'svelte';
import type { CircleService } from './circle-service.svelte';
import type { CurrentKeyService } from './current-key-service.svelte';
import type { CurrentPresetService } from './current-preset-service.svelte';
import type { SynthService } from './synth-service.svelte';

export class PlayerController {
	private static readonly key = {};

	public static initializeContext({
		circleService,
		synthService,
		tonicService,
		volumeService,
		presetService,
		octaveService,
		midiService
	}: {
		circleService: CircleService;
		synthService: SynthService;
		tonicService: CurrentKeyService;
		volumeService: CurrentVolumeService;
		presetService: CurrentPresetService;
		octaveService: CurrentOctaveService;
		midiService: MidiService;
	}): PlayerController {
		return setContext(
			this.key,
			new PlayerController(
				circleService,
				synthService,
				tonicService,
				volumeService,
				presetService,
				octaveService,
				midiService
			)
		);
	}

	public static getContext() {
		return getContext(this.key) as PlayerController;
	}

	private constructor(
		private circleService: CircleService,
		private synthService: SynthService,
		private tonicService: CurrentKeyService,
		private volumeService: CurrentVolumeService,
		private presetService: CurrentPresetService,
		private octaveService: CurrentOctaveService,
		private midiService: MidiService
	) {
		midiService.setOnMidiDown(this.playMidiNote);
		midiService.setOnMidiUp(this.stopMidiNote);
		midiService.setOnMidiModWheel(this.setMelodyGain);

		circleService.setOnDegreeUp(this.onCircleDegreeTapUp);
		circleService.setOnDegreeDown(this.onCircleDegreeTapDown);
	}

	#isSynthInitialized = $state(false);
	#isCircleInitialized = $state(false);
	#isInitialized = $derived(this.#isSynthInitialized && this.#isCircleInitialized);

	public get isInitialized() {
		return this.#isInitialized;
	}

	public initializeSynth = async () => {
		if (this.#isSynthInitialized) return;
		await this.synthService.initialize();
		this.#isSynthInitialized = true;
	};

	public initializeCircle = ({ canvas }: { canvas: HTMLCanvasElement }) => {
		if (this.#isCircleInitialized) return;
		this.circleService.initialize(canvas);
		this.#isCircleInitialized = true;
	};

	public disposeCircle = () => {
		this.circleService.dispose();
	};

	public disposeSynth = () => {
		this.synthService.dispose();
	};

	public get availableMidiDevices() {
		return this.midiService.availableDevices;
	}

	public get selectedMidiDevice() {
		return this.midiService.selectedDevice;
	}

	public requestMidiAccessAndGetDevices() {
		this.midiService.requestAccessAndGetDevices();
	}

	public setSelectedMidiDevice(deviceId?: string) {
		this.midiService.setSelectedDevice(deviceId);
	}

	#isPlaying = $state(false);
	public get isPlaying() {
		return this.#isPlaying;
	}

	public start() {
		if (!this.#isInitialized) return;
		if (this.#isPlaying) return;
		this.#isPlaying = true;
		this.circleService.unhighlightAll();
		this.synthService.start();
	}

	public stop() {
		if (!this.#isPlaying) return;
		this.#isPlaying = false;
		this.synthService.stop();
		this.circleService.unhighlightAll();
		this.#midiHistory = [];
	}

	#midiHistory: MidiHistory[] = [];

	public playMidiNote = (midi: number, velocity: number = 1) => {
		if (!this.#isPlaying) return;
		if (this.#midiHistory.some((m) => m.midi === midi)) return;

		const midiHistory = [...this.#midiHistory];
		const nextMidiHistory = [...this.#midiHistory, { midi, velocity }];
		this.synthService.playMidiNote({ midi, velocity, midiHistory, nextMidiHistory });
		this.#midiHistory = [...nextMidiHistory];

		// IF mono, unhighlight all circles first
		// TODO skip on octave?
		if (this.synthService.isMono) {
			this.circleService.unhighlightAll();
		}

		const index = DegreeHelper.getCOFIndexByKey(midi, this.tonicService.currentKey);
		this.circleService.highlightDegree(index);
	};

	public stopMidiNote = (midi: number) => {
		if (!this.#isPlaying) return;
		if (!this.#midiHistory.some((m) => m.midi === midi)) return;

		const midiHistory = [...this.#midiHistory];
		const nextMidiHistory = midiHistory.filter((n) => n.midi !== midi);
		this.synthService.stopMidiNote({ midi, midiHistory, nextMidiHistory });
		this.#midiHistory = nextMidiHistory;

		const degreeIndex = DegreeHelper.getCOFIndexByKey(midi, this.tonicService.currentKey);
		this.circleService.unhighlightDegree(degreeIndex);

		if (this.synthService.isMono && this.#midiHistory.length > 0) {
			const lastMidi = this.#midiHistory[this.#midiHistory.length - 1];
			const index = DegreeHelper.getCOFIndexByKey(lastMidi.midi, this.tonicService.currentKey);
			this.circleService.highlightDegree(index);
		}
	};

	public setMelodyGain = (velocity: number) => {
		this.synthService.setMelodyGain(velocity);
	};

	public get melodyGainValue() {
		return this.synthService.melodyGainValue;
	}

	public get melodyGainTouched() {
		return this.synthService.melodyGainTouched;
	}

	public static readonly MAX_CIRCLE_SIZE = 600;
	public maxCircleSize = $state(PlayerController.MAX_CIRCLE_SIZE);

	public setMaxCircleSize = (size: number) => {
		this.maxCircleSize = size;
		this.circleService.resetCanvas();
	};

	public get currentPreset(): SynthConfig {
		return this.presetService.currentPreset;
	}

	public setPreset(presetId: string) {
		this.presetService.setPreset(presetId);
		this.stop();
	}

	public get currentMelodyOctave(): Octave {
		return this.octaveService.currentMelodyOctave;
	}

	public get currentDroneOctave(): Octave {
		return this.octaveService.currentDroneOctave;
	}

	public setMelodyOctave(octave: Octave) {
		this.octaveService.setOctave('melody', octave);
		this.stop();
	}

	public setDroneOctave(octave: Octave) {
		this.octaveService.setOctave('drone', octave);
		this.stop();
	}

	public get currentMelodyVolume(): number {
		return this.volumeService.currentMelodyVolume;
	}

	public get currentDroneVolume(): number {
		return this.volumeService.currentDroneVolume;
	}

	public setMelodyVolume(volume: number) {
		this.synthService.setMelodyVolume(volume);
	}

	public setDroneVolume(volume: number) {
		this.synthService.setDroneVolume(volume);
	}

	public get currentKey(): NoteName {
		return this.tonicService.currentKey;
	}

	public setKey(key: NoteName) {
		this.tonicService.setKey(key);
		this.stop();
	}

	public setRandomKey() {
		this.tonicService.setRandomKey();
		this.stop();
	}

	private onCircleDegreeTapUp = (index: number) => {
		const midi = NoteNameHelper.keyRelativeToIndexAndTonicGRoot({
			index,
			tonic: this.tonicService.currentKey,
			octave: this.octaveService.currentMelodyOctave
		});
		this.stopMidiNote(midi);
	};

	private onCircleDegreeTapDown = (index: number) => {
		const midi = NoteNameHelper.keyRelativeToIndexAndTonicGRoot({
			index,
			tonic: this.tonicService.currentKey,
			octave: this.octaveService.currentMelodyOctave
		});
		this.playMidiNote(midi);
	};
}
