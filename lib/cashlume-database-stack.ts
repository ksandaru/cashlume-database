import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildConfig } from './build-config';
import { CognitoUserPool } from './construct-cognito-user-pool';
import { DynamoUserTable } from './construct-dynamo-user';
import { DynamoAccountTable } from './construct-dynamo-account';
import { DynamoCategoryTable } from './construct-dynamo-category';
import { DynamoTransactionTable } from './construct-dynamo-transaction';
import { DynamoRecurringTransactionTable } from './construct-dynamo-recurring-transaction';
import { DynamoBudgetTable } from './construct-dynamo-budget';
import { DynamoGoalTable } from './construct-dynamo-goal';
import { DynamoTransferTable } from './construct-dynamo-transfer';
import { DynamoNotificationTable } from './construct-dynamo-notification';
import { DynamoSettingsTable } from './construct-dynamo-settings';

export class CashlumeDatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: cdk.StackProps) {
    super(scope, id, props);

    // create cognito user pool
    const cognitoUserPool = new CognitoUserPool(this, buildConfig);

    // create dynamodb database schema
    const dynamoUserTable = new DynamoUserTable(this, 'UserTable', buildConfig);
    const dynamoAccountTable = new DynamoAccountTable(this, 'AccountTable', buildConfig);
    const dynamoCategoryTable = new DynamoCategoryTable(this, 'CategoryTable', buildConfig);
    const dynamoTransactionTable = new DynamoTransactionTable(this, 'TransactionTable', buildConfig);
    const dynamoRecurringTransactionTable = new DynamoRecurringTransactionTable(this, 'RecurringTransactionTable', buildConfig);
    const dynamoBudgetTable = new DynamoBudgetTable(this, 'BudgetTable', buildConfig);
    const dynamoGoalTable = new DynamoGoalTable(this, 'GoalTable', buildConfig);
    const dynamoTransferTable = new DynamoTransferTable(this, 'TransferTable', buildConfig);
    const dynamoNotificationTable = new DynamoNotificationTable(this, 'NotificationTable', buildConfig);
    const dynamoSettingsTable = new DynamoSettingsTable(this, 'SettingsTable', buildConfig);
  }
}
