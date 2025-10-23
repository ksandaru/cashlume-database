
import * as cdk from 'aws-cdk-lib';

const supportedEnvironments = ["dev", "test", "prod"] as const;
type SupportedEnvironment = typeof supportedEnvironments[number];

export interface BuildConfig {
    readonly env: SupportedEnvironment;
    readonly region: string;
    readonly envPrefix: string;
    readonly appName: string;
    readonly awsAccountId: string;
    readonly pipelineMode: boolean;
}

export const getConfig = (app: cdk.App): BuildConfig => {

    const defaultEnv = app.node.tryGetContext('defaultEnv');
    const awsAccountId = app.node.tryGetContext('awsAccountId');
    let env = app.node.tryGetContext('env');
    const isPipelineMode = app.node.tryGetContext('pipeline');

    if (!defaultEnv) {
        throw new Error('No default environment found. Please provide a valid environment');
    };

    if (!env) {
        console.log(`No environment found. Try to use the default environment: ${defaultEnv}`);
        env = defaultEnv;
    }

    if (!supportedEnvironments.includes(env)) {
        throw new Error(`Invalid environment: ${env}. Supported environments: ${supportedEnvironments.join(', ')}`);
    }

    //set up build config values
    console.log(`Loading the build config for environment: ${env}`);

    //select the correct environment
    const unparsedEnv = app.node.tryGetContext(env);

    //return the selected env config from cdk.json
    const returnValues = {
        env: env,
        region: ensureString(unparsedEnv, 'region'),
        envPrefix: ensureString(unparsedEnv, 'envPrefix'),
        appName: ensureString(unparsedEnv, 'appName'),
        awsAccountId: awsAccountId,
        pipelineMode: isPipelineMode
    }

    return returnValues;

}

const ensureString = (object: { [name: string]: any }, propName: string): string => {
    if (!object[propName] || object[propName].trim().length === 0) {
        throw new Error(`The property ${propName} is missing or empty`);
    }

    return object[propName];
}

export const getConfigByEnv = (environment: SupportedEnvironment, app: cdk.App): BuildConfig => {

    if (!supportedEnvironments.includes(environment)) {
        throw new Error(`Invalid environment: ${environment}. Supported environments: ${supportedEnvironments.join(', ')}`);

    }

    let isPipelineMode = app.node.tryGetContext('pipeline');
    const awsAccountId = app.node.tryGetContext('awsAccountId');
    const unparsedEnv = app.node.tryGetContext(environment);

    console.log(`loading the build config for environment using getConfigEnv: ${environment}`);

    const returnValues = {
        env: environment,
        region: ensureString(unparsedEnv, 'region'),
        envPrefix: ensureString(unparsedEnv, 'envPrefix'),
        appName: ensureString(unparsedEnv, 'appName'),
        awsAccountId: awsAccountId,
        pipelineMode: isPipelineMode
    }

    return returnValues;
}
