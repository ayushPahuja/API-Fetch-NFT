import { CreateTableCommand, DeleteItemCommand, ExecuteStatementCommand, PutItemCommand, QueryCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
// import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocument, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { json } from "stream/consumers";

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



  //PutItem
    export const refresh_Time = Date.now()/1000;
  export const putItem = async (
        
        tokenAddress: string,
        tokenId: string,
        walletAddress: string, 
        nftsName : string,
        nftDesc: string,
        Metadata: string, 
        rawUrl: string, 
        thumbnailUrl: string , 
        mediaType: string, 
        _TokenHash: string,
        refreshTime: string,
        ) => {

        
    // Set the parameters.
    const params = {
      TableName: "NFT__TABLE",
      Item: {
        Contract__Id: {S: tokenAddress}, 
        Token__Id: {S: tokenId}, 
        Refresh_Time: {S:refreshTime },
        Name: {S:nftsName},
        desciption:{S:nftDesc},
        thumbnailUrl:{S:thumbnailUrl},
        RawUrl:{S:rawUrl},
        Metadata:{S:Metadata},
        mediaType:{S:mediaType},
        TokenHash: {S: _TokenHash},
        Wallet_Address : {S:walletAddress},
      },
    };
    try {
      const data = await ddbDocClient.send(new PutItemCommand(params));
      console.log("Success - item added or updated", data);
    } catch (err) {
      console.log("Error",err.stack);
    }
  };



  //Delete
  export const deleteItem = async (ContractId:string , TokenId: string) => {
    try {
        const params = {
            TableName: "NFT__TABLE",
            Key: {
              Contract__Id: ContractId, 
              Token__Id: TokenId, 
            },
          };
      await ddbDocClient.send(new DeleteCommand(params));
      console.log("Success - item deleted", TokenId);
    } catch (err) {
      console.log("Error", err);
    }
  };

  //Query
  
  export const run = async (
    _ContractId: string, 
    _TokenId: string) => {
    try {

        const param = {
            KeyConditionExpression: "Contract__Id = :s and Token__Id = :e",
            
            ExpressionAttributeValues: {
              ":s": { S: _ContractId },
              ":e": { S:  _TokenId},
              
            },
            
            TableName: "NFT__TABLE",
          };

      const data = await ddb.send(new QueryCommand(param));
      data.Items.forEach(function (element) {
        // console.log("DONE" , JSON.stringify(element.Contract__Id) + JSON.stringify(element.Token__Id));
      });
      
    } catch (err) {
      console.error(err);
    }
  };

//SCAN

export const getAll = async (_tableName: string)=> {
    
    try{const params = {
        TableName: _tableName,
    }
    const data = await ddb.send(new ScanCommand(params));
  }catch(err){
    console.log("ERROR", err);
  }
};
// getAll("NFT__TABLE");