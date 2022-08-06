import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
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

  it('creates the dynamodb table', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
      TableName: 'SuperUsefulApiTable',
      KeySchema: [
        { AttributeName: 'PARTITION_KEY' },
        { AttributeName: 'SORT_KEY' },
      ],
    });
  });

  it('allows the hello handler to read and write to the ddb table', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp(
        'HelloHandlerServiceRoleDefaultPolicy.*'
      ),
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
          },
        ],
      },
    });
  });
});
