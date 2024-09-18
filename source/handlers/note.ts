import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region

module.exports.note = async (event: any) => {
  const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name

  const user_id = event.pathParameters?.user_id
  console.log(`tableName: ${tableName} | user_id: ${user_id}`);

  try {
    const params = {
      TableName: tableName,  // Replace with your DynamoDB table name
      Key: {
        user_id: { S: user_id },  // Replace with your primary key and data type
      },
    };
    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success', item: response.Item }),
    };
  } catch (error) {
    console.error('Error getting item DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch item.' }),
    };
  }
};
