import {OrchardSetting} from '@shared/generated.types';

export type SettingsResponse = {
	settings: OrchardSetting[];
};

export type SettingsUpdateResponse = {
	settings_update: OrchardSetting[];
};
