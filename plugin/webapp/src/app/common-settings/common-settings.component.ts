import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from '../shared/services/user-settings/user-settings.service';
import { IUserSettings } from "../../../../common/scripts/interfaces/IUserSettings";
import { CommonSettingsService } from "./services/common-settings.service";
import * as _ from 'lodash';
import { userSettings } from "../../../../common/scripts/UserSettings";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { IOptionHelperData, OptionHelperDialog } from "./option-helper-dialog/option-helper-dialog.component";
import { OptionHelperReaderService } from "./services/option-helper-reader.service";
import { PlatformLocation } from "@angular/common";
import { Section } from "./models/section.model";
import { Option } from "./models/option.model";

@Component({
	selector: 'app-common-settings',
	templateUrl: './common-settings.component.html',
	styleUrls: ['./common-settings.component.scss'],

})
export class CommonSettingsComponent implements OnInit {

	public static getOptionHelperDir(platformLocation: PlatformLocation) { // TODO Unit test
		const location: Location = <Location> (<any> platformLocation).location;
		const pathNames = location.pathname.split('/');
		pathNames.pop();
		return pathNames.join('/') + "/assets/option-helpers/";
	}

	private _sections: Section[];
	private _searchText;

	constructor(private platformLocation: PlatformLocation,
				private userSettingsService: UserSettingsService,
				private commonSettingsService: CommonSettingsService,
				private optionHelperReaderService: OptionHelperReaderService,
				private route: ActivatedRoute,
				private dialog: MatDialog) {
	}

	public ngOnInit(): void {

		this.sections = this.commonSettingsService.sections;

		this.userSettingsService.fetch().then((userSettingsSynced: IUserSettings) => {
			this.renderOptionsForEachSection(userSettingsSynced);
		});

		// Watch query params to filter options from URL
		// OR open option dialog from external
		this.route.queryParams.subscribe(params => {

			// Check query param: ?searchText=value and apply value to searchText data binding
			if (!_.isEmpty(params.searchText)) {
				this._searchText = params.searchText;
			}

			if (!_.isEmpty(params.viewOptionHelperId)) {
				// FIXME should be called without timeout. maybe in ngAfterContentInit?
				setTimeout(() => this.showOptionHelperDialog(params.viewOptionHelperId));
			}
		});
	}


	/**
	 *
	 * @param {IUserSettings} userSettingsSynced
	 */
	private renderOptionsForEachSection(userSettingsSynced: IUserSettings): void {

		_.forEach(this.sections, (section: Section) => {

			_.forEach(section.options, (option: Option) => {

				if (option.type === CommonSettingsService.TYPE_OPTION_CHECKBOX) {

					option.active = _.propertyOf(userSettingsSynced)(option.key);

					if (option.enableSubOption) {
						_.forEach(option.enableSubOption, (subKey: string) => {
							this.displaySubOption(subKey, _.propertyOf(userSettingsSynced)(option.key));
						});
					}

				} else if (option.type === CommonSettingsService.TYPE_OPTION_LIST) {

					option.active = _.find(option.list, {
						key: _.propertyOf(userSettingsSynced)(option.key),
					});

				} else if (option.type === CommonSettingsService.TYPE_OPTION_NUMBER) {

					option.value = _.propertyOf(userSettingsSynced)(option.key);

				} else {
					console.error("Option type not supported");
				}
			});
		});
	}

	/**
	 *
	 * @param {Option} option
	 */
	public onOptionChange(option: Option): void {

		if (option.type == CommonSettingsService.TYPE_OPTION_CHECKBOX) {

			this.userSettingsService.update(option.key, option.active).then(() => {
				console.log(option.key + " has been updated to ", option.active);
			});

			// Enable/disable sub option if needed
			if (option.enableSubOption) {
				// Replace this to find option object from option.enableSubOption
				_.forEach(option.enableSubOption, (subKey: string) => {
					this.displaySubOption(subKey, option.active);
				});
			}
		} else if (option.type == CommonSettingsService.TYPE_OPTION_LIST) {

			this.userSettingsService.update(option.key, option.active.key).then(() => {
				console.log(option.key + " has been updated to ", option.active);
			});

		} else if (option.type == CommonSettingsService.TYPE_OPTION_NUMBER) {


			if (_.isNull(option.value) || _.isUndefined(option.value) || !_.isNumber(option.value)) {

				this.resetOptionToDefaultValue(option);

			} else { // Save !

				if (option.value < option.min || option.value > option.max) {
					this.resetOptionToDefaultValue(option);
				}

				this.userSettingsService.update(option.key, option.value).then(() => {
					console.log(option.key + " has been updated to " + option.value);
				});
			}
		}


	}

	/**
	 *
	 * @param {Option} option
	 */
	private resetOptionToDefaultValue(option: Option): void {
		const resetValue = _.propertyOf(userSettings)(option.key);
		console.log(option.key + " value not compliant, Reset to  " + resetValue);
		option.value = resetValue;
	}

	/**
	 *
	 * @param {string} subOptionKey
	 * @param {boolean} show
	 */
	public displaySubOption(subOptionKey: string, show: boolean): void {

		_.forEach(this.sections, (section: Section) => {

			const foundOption: Option = _.find(section.options, {
				key: subOptionKey,
			});

			if (foundOption) {
				foundOption.hidden = !show;
			}
		});
	};


	/**
	 *
	 * @param {string} optionKeyParam
	 */
	public showOptionHelperDialog(optionKeyParam: string): void {

		let option: Option = null;

		_.forEach(this.sections, (section: Section) => {

			const foundOption: Option = _.find(section.options, {
				key: optionKeyParam,
			});

			if (foundOption) {
				option = foundOption;
			}
		});

		if (option) {

			// Construct markdown template URI from asset option helper dir & option key
			const markdownTemplateUri = CommonSettingsComponent.getOptionHelperDir(this.platformLocation) + option.key + ".md";

			this.optionHelperReaderService.get(markdownTemplateUri).then(markdownData => {

				const optionHelperData: IOptionHelperData = {
					title: option.title,
					markdownData: markdownData
				};

				this.dialog.open(OptionHelperDialog, {
					minWidth: OptionHelperDialog.MIN_WIDTH,
					maxWidth: OptionHelperDialog.MAX_WIDTH,
					data: optionHelperData
				});
			});
		}
	};

	get sections(): Section[] {
		return this._sections;
	}

	set sections(value: Section[]) {
		this._sections = value;
	}

	get searchText(): string {
		return this._searchText;
	}

	set searchText(value: string) {
		this._searchText = value;
	}
}
