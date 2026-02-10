/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';

export type NetworkConnection = {
	uri: string;
	type: string;
	label: string;
	image: string;
	name: string;
	section: string;
	device_type: DeviceType;
};
