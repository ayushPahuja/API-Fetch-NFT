import { CreateTableCommand, DeleteItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const ddb = new DynamoDBClient({region: 'eu-north-1'});


const marshallOptions = {
    
    convertEmptyValues: true, 
    removeUndefinedValues: true, 
    convertClassInstanceToMap: false,
  };

  const unmarshallOptions = {
   
    wrapNumbers: false, 
  };

  const ddbDocClient = DynamoDBDocumentClient.from(ddb,{
    marshallOptions,
    unmarshallOptions,
  });



  
    export const refresh_Time = Date.now()/1000;
  export const putItem = async (
        tokenAddress: string,
        walletAddress: string, 
        nftsName : string,
        nftDesc: string,
        Metadata: string, 
        rawUrl: string, 
        thumbnailUrl: string , 
        mediaType: string, 
        refreshTime: string,
        tokenId: string) => {

        
    // Set the parameters.
    const params = {
      TableName: "NFT",
      Item: {
        Wallet_Address : {S:walletAddress},    
        Token_Address: {S: tokenAddress}, //e.g. title: "Rush"
        Refresh_Time: {S:refreshTime },
        nftsName: {S:nftsName},
        nftdesc:{S:nftDesc},
        thumbnailUrl:{S:thumbnailUrl},
        rawUrl:{S:rawUrl},
        Metadata:{S:Metadata},
        mediaType:{S:mediaType},
        TokenId: {S: tokenId}


      },
    };
    try {
      const data = await ddbDocClient.send(new PutItemCommand(params));
      console.log("Success - item added or updated", data);
    } catch (err) {
      console.log("Error",err.stack);
    }
  };


//   export const deleteItem = async (walletAddress: string, tokenAddress: string, tokenId:string) => {
//     try {
//       await ddbDocClient.send(new DeleteItemCommand());
//       console.log("Success - item deleted");
//     } catch (err) {
//       console.log("Error", err);
//     }
//   };
//   deleteItem();
  
