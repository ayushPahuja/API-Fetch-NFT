import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { exec } from 'child_process';
import Nft from './nft.model'
import { stringify } from 'querystring';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { NftModule } from "./nft.module";
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { putItem, refresh_Time,ddb, getAll, deleteItem } from './table';

let nft: Nft;
let LastRefresh = 0;
let dynamodb = new DynamoDB({region: 'eu-north-1'});
export let update = [];


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


  async getData(){
    const chain = EvmChain.ETHEREUM;
    const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";

    const nfts = await Moralis.EvmApi.nft.getContractNFTs({
        address,
        chain,
        mediaItems: true

    });
    update.push(nfts.result);
    let Result = nfts.result;

    let current = Date.now()/1000;
    if(current-LastRefresh >=300){
        LastRefresh = current;
    
   
       
       
        for(let i = 0; i<
            20; i++){ 
       putItem(
        Result[i].format().tokenAddress ?? "NULL",
        JSON.stringify(Result[i].tokenId) ?? "NULL",
        address ?? "NULL",
        String(Result[i].format().name) ?? "NULL",
        JSON.parse(JSON.stringify(Result[i].format().metadata)).description ?? "NULL",
        JSON.stringify(Result[i].format().metadata) ?? "NULL",
        JSON.stringify(Result[i].media.originalMediaUrl) ?? "NULL",
        JSON.stringify(Result[i].media.mediaCollection.low) ?? "NULL",
        String(Result[i].format().media.mimetype) ?? "NULL",
        JSON.stringify(Result[i].format().tokenHash),
        String(refresh_Time) ?? "NULL",
        );
        
    }

    //Deleting the data using TokenHash
    // for(let i=0; i<21; i++){
    // const run = async (
    //     _ContractId: string, 
    //     _TokenId: string) => {
    //     try {
    
    //         const param = {
    //             KeyConditionExpression: "Contract__Id = :s and Token__Id = :e",
                
    //             ExpressionAttributeValues: {
    //               ":s": { S: _ContractId },
    //               ":e": { S:  _TokenId},
                  
    //             },
                
    //             TableName: "NFT__TABLE",
    //           };
    
    //       const data = await ddb.send(new QueryCommand(param));
    //       let hh = [];
    //       hh.push(JSON.stringify(data));
    //       console.log(hh);
          
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };
    //   run(Result[i].format().tokenAddress, JSON.stringify(Result[i].tokenId) )
    // } 




   
    
    return update[0];

  }
  else if(current-LastRefresh <300){
    console.warn("Wait for 5 mins cooldown to update!!")
    return update;
        }
    }
}
 

  
 

