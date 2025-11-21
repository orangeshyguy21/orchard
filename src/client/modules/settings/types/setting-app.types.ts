import {OrchardSetting} from '@shared/generated.types';

export type SettingsResponse = {
	settings: OrchardSetting[];
};

export type SettingUpdateResponse = {
	setting_update: OrchardSetting;
};
