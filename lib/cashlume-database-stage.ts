import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildConfig } from './build-config';
import { CashlumeDatabaseStack } from './cashlume-database-stack';

export class CashlumeDatabaseStage extends cdk.Stage {
    constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: cdk.StageProps) {
        super(scope, id, props);

        const stackId = `${buildConfig.envPrefix}DatabaseStack`;

        new CashlumeDatabaseStack(this, stackId, buildConfig, {
            stackName: stackId,
            env: {
                region: buildConfig.region,
                account: buildConfig.awsAccountId
            }
        });
    }
}
