/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint.service';

@Component({
  selector: 'orc-mint',
  templateUrl: './mint.component.html',
  styleUrl: './mint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MintComponent implements OnInit {

  constructor(
    private mintService: MintService
  ) { }

  ngOnInit(): void {
    this.mintService.getStatus().subscribe((res:any) => {
      console.log(res);
    });
  }
}
