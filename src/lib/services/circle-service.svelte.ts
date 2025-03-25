import { DegreeHelper, type AppRiveEvent } from '$lib';
import { NoteDegree } from '$lib/types/note-degree';
import * as rive from '@rive-app/canvas';
import { getContext, setContext } from 'svelte';

export class CircleService {
	private static readonly key = {};

	public static initializeContext(): CircleService {
		return setContext(this.key, new CircleService());
	}

	public static getContext() {
		return getContext(this.key) as CircleService;
	}

	#onDegreeUp: (index: number) => void = () => {};
	public setOnDegreeUp = (onDegreeUp: (index: number) => void) => {
		this.#onDegreeUp = onDegreeUp;
	};

	#onDegreeDown: (index: number) => void = () => {};
	public setOnDegreeDown = (onDegreeDown: (index: number) => void) => {
		this.#onDegreeDown = onDegreeDown;
	};

	private constructor() {}

	private r: rive.Rive | null = null;

	public initialize = (canvas: HTMLCanvasElement) => {
		this.r = new rive.Rive({
			canvas: canvas,
			src: '/rive/circle.riv',
			autoplay: true,
			artboard: 'Sonofield',
			stateMachines: 'Sonofield',
			isTouchScrollEnabled: true,
			onLoad: () => {
				this.resetCanvas();
				NoteDegree.asCOFList.forEach((degree) => {
					this.r!.setBooleanStateAtPath('isHighlighted', true, `Nip ${degree.name}`);
				});
			}
		});

		this.r!.on(rive.EventType.RiveEvent, (event) => {
			const data = event.data as rive.RiveEventPayload;
			if (data.name) {
				this.handleRiveEvent(data.name as AppRiveEvent);
			}
		});
	};

	public resetCanvas = () => {
		this.r!.resizeDrawingSurfaceToCanvas();
	};

	private handleRiveEvent = (name: AppRiveEvent) => {
		switch (name) {
			case '0Up':
				return this.#onDegreeUp(0);
			case '0Down':
				return this.#onDegreeDown(0);
			case '1Up':
				return this.#onDegreeUp(1);
			case '1Down':
				return this.#onDegreeDown(1);
			case '2Up':
				return this.#onDegreeUp(2);
			case '2Down':
				return this.#onDegreeDown(2);
			case '3Up':
				return this.#onDegreeUp(3);
			case '3Down':
				return this.#onDegreeDown(3);
			case '4Up':
				return this.#onDegreeUp(4);
			case '4Down':
				return this.#onDegreeDown(4);
			case '5Up':
				return this.#onDegreeUp(5);
			case '5Down':
				return this.#onDegreeDown(5);
			case '6Up':
				return this.#onDegreeUp(6);
			case '6Down':
				return this.#onDegreeDown(6);
			case '7Up':
				return this.#onDegreeUp(7);
			case '7Down':
				return this.#onDegreeDown(7);
			case '8Up':
				return this.#onDegreeUp(8);
			case '8Down':
				return this.#onDegreeDown(8);
			case '9Up':
				return this.#onDegreeUp(9);
			case '9Down':
				return this.#onDegreeDown(9);
			case '10Up':
				return this.#onDegreeUp(10);
			case '10Down':
				return this.#onDegreeDown(10);
			case '11Up':
				return this.#onDegreeUp(11);
			case '11Down':
				return this.#onDegreeDown(11);
		}
	};

	public unhighlightAll = () => {
		for (let i = 0; i < 12; i++) {
			this.handleDegreeUI(i, false);
		}
	};

	public dispose = () => {
		this.unhighlightAll();
		this.r!.removeAllRiveEventListeners();
		this.r!.cleanup();
	};

	public highlightDegree = (index: number) => {
		this.handleDegreeUI(index, true);
	};

	public unhighlightDegree = (index: number) => {
		this.handleDegreeUI(index, false);
	};

	private handleDegreeUI = (index: number, value: boolean) => {
		const degree = DegreeHelper.getDegreeByIndexCOF(index);
		this.r!.setBooleanStateAtPath('isActive', value, `Active ${degree.name}`);
		this.r!.setBooleanStateAtPath('isActive', value, `Num ${degree.name}`);
		this.r!.setBooleanStateAtPath('isSelected', value, `Nip ${degree.name}`);
	};
}
