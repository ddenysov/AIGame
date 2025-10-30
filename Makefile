.PHONY: build deploy delete validate clean help

# Build the entire SAM application
build:
	@echo "Building AI Game Infrastructure..."
	sam build

# Deploy the entire infrastructure (Lambda + Agent)
deploy: build
	@echo "Deploying AI Game Infrastructure..."
	sam deploy --no-confirm-changeset

# Build and deploy
all: build deploy

# Delete the CloudFormation stack
delete:
	@echo "Deleting AI Game Infrastructure..."
	sam delete

# Validate the SAM template
validate:
	@echo "Validating SAM templates..."
	sam validate

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf .aws-sam

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make build    - Build the SAM application"
	@echo "  make deploy   - Build and deploy the entire infrastructure"
	@echo "  make all      - Same as deploy"
	@echo "  make delete   - Delete all stacks"
	@echo "  make validate - Validate SAM templates"
	@echo "  make clean    - Clean build artifacts"
	@echo ""
	@echo "This will deploy both Lambda functions and Bedrock Agent as nested stacks."


