.PHONY: deploy build delete help

# Get Lambda ARN from Lambda stack
LAMBDA_ARN ?= $(shell aws cloudformation describe-stacks --stack-name ai-game-lambda-functions --query 'Stacks[0].Outputs[?OutputKey==`ToolRollDiceFunctionArn`].OutputValue' --output text 2>/dev/null || echo "")

# Deploy agent-master
deploy: build
	@echo "Deploying agent-master..."
	@if [ -z "$(LAMBDA_ARN)" ]; then \
		echo "Error: Lambda function ARN not found. Please deploy Lambda stack first or set LAMBDA_ARN environment variable."; \
		echo "Example: LAMBDA_ARN=arn:aws:lambda:region:account:function:ToolRollDice make deploy"; \
		exit 1; \
	fi
	@INSTRUCTION=$$(cat instruction.txt | sed 's/"/\\"/g' | tr '\n' ' '); \
	sam deploy --no-confirm-changeset --parameter-overrides \
		"AgentInstruction=\"$$INSTRUCTION\"" \
		"ToolRollDiceLambdaArn=$(LAMBDA_ARN)"

# Build agent-master
build:
	@echo "Building agent-master..."
	sam build

# Delete agent-master stack
delete:
	@echo "Deleting agent-master stack..."
	sam delete --no-prompts

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make deploy - Build and deploy agent-master"
	@echo "  make build  - Build agent-master"
	@echo "  make delete - Delete agent-master stack"
	@echo ""
	@echo "Note: Before deploying, make sure Lambda stack is deployed first."
	@echo "Or set LAMBDA_ARN manually: LAMBDA_ARN=arn:aws:lambda:... make deploy"

