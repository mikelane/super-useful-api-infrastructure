import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApiStack } from '../lib/api-stack';

describe('Api Gateway Infrastructure', () => {
  const app = new cdk.App();
  const stack = new ApiStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  it('matches the previous snapshot', () => {
    expect(template).toMatchSnapshot();
  });

  it('creates the super useful api gateway', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'SuperUsefulApi',
    });
  });

  it('creates the python lambda function', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
    });
  });
});
