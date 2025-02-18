/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { OrchardMintInfo } from '@shared/generated.types';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'orc-mint',
  templateUrl: './mint.component.html',
  styleUrl: './mint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MintComponent implements OnInit {

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