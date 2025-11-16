# CashLume Database Infrastructure

This is an AWS CDK TypeScript project for the CashLume mobile application database infrastructure.

## Architecture Overview

This project creates:
- **Amazon Cognito User Pool** for user authentication
- **10 DynamoDB Tables** for application data storage

## Database Schema

### 1. UserTable
**Purpose:** Store user profile information
- **Partition Key:** `userId` (STRING)
- **Sort Key:** `createdTimestamp` (NUMBER)
- **GSI:** 
  - `CognitoIdIndex` - lookup by cognitoId
  - `EmailIndex` - lookup by email

### 2. AccountTable
**Purpose:** Store financial accounts (bank accounts, cash, credit cards, etc.)
- **Partition Key:** `accountId` (STRING)
- **Sort Key:** `createdTimestamp` (NUMBER)
- **GSI:**
  - `UserIdIndex` - get all accounts for a user
  - `UserIdIsActiveIndex` - get active accounts for a user

### 3. CategoryTable
**Purpose:** Store income and expense categories
- **Partition Key:** `categoryId` (STRING)
- **Sort Key:** `createdTimestamp` (NUMBER)
- **GSI:**
  - `UserIdIndex` - get categories by user and type
  - `IsSystemCategoryIndex` - get system-wide categories

### 4. TransactionTable
**Purpose:** Store all financial transactions
- **Partition Key:** `transactionId` (STRING)
- **Sort Key:** `transactionDate` (NUMBER)
- **GSI:**
  - `UserIdTransactionDateIndex` - get user's transactions by date
  - `AccountIdTransactionDateIndex` - get account's transactions
  - `CategoryIdTransactionDateIndex` - get transactions by category
  - `UserIdTransactionTypeIndex` - filter by transaction type

### 5. RecurringTransactionTable
**Purpose:** Store recurring transaction patterns (bills, subscriptions)
- **Partition Key:** `recurringTransactionId` (STRING)
- **Sort Key:** `userId` (NUMBER)
- **GSI:**
  - `UserIdNextDueDateIndex` - get upcoming recurring transactions
  - `UserIdIsActiveIndex` - get active recurring patterns

### 6. BudgetTable
**Purpose:** Store user budgets by category
- **Partition Key:** `budgetId` (STRING)
- **Sort Key:** `startDate` (NUMBER)
- **GSI:**
  - `UserIdStartDateIndex` - get user's budgets by period
  - `CategoryIdStartDateIndex` - get budgets for a category
  - `UserIdIsActiveIndex` - get active budgets

### 7. GoalTable
**Purpose:** Store savings goals
- **Partition Key:** `goalId` (STRING)
- **Sort Key:** `targetDate` (NUMBER)
- **GSI:**
  - `UserIdTargetDateIndex` - get user's goals by target date
  - `UserIdStatusIndex` - filter goals by status

### 8. TransferTable
**Purpose:** Store account-to-account transfers
- **Partition Key:** `transferId` (STRING)
- **Sort Key:** `transferDate` (NUMBER)
- **GSI:**
  - `UserIdTransferDateIndex` - get user's transfers
  - `FromAccountIdTransferDateIndex` - get transfers from an account
  - `ToAccountIdTransferDateIndex` - get transfers to an account

### 9. NotificationTable
**Purpose:** Store user notifications and alerts
- **Partition Key:** `notificationId` (STRING)
- **Sort Key:** `createdTimestamp` (NUMBER)
- **GSI:**
  - `UserIdCreatedTimestampIndex` - get user's notifications
  - `UserIdIsReadIndex` - get unread notifications

### 10. SettingsTable
**Purpose:** Store user preferences and app settings
- **Partition Key:** `userId` (STRING)
- **Sort Key:** `settingId` (STRING)

## Cognito User Pool

- Email-based authentication
- Self-signup enabled
- Email verification required
- Password policy: min 8 chars, requires uppercase, lowercase, digits, and symbols
- Account recovery via email

## Configuration

The project supports three environments:
- **dev** - Development environment (DevCashlume prefix)
- **test** - Testing environment (TestCashlume prefix)
- **prod** - Production environment (ProdCashlume prefix)

### Setup

1. Update `cdk.json` with your AWS Account ID:
   ```json
   "awsAccountId": "YOUR_AWS_ACCOUNT_ID"
   ```

2. (Optional) Update region and app names for each environment in `cdk.json`

## Useful Commands

* `npm run build`   - compile TypeScript to JavaScript
* `npm run watch`   - watch for changes and compile
* `npm run test`    - perform the jest unit tests
* `npx cdk deploy`  - deploy to default (dev) environment
* `npx cdk deploy -c env=test` - deploy to test environment
* `npx cdk deploy -c env=prod` - deploy to production environment
* `npx cdk deploy -c pipeline=true` - deploy CI/CD pipeline
* `npx cdk diff`    - compare deployed stack with current state
* `npx cdk synth`   - emit the synthesized CloudFormation template
* `npx cdk destroy` - destroy the stack

## Pipeline Mode

The project includes a CI/CD pipeline setup:

1. Update `lib/cashlume-database-pipeline.ts` with:
   - Your GitHub repository
   - Your AWS CodeConnection ARN

2. Deploy the pipeline:
   ```bash
   npx cdk deploy -c pipeline=true
   ```

The pipeline will:
- Deploy to Test environment automatically
- Require manual approval before Production
- Deploy to Production after approval

## File Structure

```
lib/
├── build-config.ts                          # Environment configuration
├── cashlume-database-stack.ts               # Main stack definition
├── cashlume-database-stage.ts               # Stage for pipeline
├── cashlume-database-pipeline.ts            # CI/CD pipeline
├── construct-cognito-user-pool.ts           # Cognito user pool construct
├── construct-dynamo-user.ts                 # User table
├── construct-dynamo-account.ts              # Account table
├── construct-dynamo-category.ts             # Category table
├── construct-dynamo-transaction.ts          # Transaction table
├── construct-dynamo-recurring-transaction.ts # Recurring transaction table
├── construct-dynamo-budget.ts               # Budget table
├── construct-dynamo-goal.ts                 # Goal table
├── construct-dynamo-transfer.ts             # Transfer table
├── construct-dynamo-notification.ts         # Notification table
└── construct-dynamo-settings.ts             # Settings table
```

## Notes

- All DynamoDB tables use **PAY_PER_REQUEST** billing mode for cost optimization
- All tables have **RETAIN** removal policy to prevent accidental data loss
- Global Secondary Indexes (GSI) are optimized for common query patterns
- Timestamps are stored as numbers (Unix epoch) for efficient range queries
