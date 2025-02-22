/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { OrchardMintInfo } from '@shared/generated.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'orc-mint-subsection-dashboard',
  standalone: false,
  templateUrl: './mint-subsection-dashboard.component.html',
  styleUrl: './mint-subsection-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionDashboardComponent {
  public mint_info$: Observable<OrchardMintInfo | null>;

  constructor(
    private mintService: MintService
  ) { 
    this.mint_info$ = this.mintService.mint_info$;
  }

  ngOnInit(): void {
    this.mintService.loadMintInfo().subscribe({
      error: (error) => {
        console.error('Error loading mint info:', error);
      }
    });
  }
}

