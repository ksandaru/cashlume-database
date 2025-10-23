import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { getConfigByEnv } from './build-config';
import { CashlumeDatabaseStage } from './cashlume-database-stage';


export class CashlumeDatabasePipeline extends cdk.Stack {
    constructor(app: cdk.App, pipelineName: string, props?: cdk.StackProps) {
        super(app, pipelineName, props);

        //create code-pipeline artifact bucket
        const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
            versioned: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

        //create code pipeline
        const pipeline = new CodePipeline(this, pipelineName, {
            pipelineName: pipelineName,
            artifactBucket: artifactBucket,
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('ksandaru/cashlume-database', 'main', {
                    connectionArn: 'arn:aws:codeconnections:ap-southeast-1:194722400753:connection/2ff908cd-25a0-4328-8054-a0fe693abdb8'
                }),
                commands: [
                    'node --version',
                    'npm ci',
                    'npm install -g aws-cdk',
                    'cdk synth -c pipeline=true',
                    'npm run build',
                ]
            }),
            dockerEnabledForSynth: true,
            publishAssetsInParallel: false,
            codeBuildDefaults: {
                buildEnvironment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                    environmentVariables: {
                        NODE_VERSION: { value: '22' },
                    }
                }
            }
        });

        //Test environment deployment
        const testBuildConfig = getConfigByEnv('test', app);
        const testStageId = 'TestEnvStage';
        const testStage = pipeline.addStage(new CashlumeDatabaseStage(this, testStageId, testBuildConfig, props));

        //Add manual approval before prod
        testStage.addPost(new ManualApprovalStep('Manual Approval Before Production'));

        //Prod environment deployment
        const prodBuildConfig = getConfigByEnv('prod', app);
        const prodStageId = 'ProdEnvStage';
        const prodStage = pipeline.addStage(new CashlumeDatabaseStage(this, prodStageId, prodBuildConfig, props));
    }
}
