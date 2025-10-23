import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import { RemovalPolicy } from "aws-cdk-lib";

export class DynamoGoalTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: 'goalId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'targetDate',
                type: dynamodb.AttributeType.NUMBER
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        // Add GSI for user's goals
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdTargetDateIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'targetDate',
        //         type: dynamodb.AttributeType.NUMBER
        //     }
        // });

        // Add GSI for goals by status
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdStatusIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'status',
        //         type: dynamodb.AttributeType.STRING
        //     }
        // });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}
