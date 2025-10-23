import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import { RemovalPolicy } from "aws-cdk-lib";

export class DynamoRecurringTransactionTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: 'recurringPatternId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'nextDueDate',
                type: dynamodb.AttributeType.NUMBER
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        // Add GSI for user's recurring transactions
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdNextDueDateIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'nextDueDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for active recurring patterns
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdIsActiveIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'isActive',
        //         type: dynamodb.AttributeType.STRING
        //     }
        // });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}
