import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import * as moment from "moment";
import { v4 as uuid } from 'uuid';

// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region

module.exports.notes = async (event: any) => {
  const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name

  const user_id = event.pathParameters?.user_id

  console.log(`tableName: ${tableName} | user_id: ${user_id}`);

  const params = {
  TableName: tableName,
  ProjectionExpression: "#user_id, #first_name, #last_name",  // Specify the attributes to return
  ExpressionAttributeNames: {
    "#user_id": "user_id",
    "#first_name": "first_name",
    "#last_name": "last_name"
  },
};
  try {
    const command = new ScanCommand(params);
    const response = await dynamoDBClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'success', items: response.Items }),
    };
  } catch (error) {
    console.error('Unable to scan:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to scan.' }),
    };
  }
};
