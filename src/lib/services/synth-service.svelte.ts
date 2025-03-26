import { SynthEffect, SynthPreset } from '$lib/types/synth-preset';
import { getContext, setContext } from 'svelte';
import * as Tone from 'tone';

import {
	NoteNameHelper,
	type CurrentKeyService,
	type CurrentOctaveService,
	type CurrentPresetService,
	type CurrentVolumeService
} from '$lib';
import type { MidiHistory } from '$lib/types/midi-history';

export class SynthService {
	private static readonly RISE_TIME = 0.08;
	private static readonly key = {};

	public static initializeContext({
		currentPresetService,
		currentVolumeService,
		tonicService,
		octaveService
	}: {
		currentPresetService: CurrentPresetService;
		currentVolumeService: CurrentVolumeService;
		tonicService: CurrentKeyService;
		octaveService: CurrentOctaveService;
	}): SynthService {
		return setContext(
			this.key,
			new SynthService(currentPresetService, currentVolumeService, tonicService, octaveService)
		);
	}

	public static getContext() {
		return getContext(this.key) as SynthService;
	}

	private constructor(
		private currentPresetService: CurrentPresetService,
		private currentVolumeService: CurrentVolumeService,
		private tonicService: CurrentKeyService,
		private octaveService: CurrentOctaveService
	) {}

	#melodyInputChannel?: Tone.Channel;
	#droneInputChannel?: Tone.Channel;

	public droneSynth?: Tone.MonoSynth;
	public melodySynth?: Tone.PolySynth<Tone.MonoSynth> | Tone.MonoSynth;

	#melodyReverb?: Tone.Reverb;
	public get melodyReverb() {
		return this.#melodyReverb;
	}
	#melodyChorus?: Tone.Chorus;
	public get melodyChorus() {
		return this.#melodyChorus;
	}
	#droneReverb?: Tone.Reverb;
	public get droneReverb() {
		return this.#droneReverb;
	}
	#droneChorus?: Tone.Chorus;
	public get droneChorus() {
		return this.#droneChorus;
	}

	public get isMono() {
		return this.melodySynth instanceof Tone.MonoSynth;
	}

