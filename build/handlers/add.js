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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
// Initialize the DynamoDB client
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({ region: 'ap-south-1' }); // Replace with your region
module.exports.add = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tableName = process.env.TABLE_NAME; // Replace with your DynamoDB table name
    const user_id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.user_id;
    const { first_name, last_name, email, website, description } = JSON.parse(event.body || '{}');
    console.log(`tableName: ${tableName} | user_id: ${user_id} | first_name: ${first_name} | last_name: ${last_name} | email: ${email} | website: ${website} | description: ${description}`);
    const params = {
        TableName: tableName,
        Item: {
            'user_id': { S: user_id }, // Partition key
            'first_name': { S: first_name },
            'last_name': { S: last_name },
            'email': { S: email },
            'website': { S: website },
            'timestamp': { N: (0, moment_1.default)().unix().toString() },
            'note_id': { S: (0, uuid_1.v4)() },
            'description': { S: description }
        }
    };
    try {
        const command = new client_dynamodb_1.PutItemCommand(params);
        const response = yield dynamoDBClient.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note inserted successfully!', response: response }),
        };
    }
    catch (error) {
        console.error('Error inserting Note into DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert Note.' }),
        };
    }
});
