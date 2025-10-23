# CashLume Database Schema Documentation

## Overview
CashLume is a personal finance/cash flow tracking mobile application. This document describes the complete database schema implemented using AWS DynamoDB.

## Authentication
- **Service:** Amazon Cognito User Pool
- **Authentication Method:** Email + Password
- **Features:** Self-signup, email verification, password recovery

---

## DynamoDB Tables

### 1. UserTable (DevCashlumeUserTable)

**Purpose:** Stores user profile and account information

| Attribute | Type | Description |
|-----------|------|-------------|
| userId (PK) | String | Unique user identifier |
| createdTimestamp (SK) | Number | Unix timestamp of creation |
| cognitoId | String | Cognito user sub/id |
| email | String | User email address |
| username | String | Display username |
| firstName | String | User's first name |
| lastName | String | User's last name |
| phoneNumber | String | Contact number |
| profileImageUrl | String | S3 URL to profile image |
| currencyPreference | String | Default currency (USD, EUR, etc.) |
| timezone | String | User's timezone |
| lastLoginAt | Number | Last login timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `CognitoIdIndex` - PK: cognitoId
- `EmailIndex` - PK: email

---

### 2. AccountTable (DevCashlumeAccountTable)

**Purpose:** Stores financial accounts (checking, savings, cash, credit cards, investments)

| Attribute | Type | Description |
|-----------|------|-------------|
| accountId (PK) | String | Unique account identifier |
| createdTimestamp (SK) | Number | Unix timestamp of creation |
| userId | String | Owner user ID |
| accountName | String | Account display name |
| accountType | String | checking, savings, cash, credit_card, investment |
| currency | String | Account currency |
| initialBalance | Number | Starting balance |
| currentBalance | Number | Current balance |
| color | String | UI color code |
| icon | String | UI icon name |
| isActive | String | "true" or "false" |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdIndex` - PK: userId, SK: createdTimestamp
- `UserIdIsActiveIndex` - PK: userId, SK: isActive

---

### 3. CategoryTable (DevCashlumeCategoryTable)

**Purpose:** Stores income and expense categories

| Attribute | Type | Description |
|-----------|------|-------------|
| categoryId (PK) | String | Unique category identifier |
| createdTimestamp (SK) | Number | Unix timestamp of creation |
| userId | String | Owner user ID (null for system categories) |
| categoryName | String | Category display name |
| categoryType | String | "income" or "expense" |
| icon | String | UI icon name |
| color | String | UI color code |
| parentCategoryId | String | Parent category for subcategories |
| isSystemCategory | String | "true" for default categories |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdIndex` - PK: userId, SK: categoryType
- `IsSystemCategoryIndex` - PK: isSystemCategory, SK: categoryType

---

### 4. TransactionTable (DevCashlumeTransactionTable)

**Purpose:** Stores all financial transactions (income, expenses, transfers)

| Attribute | Type | Description |
|-----------|------|-------------|
| transactionId (PK) | String | Unique transaction identifier |
| transactionDate (SK) | Number | Unix timestamp of transaction |
| userId | String | Owner user ID |
| accountId | String | Associated account |
| categoryId | String | Transaction category |
| transactionType | String | "income", "expense", or "transfer" |
| amount | Number | Transaction amount |
| currency | String | Transaction currency |
| description | String | Transaction description |
| note | String | Additional notes |
| location | String | Transaction location |
| receiptImageUrl | String | S3 URL to receipt image |
| tags | String | Comma-separated tags |
| isRecurring | String | "true" or "false" |
| recurringPatternId | String | Link to recurring pattern |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdTransactionDateIndex` - PK: userId, SK: transactionDate
- `AccountIdTransactionDateIndex` - PK: accountId, SK: transactionDate
- `CategoryIdTransactionDateIndex` - PK: categoryId, SK: transactionDate
- `UserIdTransactionTypeIndex` - PK: userId, SK: transactionType

---

### 5. RecurringTransactionTable (DevCashlumeRecurringTransactionTable)

**Purpose:** Stores recurring transaction patterns (bills, subscriptions, regular income)

| Attribute | Type | Description |
|-----------|------|-------------|
| recurringPatternId (PK) | String | Unique pattern identifier |
| nextDueDate (SK) | Number | Next execution date timestamp |
| userId | String | Owner user ID |
| accountId | String | Target account |
| categoryId | String | Transaction category |
| amount | Number | Transaction amount |
| description | String | Pattern description |
| frequency | String | daily, weekly, monthly, yearly |
| interval | Number | Interval multiplier (e.g., 2 for bi-weekly) |
| startDate | Number | Pattern start date |
| endDate | Number | Pattern end date (null for indefinite) |
| isActive | String | "true" or "false" |
| lastExecutedDate | Number | Last execution timestamp |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdNextDueDateIndex` - PK: userId, SK: nextDueDate
- `UserIdIsActiveIndex` - PK: userId, SK: isActive

---

### 6. BudgetTable (DevCashlumeBudgetTable)

**Purpose:** Stores budget limits by category and time period

