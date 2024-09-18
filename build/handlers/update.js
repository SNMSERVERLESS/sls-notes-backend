"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
// Initialize the DynamoDB client
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region
module.exports.update = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name
    const user_id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.user_id;
    const { first_name, last_name, email, website, description } = JSON.parse(event.body || '{}');
    console.log(`tableName: ${tableName} | user_id: ${user_id} | first_name: ${first_name} | last_name: ${last_name} | email: ${email} | website: ${website} | description: ${description}`);
    try {
        const params = {
            TableName: tableName, // Replace with your DynamoDB table name
            Key: {
                primaryKey: { S: user_id }, // Replace with your primary key and data type (S for string)
            },
            UpdateExpression: "set #first_name = :first_name, #last_name = :last_name, #email = :email, #website = :website, #description = :description", // Set the attribute to a new value
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
        const command = new client_dynamodb_1.DeleteItemCommand(params);
        const response = yield dynamoDBClient.send(command);
        console.log("Item Deletion successful:", response);
    }
    catch (error) {
        console.error("Error deletion item:", error);
    }
});
