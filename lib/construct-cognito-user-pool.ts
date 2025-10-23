import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from "constructs";
import { BuildConfig } from "./build-config";

export class CognitoUserPool extends Construct {

    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}UserPool`);

        const userPoolName = `${buildConfig.envPrefix}UserPool`;

        // Create a Cognito User Pool
        const pool = new cognito.UserPool(this, userPoolName, {
            userPoolName: userPoolName,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                    mutable: false,
                    required: true,
                },
                givenName: {
                    mutable: true,
                    required: false,
                },
                familyName: {
                    mutable: true,
                    required: false,
                },
                phoneNumber: {
                    mutable: true,
                    required: false,
                },
            },
            keepOriginal: {
                email: true,
            },
            userVerification: {
                emailSubject: `Verify your email for ${buildConfig.appName}`,
                emailBody: `Hello {username},

                            Welcome to ${buildConfig.appName}! Please verify your email. Your verification code is {####}

                            Thank you!`,
                emailStyle: cognito.VerificationEmailStyle.CODE,
            },
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            passwordPolicy: {
                minLength: 8,
                tempPasswordValidity: cdk.Duration.days(3),
                requireDigits: true,
                requireLowercase: true,
                requireUppercase: true,
                requireSymbols: true,
            },
        });

        const clientName = `${buildConfig.envPrefix}UserPoolClient`;

        // Create a User Pool Client
        const client = pool.addClient(clientName, {
            userPoolClientName: clientName,
            authFlows: {
                userSrp: true,
            },
        });

        this.userPool = pool;
        this.userPoolClient = client;
    }
}
