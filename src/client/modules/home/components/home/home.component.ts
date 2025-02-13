import { Component, OnInit } from '@angular/core';
import { MintService } from '../../../mint/mint.service';

// import { OrchardMintProof } from '../../../../../server/modules/api/mintproof/mintproof.model';
import { OrchardMintProof } from '../../../../../shared/generated.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    public mintService: MintService
  ){}

  ngOnInit() : void {
    console.log('HOME COMP INIT');
    // console.log('mint proofs pending', OrchardMintProof);
    this.mintService.test().subscribe(
      (data:any) => {
        console.log('returned data', data);
      }
    )
  }

}
