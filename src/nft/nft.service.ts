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
import { putItem, refresh_Time,ddb, getAll, deleteItem, query, ddbDocClient } from './table';
import { async, concat } from 'rxjs';



let LastRefresh = 0;
let dynamodb = new DynamoDB({region: 'eu-north-1'});
const UpdateArray = [];



const address = "YOUR_ADDRESS";
@Injectable()
export class NftsService {
  private readonly dynamoDB: DynamoDB;
  private readonly moralis: typeof Moralis;
  

  constructor() {
    this.dynamoDB = new DynamoDB({ region: 'eu-north-1' }); 
    this.moralis = Moralis; 
    Moralis.start({
        apiKey: "YOUR_API_KEY"
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
    

    const nfts = await Moralis.EvmApi.nft.getContractNFTs({
        address,
        chain,
        mediaItems: true

    });
    
    let Result = nfts.result;

    let current = Date.now()/1000;
    if(current-LastRefresh >=300){
        LastRefresh = current;
        
   
       
       
     for(let i = 0; i<21; i++){ 
        let info = Result[i].format(); //info fetched
         // as the tokenId is a string|number we need to remove " from it;
        let newStr = String(info.tokenId).replace('"' , '');
       putItem(
        info.tokenAddress ?? "NULL",
        newStr ?? "NULL",
        address ?? "NULL",
        String(info.name) ?? "NULL",
        JSON.parse(JSON.stringify(info.metadata)).description ?? "NULL",
        JSON.stringify(info.metadata) ?? "NULL",
        JSON.stringify(Result[i].media.originalMediaUrl) ?? "NULL",
        JSON.stringify(Result[i].media.mediaCollection.low) ?? "NULL",
        String(info.media.mimetype) ?? "NULL",
        String(refresh_Time) ?? "NULL",
        );
        
    }

    //Deleting the data using ConcatKey
    // for(let j=0; j<21; j++){
    // const run = async (
    //     _walletAddress: string, 
    //     _concatKey: string) => {
    //     try {
    //         let info = Result[j].format();
    //         const ConcatTokenAddress = info.tokenAddress;
    //         const ConcatTokenId = String(info.tokenId);

    //         //as we dont have concatinated string in the data we fetch from moralis so we make it!
    //         const UpdatedArray =async (ConcatTokenAddress:string, ConcatTokenId:string ) => {
    //             let out = ConcatTokenAddress+ ConcatTokenId;
    //             UpdateArray.push(out);
    //         }
    //         const param = {
    //             KeyConditionExpression: "WalletAddress = :s and ConcatKey = :e",
    //             ExpressionAttributeValues: {
    //               ":s": { S: _walletAddress },
    //               ":e": { S:  _concatKey},   
    //             },
    //             TableName: "NFT__TABLE",
    //           };
    //       const data = await ddbDocClient.send(new QueryCommand(param));
    //       const uniqueKey = String(data.Items[j].ConcatKey);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };
    // } 
    // const index = UpdateArray.findIndex()

    return Result;

  }
  else if(current-LastRefresh <300){
    console.warn("Wait for 5 mins cooldown to update!!")
    const DataOfDb = query(address);
    return DataOfDb; 
        }
    }
}
 

  
 

