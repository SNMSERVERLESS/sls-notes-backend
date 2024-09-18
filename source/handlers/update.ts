import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
// Initialize the DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region
module.exports.update = async (event: any) => {
  const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name
  const user_id = event.pathParameters?.user_id
  const { first_name, last_name, email, website, description } = JSON.parse(event.body || '{}');
  console.log(`tableName: ${tableName} | user_id: ${user_id} | first_name: ${first_name} | last_name: ${last_name} | email: ${email} | website: ${website} | description: ${description}`);
  try {
    const params = {
      TableName: tableName,  // Replace with your DynamoDB table name
      Key: {
        user_id: { S: user_id }
      },
      UpdateExpression: "set #first_name = :first_name, #last_name = :last_name, #email = :email, #website = :website, #description = :description",  // Set the attribute to a new value
      ExpressionAttributeNames: {
        "#first_name": "first_name",
        "#last_name": "last_name",
        "#email": "email",
        "#website": "website",
        "#description": "description"
      },
      ExpressionAttributeValues: {
        ":first_name": { S: first_name },
        ":last_name": { S: last_name },
        ":email": { S: email },
        ":website": { S: website },
        ":description": { S: description },

      }
    };
    const command = new DeleteItemCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("Item Deletion successful:", response);
  } catch (error) {
    console.error("Error deletion item:", error);
  }
};
