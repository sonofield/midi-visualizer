import * as Tone from 'tone';

export interface SynthConfig {
	id: string;
	name: string;
	type: 'poly' | 'mono';
	config: Partial<Tone.MonoSynthOptions>;
}

export interface ChorusConfig {
	id: string;
	name: string;
	config: Partial<Tone.ChorusOptions>;
}

export interface ReverbConfig {
	id: string;
	name: string;
	config: any;
}

export class SynthEffect {
	public static readonly reverb: ReverbConfig = {
		id: 'reverb',
		name: 'Reverb',
		config: {
			decay: 3,
			preDelay: 0.08,
			wet: 0.13
		}
	};

	public static readonly chorus: ChorusConfig = {
		id: 'chorus',
		name: 'Chorus',
		config: {
			depth: 1,
			feedback: 0.38,
			delayTime: 1.1,
			wet: 0.12,
			type: 'sine',
			spread: 180,
			frequency: 0.1
		}
	};
}

export class SynthPreset {
	public static readonly drone: SynthConfig = {
		id: 'drone',
		name: 'Drone',
		type: 'mono',
		config: {
			oscillator: {
				type: 'sine',
				phase: 0,
				volume: 0,
				mute: false,
				onstop: () => {}
			},
			envelope: {
				attack: 2,
				decay: 0.2,
				sustain: 1,
				release: 3,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 1,
				rolloff: -24,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.15,
				decay: 0.15,
				sustain: 1,
				release: 0.1,
				octaves: 4,
				exponent: 1,
				baseFrequency: 1000,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly default: SynthConfig = {
		id: 'default',
		name: 'Default',
		type: 'mono',
		config: {
			oscillator: {
				type: 'sawtooth',
				phase: 0,
				volume: 0,
				mute: false,
				partialCount: 1,
				onstop: () => {}
			},
			envelope: {
				attack: 0.04,
				decay: 0.0,
				sustain: 1,
				release: 0.17,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 4,
				rolloff: -12,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.06,
				decay: 2.0,
				sustain: 0.25,
				release: 2.24,
				octaves: 0.9,
				exponent: 1,
				baseFrequency: 300,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0.03,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly bright: SynthConfig = {
		id: 'bright',
		name: 'Bright',
		type: 'poly',
		config: {
			oscillator: {
				type: 'square',
				phase: 0,
				volume: 0,
				mute: false,
				onstop: () => {}
			},
			envelope: {
				attack: 0.05,
				decay: 0.2,
				sustain: 1,
				release: 0.4,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 1,
				rolloff: -24,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.15,
				decay: 0.15,
				sustain: 1,
				release: 0.1,
				octaves: 4,
				exponent: 1,
				baseFrequency: 1000,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly soft: SynthConfig = {
		id: 'soft',
		name: 'Soft',
		type: 'poly',
		config: {
			oscillator: {
				type: 'sine',
				phase: 0,
				volume: 0,
				mute: false,
				onstop: () => {}
			},
			envelope: {
				attack: 0.3,
				decay: 0.3,
				sustain: 0.7,
				release: 1.2,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 1,
				rolloff: -24,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.15,
				decay: 0.15,
				sustain: 1,
				release: 0.1,
				octaves: 4,
				exponent: 1,
				baseFrequency: 1000,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly pluck: SynthConfig = {
		id: 'pluck',
		name: 'Pluck',
		type: 'poly',
		config: {
			oscillator: {
				type: 'triangle',
				phase: 0,
				volume: 0,
				mute: false,
				onstop: () => {}
			},
			envelope: {
				attack: 0.02,
				decay: 0.15,
				sustain: 0.2,
				release: 0.3,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 1,
				rolloff: -24,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.15,
				decay: 0.15,
				sustain: 1,
				release: 0.1,
				octaves: 4,
				exponent: 1,
				baseFrequency: 1000,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly lead: SynthConfig = {
		id: 'lead',
		name: 'Lead',
		type: 'mono',
		config: {
			oscillator: {
				type: 'sawtooth',
				phase: 0,
				volume: 0,
				mute: false,
				onstop: () => {}
			},
			envelope: {
				attack: 0.05,
				decay: 0.1,
				sustain: 0.9,
				release: 0.4,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			filter: {
				type: 'lowpass',
				gain: 0,
				frequency: 0,
				Q: 1,
				rolloff: -24,
				detune: 0
			},
			filterEnvelope: {
				attack: 0.15,
				decay: 0.15,
				sustain: 1,
				release: 0.1,
				octaves: 4,
				exponent: 1,
				baseFrequency: 1000,
				attackCurve: 'linear',
				decayCurve: 'exponential',
				releaseCurve: 'exponential'
			},
			portamento: 0.05,
			detune: 0,
			volume: 0,
			onsilence: () => {}
		}
	};

	public static readonly asList = [
		this.default,
		this.bright,
		this.soft,
		this.pluck,
		this.lead
	] as const;
}
