import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from "lodash";
import { SwimCalculationMethod } from "./swim-calculation-method.model";
import { FormulaParams } from "./formula-params.model";

@Component({
	selector: 'app-swim-ftp-helper',
	templateUrl: './swim-ftp-helper.component.html',
	styleUrls: ['./swim-ftp-helper.component.scss']
})
export class SwimFtpHelperComponent implements OnInit {

	/**
	 * Convert swimming speed to swimming pace
	 * @param {number} swimFtp: speed in meters / min
	 * @returns {string} Swim FTP pace hh:mm:ss / 100 meters
	 */
	public static convertSwimSpeedToPace(swimFtp: number): string {

		let totalSeconds = 1 / (swimFtp / 60) * 100;
		const hours = ("00" + Math.floor(totalSeconds / 3600)).slice(-2);
		totalSeconds %= 3600;
		const minutes = ("00" + Math.round(totalSeconds / 60)).slice(-2);
		const seconds = ("00" + Math.round(totalSeconds % 60)).slice(-2);

		return (!swimFtp || swimFtp <= 0) ? "" : hours + ":" + minutes + ":" + seconds;
	}

	@Input("swimFtp")
	private _swimFtp: number;

	@Output("swimFtpChange")
	private _swimFtpChange: EventEmitter<number> = new EventEmitter<number>();

	private _calculationMethods: SwimCalculationMethod[] = [{
		active: false,
		name: "60 minutes swimming FTP test (recommended)",
		params: [{
			hint: "Swim as far as possible during 60 minutes and enter distance performed in meters (ex: 1800 meters)",
			value: null,
		}],
		formula: (params: FormulaParams[]) => {
			return params[0].value / 60;
		},
	}, {
		active: false,
		name: "30 minutes swimming FTP test",
		params: [{
			hint: "Swim as far as possible during 30 minutes and enter distance performed in meters (ex: 950 meters)",
			value: null,
		}],
		formula: (params: FormulaParams[]) => {
			return (params[0].value / 30) - ((2 * params[0].value / 30 ) * 0.025); // (distance(m) / 30) - ( (2 * distance(m) / 30 ) * 0.025)
		},
	}, {
		active: false,
		name: "Critical velocity test session: (1) 200m swim test. (2) Rest. (3) 400m swim test",
		params: [{
			hint: "Swim as fast as possible on 200 meters. Enter time performed in seconds (ex: 210 seconds)",
			value: null,
		}, {
			hint: "After a rest (same session), swim as fast as possible on 400 meters. Enter time performed in seconds (ex: 590 seconds)",
			value: null,
		}],
		formula: (params: FormulaParams[]) => {
			return ((400 - 200) / ((params[1].value - params[0].value) / 60)); // (400m – 200m) / (400mTimeInMinutes - 200mTimeInMinutes)
		},
	}];


	constructor() {
	}

	public ngOnInit(): void {

	}

	public onMethodChanged(selectedMethod: SwimCalculationMethod): void {

		if (selectedMethod.active) {

			// Make all other method inactive
			const othersMethods = _.reject(this._calculationMethods, (method: any) => {
				return method.name === selectedMethod.name;
			});

			_.forEach(othersMethods, (method: any) => {
				method.active = false;
			});

			const swimFtp = selectedMethod.formula(selectedMethod.params);

			if (_.isFinite(swimFtp) && _.isNumber(swimFtp) && swimFtp > 0) {

				this._swimFtp = (_.isNumber(swimFtp) && swimFtp >= 0) ? parseFloat(swimFtp.toFixed(3)) : null;

			} else {
				this._swimFtp = null;
			}

			this._swimFtpChange.emit(this._swimFtp);
		}
	}


	get calculationMethods(): SwimCalculationMethod[] {
		return this._calculationMethods;
	}

	set calculationMethods(value: SwimCalculationMethod[]) {
		this._calculationMethods = value;
	}

	get swimFtp(): number {
		return this._swimFtp;
	}

	set swimFtp(value: number) {
		this._swimFtp = value;
	}

	get swimFtpChange(): EventEmitter<number> {
		return this._swimFtpChange;
	}

	set swimFtpChange(value: EventEmitter<number>) {
		this._swimFtpChange = value;
	}
}