| Attribute | Type | Description |
|-----------|------|-------------|
| budgetId (PK) | String | Unique budget identifier |
| startDate (SK) | Number | Budget period start timestamp |
| userId | String | Owner user ID |
| categoryId | String | Budget category |
| budgetAmount | Number | Budget limit amount |
| periodType | String | weekly, monthly, yearly |
| endDate | Number | Budget period end timestamp |
| alertThreshold | Number | Alert percentage (e.g., 80 for 80%) |
| isActive | String | "true" or "false" |
| currentSpent | Number | Current period spending |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdStartDateIndex` - PK: userId, SK: startDate
- `CategoryIdStartDateIndex` - PK: categoryId, SK: startDate
- `UserIdIsActiveIndex` - PK: userId, SK: isActive

---

### 7. GoalTable (DevCashlumeGoalTable)

**Purpose:** Stores savings goals and financial targets

| Attribute | Type | Description |
|-----------|------|-------------|
| goalId (PK) | String | Unique goal identifier |
| targetDate (SK) | Number | Goal target date timestamp |
| userId | String | Owner user ID |
| goalName | String | Goal display name |
| targetAmount | Number | Goal target amount |
| currentAmount | Number | Current saved amount |
| currency | String | Goal currency |
| linkedAccountId | String | Linked savings account |
| icon | String | UI icon name |
| color | String | UI color code |
| status | String | "active", "completed", "cancelled" |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdTargetDateIndex` - PK: userId, SK: targetDate
- `UserIdStatusIndex` - PK: userId, SK: status

---

### 8. TransferTable (DevCashlumeTransferTable)

**Purpose:** Stores account-to-account money transfers

| Attribute | Type | Description |
|-----------|------|-------------|
| transferId (PK) | String | Unique transfer identifier |
| transferDate (SK) | Number | Transfer date timestamp |
| userId | String | Owner user ID |
| fromAccountId | String | Source account |
| toAccountId | String | Destination account |
| amount | Number | Transfer amount |
| description | String | Transfer description |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

**Global Secondary Indexes:**
- `UserIdTransferDateIndex` - PK: userId, SK: transferDate
- `FromAccountIdTransferDateIndex` - PK: fromAccountId, SK: transferDate
- `ToAccountIdTransferDateIndex` - PK: toAccountId, SK: transferDate

---

### 9. NotificationTable (DevCashlumeNotificationTable)

**Purpose:** Stores in-app notifications and alerts

| Attribute | Type | Description |
|-----------|------|-------------|
| notificationId (PK) | String | Unique notification identifier |
| createdTimestamp (SK) | Number | Creation timestamp |
| userId | String | Target user ID |
| notificationType | String | budget_alert, bill_reminder, goal_milestone |
| title | String | Notification title |
| message | String | Notification message |
| isRead | String | "true" or "false" |
| relatedEntityType | String | transaction, budget, goal |
| relatedEntityId | String | ID of related entity |

**Global Secondary Indexes:**
- `UserIdCreatedTimestampIndex` - PK: userId, SK: createdTimestamp
- `UserIdIsReadIndex` - PK: userId, SK: isRead

---

### 10. SettingsTable (DevCashlumeSettingsTable)

**Purpose:** Stores user preferences and app settings

| Attribute | Type | Description |
|-----------|------|-------------|
| userId (PK) | String | User identifier |
| settingId (SK) | String | Setting identifier |
| notificationEnabled | String | "true" or "false" |
| biometricAuthEnabled | String | "true" or "false" |
| darkModeEnabled | String | "true" or "false" |
| defaultCurrency | String | User's default currency |
| language | String | App language preference |
| budgetAlertsEnabled | String | "true" or "false" |
| billRemindersEnabled | String | "true" or "false" |
| createdTimestamp | Number | Creation timestamp |
| updatedTimestamp | Number | Last update timestamp |

---

## Data Access Patterns

### User Management
1. Get user by userId: Query UserTable with PK
2. Get user by email: Query UserTable.EmailIndex
3. Get user by cognitoId: Query UserTable.CognitoIdIndex

### Account Management
1. Get all user accounts: Query AccountTable.UserIdIndex
2. Get active accounts: Query AccountTable.UserIdIsActiveIndex

### Transaction Queries
1. Get user transactions by date range: Query TransactionTable.UserIdTransactionDateIndex
2. Get account transactions: Query TransactionTable.AccountIdTransactionDateIndex
3. Get category transactions: Query TransactionTable.CategoryIdTransactionDateIndex
4. Filter by transaction type: Query TransactionTable.UserIdTransactionTypeIndex

### Budget & Goals
1. Get user budgets: Query BudgetTable.UserIdStartDateIndex
2. Get active budgets: Query BudgetTable.UserIdIsActiveIndex
3. Get user goals by target date: Query GoalTable.UserIdTargetDateIndex
4. Filter goals by status: Query GoalTable.UserIdStatusIndex

### Notifications
1. Get user notifications: Query NotificationTable.UserIdCreatedTimestampIndex
2. Get unread notifications: Query NotificationTable.UserIdIsReadIndex

---

## Naming Convention

All resources follow this pattern:
- **Development:** `DevCashlume{ResourceName}`
- **Test:** `TestCashlume{ResourceName}`
- **Production:** `ProdCashlume{ResourceName}`

## Cost Optimization

- **Billing Mode:** PAY_PER_REQUEST (on-demand) - no charge for idle capacity
- **Data Retention:** RETAIN policy prevents accidental deletion
- **GSI Design:** Optimized for common query patterns to minimize scans

## Security

- All tables require authenticated access via IAM roles
- Cognito handles user authentication and token management
- Fine-grained access control can be implemented using IAM policies
