import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';

@Component({
	selector: 'orc-mint-general-keyset-version',
	standalone: false,
	templateUrl: './mint-general-keyset-version.component.html',
	styleUrl: './mint-general-keyset-version.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralKeysetVersionComponent {
	public id = input.required<string>();

	public version = computed(() => {
		const id = this.id();
		if (id.length < 17) return 'V1';
		return 'V2';
	});
}
