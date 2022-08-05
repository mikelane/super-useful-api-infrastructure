import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda-python-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const helloHandler = new lambda.PythonFunction(this, 'HelloHandler', {
      entry: '../super-useful-api-service/handlers/hello',
      runtime: Runtime.PYTHON_3_9,
    });

    const api = new apig.RestApi(this, 'SuperUsefulApi', {
      deployOptions: {
        stageName: 'dev',
      },
    });

    new CfnOutput(this, 'apiUrl', {
      value: api.url,
      description: 'The URL of the Super Useful Api',
      exportName: 'superUsefulApiUrl',
    });

    const v1 = api.root.addResource('v1');

    const hello = v1.addResource('hello');
    hello.addMethod('GET', new apig.LambdaIntegration(helloHandler));
  }
}
