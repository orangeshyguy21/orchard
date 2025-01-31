import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintApiService } from '../../cashumintapi/cashumintapi.service';
import { CashuMintInfo } from '../../cashumintapi/cashumintapi.types';
/* Internal Dependencies */
import { OrchardMintInfo, OrchardNutMethod, OrchardNutSupported } from './mintinfo.model';

@Injectable()
export class MintInfoService {

  constructor(
    private cashuMintApiService: CashuMintApiService,
  ) {}

  async getMintInfo() : Promise<OrchardMintInfo> {
    try {
      const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
      return new OrchardMintInfo(cashu_info);
    } catch (err) {
      console.log('caught err', err);
    }
  }

  // private getNuts(nuts:CashuInfo['nuts']) : Nut[] {
  //   return Object.keys(nuts).map( nut_id => this.getNut(nut_id, nuts[nut_id]) );
  //     // .map( nut_id => ({
  //     //   nut: parseInt(nut_id),
  //     //   // methods: this.getNutMethods(nuts[nut_id].methods),
  //     //   ...nuts[nut_id]
  //     // }));
  //   //   test.forEach( nut => {
  //   //     nut.methods = this.getNutMethods(nut.methods);
  //   //   });
  //   // return test;
  
  //     // .forEach( nut => {
  //     //   nut.methods = this.getNutMethods(nut.methods);
  //     // });
  // }

  // private getNut(id:string, nut:CashuNut) : Nut {
  //   return {
  //     nut: parseInt(id),
  //     disabled: nut.disabled,
  //     methods: this.getNutMethods(nut.methods),
  //     supported: nut.supported,
  //   };
  // }


  // private getNutMethods(nut_methods:CashuNutMethod[]) : [NutMethod] {
  //   if( !nut_methods ) return null;
  //   return Object.keys(nut_methods).map( key => ({
  //     id: parseInt(key),
  //     ...nut_methods[key]
  //   }));
  // }
}


// {
//     name: 'Skynode Test Cashu mint',
//     pubkey: '02ccd064217cb284d46ab8020528b3bdf423822bc149c3d0433bdb319536fb4435',
//     version: 'Nutshell/0.16.4',
//     description: 'A node for testing cashu projects',
//     description_long: 'A long mint description that can be a long piece of text.',
//     contact: [],
//     motd: 'Hello Worlds',
//     icon_url: 'https://mint.host/icon.jpg',
//     urls: [
//       'https://mint.host',
//       'http://mint8gv0sq5ul602uxt2fe0t80e3c2bi9fy0cxedp69v1vat6ruj81wv.onion'
//     ],
//     time: 1738187483,
//     nuts: {
//       '4': { methods: [Array], disabled: false },
//       '5': { methods: [Array], disabled: false },
//       '7': { supported: true },
//       '8': { supported: true },
//       '9': { supported: true },
//       '10': { supported: true },
//       '11': { supported: true },
//       '12': { supported: true },
//       '14': { supported: true },
//       '15': { methods: [Array] },
//       '17': { supported: [Array] },
//       '20': { supported: true }
//     }
//   }
  