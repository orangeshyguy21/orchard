import { Component, OnInit } from '@angular/core';
import { MintService } from '../../../mint/mint.service';


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
    this.mintService.test().subscribe(
      (data:any) => {
        console.log('returned data', data);
      }
    )
  }

}
