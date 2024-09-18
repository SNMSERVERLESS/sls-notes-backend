import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import moment from 'moment';
import { v4 as uuid } from 'uuid';

// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region

module.exports.add = async (event: any) => {
  const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name

  const user_id = event.pathParameters?.user_id
  const { first_name, last_name, email, website, description } = JSON.parse(event.body || '{}');

  console.log(`tableName: ${tableName} | user_id: ${user_id} | first_name: ${first_name} | last_name: ${last_name} | email: ${email} | website: ${website} | description: ${description}`);

  const params = {
    TableName: tableName,
    Item: {
      'user_id': { S: user_id },       // Partition key
      'first_name': { S: first_name },
      'last_name': { S: last_name },
      'email': { S: email },
      'website': { S: website },
      'timestamp': { N: moment().unix().toString() },
      'note_id': { S: uuid() },
      'description': { S: description}
    }
  };
  try {
    const command = new PutItemCommand(params);
    const response = await dynamoDBClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Note inserted successfully!', response: response }),
    };
  } catch (error) {
    console.error('Error inserting Note into DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert Note.' }),
    };
  }
};
