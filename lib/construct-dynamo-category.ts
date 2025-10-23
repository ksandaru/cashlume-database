import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";
import { RemovalPolicy } from "aws-cdk-lib";

export class DynamoCategoryTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: 'categoryId',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'createdTimestamp',
                type: dynamodb.AttributeType.NUMBER
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        // Add GSI for user's categories
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'UserIdIndex',
        //     partitionKey: {
        //         name: 'userId',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'categoryType',
        //         type: dynamodb.AttributeType.STRING
        //     }
        // });

        // Add GSI for system categories
        // dynamoTable.addGlobalSecondaryIndex({
        //     indexName: 'IsSystemCategoryIndex',
        //     partitionKey: {
        //         name: 'isSystemCategory',
        //         type: dynamodb.AttributeType.STRING
        //     },
        //     sortKey: {
        //         name: 'categoryType',
        //         type: dynamodb.AttributeType.STRING
        //     }
        // });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}
