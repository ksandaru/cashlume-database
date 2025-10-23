#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CashlumeDatabaseStack } from '../lib/cashlume-database-stack';
import { getConfig } from '../lib/build-config';
import { CashlumeDatabasePipeline } from '../lib/cashlume-database-pipeline';

const app = new cdk.App();
const buildConfig = getConfig(app);

if (buildConfig.pipelineMode) {

  //run pipeline mode via cdk deploy -c pipeline=true
  const pipelineName = 'CashlumeDatabasePipeline';

  new CashlumeDatabasePipeline(app, pipelineName, {
    env: {
      account: buildConfig.awsAccountId,
      region: buildConfig.region
    }
  });

  app.synth();
}

else {
  //if not given the pipeline, create the environment manually
  const stackId = `${buildConfig.envPrefix}DatabaseStack`;

  new CashlumeDatabaseStack(app, stackId, buildConfig, {
    stackName: stackId,
    env: {
      region: buildConfig.region,
      account: buildConfig.awsAccountId
    }
  })
}