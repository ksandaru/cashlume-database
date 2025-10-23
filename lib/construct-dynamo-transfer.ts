import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import { RemovalPolicy } from "aws-cdk-lib";

export class DynamoTransferTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: 'transferId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'transferDate',
                type: dynamodb.AttributeType.NUMBER
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        // Add GSI for user's transfers
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdTransferDateIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transferDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for from account transfers
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'FromAccountIdTransferDateIndex',
        //     partitionKey: {
        //         name: 'fromAccountId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transferDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for to account transfers
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'ToAccountIdTransferDateIndex',
        //     partitionKey: {
        //         name: 'toAccountId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'transferDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}
