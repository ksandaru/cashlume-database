import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import { RemovalPolicy } from "aws-cdk-lib";

export class DynamoTransactionTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: 'transactionId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'userId',
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        // Add GSI for user's transactions by userId
        dynamoTable.addGlobalSecondaryIndex({
            indexName: 'UserIdCreatedTimestampIndex',
            partitionKey: {
                name: 'userId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'createdTimestamp',
                type: dynamodb.AttributeType.NUMBER
            }
        });

        // Add GSI for account transactions
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'AccountIdTransactionDateIndex',
        //     partitionKey: {
        //         name: 'accountId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transactionDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for category transactions
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'CategoryIdTransactionDateIndex',
        //     partitionKey: {
        //         name: 'categoryId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transactionDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for transaction type
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdTransactionTypeIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transactionType',
        //         type: dynamodb.AttributeType.STRING
        //     }
        // });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}