	private initializeMasterChannel() {
		const limiter = new Tone.Limiter(-3);

		// Create master compressor to prevent clipping
		const compressor = new Tone.Compressor({
			threshold: -24,
			ratio: 4,
			attack: 0.003,
			release: 0.25
		});

		// Create master channel with moderate gain reduction
		const masterChannel = new Tone.Channel({
			volume: -3,
			channelCount: 2
		})
			.connect(limiter)
			.toDestination();

		this.#melodyInputChannel = new Tone.Channel({
			volume: -6,
			channelCount: 2
		});
		this.#droneInputChannel = new Tone.Channel({
			volume: -10,
			channelCount: 2
		});

		this.#melodyReverb = new Tone.Reverb(SynthEffect.reverb.config);
		this.#melodyChorus = new Tone.Chorus(SynthEffect.chorus.config).start();
		this.#droneReverb = new Tone.Reverb(SynthEffect.reverb.config);
		this.#droneChorus = new Tone.Chorus(SynthEffect.chorus.config).start();

		this.#melodyInputChannel.chain(
			this.#melodyChorus,
			this.#melodyReverb,
			compressor,
			masterChannel
		);
		this.#droneInputChannel.chain(this.#droneChorus, this.#droneReverb, compressor, masterChannel);
	}

	public async initialize() {
		await Tone.start();
		this.initializeMasterChannel();
		this.setDroneSynth();
		this.setMelodySynth(this.currentPresetService.currentPreset.id);
	}

	private setDroneSynth() {
		// Connect drone synth through the effects chain
		this.droneSynth = new Tone.MonoSynth({
			...SynthPreset.drone.config,
			volume: this.currentVolumeService.currentDroneVolume
		});

		this.droneSynth!.connect(this.#droneInputChannel!);
	}

	#melodyGain?: Tone.Gain;
	private setMelodySynth(presetId: string) {
		const preset = SynthPreset.asList.find((p) => p.id === presetId);
		if (!preset) return;

		// If there's an existing synth, dispose of it
		this.melodySynth?.dispose();
		this.#melodyGain?.dispose();
		this.currentPresetService.setPreset(presetId);

		const config = {
			...preset.config,
			volume: this.currentVolumeService.currentMelodyVolume
		};

		// Create new synth with the selected preset
		if (preset.type === 'poly') {
			this.melodySynth = new Tone.PolySynth(Tone.MonoSynth, config);
		} else {
			this.melodySynth = new Tone.MonoSynth(config);
		}

		this.#melodyGain = new Tone.Gain(1);

		// Connect through filter then to effects for parallel processing
		this.melodySynth?.chain(this.#melodyGain, this.#melodyInputChannel!);
	}

	private midiToNote(midi: number): string {
		return Tone.Frequency(midi, 'midi').toNote();
	}

	public start = () => {
		const key = NoteNameHelper.keyTonicFromOctave({
			tonic: this.tonicService.currentKey,
			octave: this.octaveService.currentDroneOctave
		});
		this.setMelodySynth(this.currentPresetService.currentPreset.id);
		this.playDrone(key);
	};

	public stop = () => {
		this.stopAll();
	};

	private playDrone = (midi: number) => {
		const note = this.midiToNote(midi);
		this.droneSynth?.triggerAttack(note);
	};

	private stopDrone = () => {
		this.droneSynth?.triggerRelease();
	};

	public playMidiNote = ({
		midi,
		velocity = 1,
		midiHistory,
		nextMidiHistory
	}: {
		midi: number;
		velocity: number;
		midiHistory: MidiHistory[];
		nextMidiHistory: MidiHistory[];
	}) => {
		const note = this.midiToNote(midi);

		const isFirstNote = midiHistory.length === 0;

		if (this.melodySynth instanceof Tone.MonoSynth && !isFirstNote) {
			this.melodySynth?.setNote(note);
			this.#melodyGain?.gain.linearRampTo(velocity, SynthService.RISE_TIME);
		} else if (this.melodySynth instanceof Tone.MonoSynth) {
			this.#melodyGain?.set({
				gain: velocity
			});
			this.melodySynth?.triggerAttack(note, Tone.now(), 1);
		} else if (this.melodySynth instanceof Tone.PolySynth) {
			this.melodySynth.triggerAttack(note, Tone.now(), velocity);
		}
	};

	public stopMidiNote = ({
		midi,
		midiHistory,
		nextMidiHistory
	}: {
		midi: number;
		midiHistory: MidiHistory[];
		nextMidiHistory: MidiHistory[];
	}) => {
		const note = this.midiToNote(midi);

		const isLastNote = midiHistory.length === 1;
		if (this.melodySynth instanceof Tone.MonoSynth) {
			if (isLastNote) {
				this.melodySynth.triggerRelease();
			} else {
				const lastMidi = nextMidiHistory[nextMidiHistory.length - 1];
				const lastNote = this.midiToNote(lastMidi.midi);
				this.melodySynth.setNote(lastNote);
				this.#melodyGain?.gain.linearRampTo(lastMidi.velocity, SynthService.RISE_TIME);
			}
		} else if (this.melodySynth instanceof Tone.PolySynth) {
			this.melodySynth.triggerRelease(note);
		}
	};

	private stopAll = () => {
		this.stopDrone();
		this.stopAllMelodyNotes();
	};

	private stopAllMelodyNotes() {
		if (this.melodySynth instanceof Tone.MonoSynth) {
			this.melodySynth.triggerRelease();
		} else if (this.melodySynth instanceof Tone.PolySynth) {
			this.melodySynth.releaseAll();
		}
	}

	public configureMelodySynth = (options: Partial<Tone.SynthOptions>) => {
		if (!this.melodySynth) return;

		const nextOptions = this.calculateNextSynthOptions(this.melodySynth.get(), options);

		this.melodySynth.set(nextOptions);
	};

	public configureDroneSynth = (options: Partial<Tone.SynthOptions>) => {
		if (!this.droneSynth) return;

		const nextOptions = this.calculateNextSynthOptions(this.droneSynth.get(), options);

		this.droneSynth.set(nextOptions);
	};

	private calculateNextSynthOptions = (
		currentOptions: Tone.SynthOptions,
		nextOptions: Partial<Tone.SynthOptions>
	) => {
		let options = {
			...currentOptions,
			portamento: nextOptions.portamento
		};

		options.envelope = {
			...currentOptions.envelope,
			...nextOptions.envelope
		};
		options.oscillator = {
			...currentOptions.oscillator,
			...nextOptions.oscillator
		};

		return options;
	};

	public setDroneVolume = (volume: number) => {
		this.droneSynth?.set({
			volume: volume
		});
		this.currentVolumeService.setDroneVolume(volume);
	};

	public setMelodyVolume = (volume: number) => {
		this.melodySynth?.set({
			volume: volume
		});
		this.currentVolumeService.setMelodyVolume(volume);
	};

	public configureMelodyReverb = (options: Partial<Tone.FreeverbOptions>) => {
		if (!this.#melodyReverb) return;

		const nextOptions = this.calculateNextReverbOptions(this.#melodyReverb.get(), options);

		this.#melodyReverb.set(nextOptions);
	};

	public configureMelodyChorus = (options: Partial<Tone.ChorusOptions>) => {
		if (!this.#melodyChorus) return;

		const nextOptions = this.calculateNextChorusOptions(this.#melodyChorus.get(), options);

		this.#melodyChorus.set(nextOptions);
	};

	public configureDroneReverb = (options: Partial<Tone.FreeverbOptions>) => {
		if (!this.#droneReverb) return;

		const nextOptions = this.calculateNextReverbOptions(this.#droneReverb.get(), options);

		this.#droneReverb.set(nextOptions);
	};

	public configureDroneChorus = (options: Partial<Tone.ChorusOptions>) => {
		if (!this.#droneChorus) return;

		const nextOptions = this.calculateNextChorusOptions(this.#droneChorus.get(), options);

		this.#droneChorus.set(nextOptions);
	};

	private calculateNextReverbOptions = (currentOptions: any, nextOptions: any) => {
		let options = {
			...currentOptions,
			...nextOptions
		};

		return options;
	};

	private calculateNextChorusOptions = (
		currentOptions: Tone.ChorusOptions,
		nextOptions: Partial<Tone.ChorusOptions>
	) => {
		let options = {
			...currentOptions,
			...nextOptions
		};

		return options;
	};

	public configureMelodyFilter = (options: Partial<Tone.FilterOptions>) => {
		if (!this.melodySynth) return;

		const nextOptions = this.calculateNextFilterOptions(
			this.melodySynth.get().filter as any,
			options
		);

		this.melodySynth.set({ filter: nextOptions });
	};

	public configureDroneFilter = (options: Partial<Tone.FilterOptions>) => {
		if (!this.droneSynth) return;

		const nextOptions = this.calculateNextFilterOptions(
			this.droneSynth.get().filter as any,
			options
		);

		this.droneSynth.set({ filter: nextOptions });
	};

	private calculateNextFilterOptions = (
		currentOptions: Tone.FilterOptions,
		nextOptions: Partial<Tone.FilterOptions>
	) => {
		let options = {
			...currentOptions,
			...nextOptions
		};

		return options;
	};

	public configureMelodyFilterEnvelope = (options: Partial<Tone.EnvelopeOptions>) => {
		if (!this.melodySynth) return;

		const nextOptions = this.calculateNextFilterEnvelopeOptions(
			this.melodySynth.get().filterEnvelope as any,
			options
		);

		this.melodySynth.set({ filterEnvelope: nextOptions });
	};

	public configureDroneFilterEnvelope = (options: Partial<Tone.EnvelopeOptions>) => {
		if (!this.droneSynth) return;

		const nextOptions = this.calculateNextFilterEnvelopeOptions(
			this.droneSynth.get().filterEnvelope as any,
			options
		);

		this.droneSynth.set({ filterEnvelope: nextOptions });
	};

	private calculateNextFilterEnvelopeOptions = (
		currentOptions: Tone.EnvelopeOptions,
		nextOptions: Partial<Tone.EnvelopeOptions>
	) => {
		let options = {
			...currentOptions,
			...nextOptions
		};

		return options;
	};

	public setMelodyVelocity = (velocity: number) => {
		if (!this.melodySynth || !this.#melodyGain) return;

		if (this.melodySynth instanceof Tone.MonoSynth) {
			this.#melodyGain?.set({
				gain: velocity
			});
		}
		// PolySynth is not handled with mod
	};

	public dispose() {
		/* this.#melodySynth?.dispose();
		this.#droneSynth?.dispose();
		this.#melodyReverb?.dispose();
		this.#droneReverb?.dispose();
		this.#melodyChorus?.dispose();
		this.#droneChorus?.dispose();
		this.#melodyInputChannel?.dispose();
		this.#droneInputChannel?.dispose(); */
	}
}
