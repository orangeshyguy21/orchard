/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	ViewChildren,
	ViewChild,
	ElementRef,
	QueryList,
	computed,
	OnInit,
	AfterViewInit,
} from '@angular/core';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {NonNullableIndexCrewSettings} from '@client/modules/settings/types/setting.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';

enum NavTertiary {
	Invites = 'nav1',
	Users = 'nav2',
}

@Component({
	selector: 'orc-index-subsection-crew',
	standalone: false,
	templateUrl: './index-subsection-crew.component.html',
	styleUrl: './index-subsection-crew.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewComponent implements OnInit, AfterViewInit {
	@ViewChildren('nav1,nav2') nav_elements!: QueryList<ElementRef>;
	@ViewChild('crew_container', {static: false}) crew_container!: ElementRef;

	public page_settings!: NonNullableIndexCrewSettings;
	public tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.Invites]: {title: 'Invites'},
		[NavTertiary.Users]: {title: 'Users'},
	};
	public tertiary_nav = computed<string[]>(() => this.page_settings?.tertiary_nav || []);

	constructor(private settingService: SettingService) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.page_settings = this.getPageSettings();
	}

	ngAfterViewInit(): void {
		this.updateTertiaryNav();
	}

	private getPageSettings(): NonNullableIndexCrewSettings {
		const settings = this.settingService.getIndexCrewSettings();
		return {
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
		};
	}

	/* *******************************************************
		Tertiary Nav                      
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		this.page_settings.tertiary_nav = event;
		this.settingService.setIndexCrewSettings(this.page_settings);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToSettings(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const tertiary_nav = this.page_settings.tertiary_nav.map((area) => `"${area}"`).join(' ');
		this.crew_container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToSettings(nav_item: NavTertiary) {
		const target_element = this.nav_elements.find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		target_element.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}
}
