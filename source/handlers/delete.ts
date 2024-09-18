import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region
module.exports.delete = async (event: any) => {
  const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name
  const user_id = event.pathParameters?.user_id
  console.log(`tableName: ${tableName} | user_id: ${user_id}`);

  try {
    const params = {
      TableName: tableName,  // Replace with your DynamoDB table name
      Key: {
        primaryKey: { S: user_id }  // Replace with your primary key
      }
    };
    const command = new DeleteItemCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("Item Deletion successful:", response);
  } catch (error) {
    console.error("Error deletion item:", error);
  }
};
