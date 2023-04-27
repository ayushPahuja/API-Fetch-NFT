import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { exec } from 'child_process';
import Nft from './nft.model'
import { stringify } from 'querystring';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { NftModule } from "./nft.module";
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { putItem, refresh_Time,ddb } from './table';

let nft: Nft;
let LastRefresh = 0;
let ddbdb = new DynamoDB({region: 'eu-north-1'});



const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
@Injectable()
export class NftsService {
  private readonly dynamoDB: DynamoDB;
  private readonly moralis: typeof Moralis;
  

  constructor() {
    this.dynamoDB = new DynamoDB({ region: 'eu-north-1' }); 
    this.moralis = Moralis; 
    Moralis.start({
        apiKey: "JRYnwiErZhxoxdGD1fKslNfx0CJNFNgEPg3WLtpU239mvT6FdXumtzX0MScXQYgu"
    });
  }

  async runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async getNftsByAddress() {
    

  }

  async getData(){

    let current = Date.now()/1000;
    if(current-LastRefresh >=120){
        LastRefresh = current;
    
    const chain = EvmChain.ETHEREUM;
    const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";

    const nfts = await Moralis.EvmApi.nft.getContractNFTs({
        address,
        chain,
        mediaItems: true

    });
       
        for(var i = 0; i<nfts.result.length; i++){ 
       putItem(
        (nfts.result[i].format().tokenAddress),
        address,
        String(nfts.result[i].name),
        String(nfts.result[i].tokenUri),
        JSON.stringify(nfts.result[i].format().metadata),
        JSON.stringify(nfts.result[i].format().media.mediaCollection),
        ( nfts.result[i].format().media.originalMediaUrl),
        JSON.stringify(nfts.result[i].format().media.mimetype),
        String(LastRefresh),   
        JSON.stringify(nfts.result[i].format().tokenId),
       );
    
    
        }
    return nfts.result;

  }
  else{
    
    return 'Wait for 2 mins';
    
}

    
    


    
}



  
  
}
 

  
 

