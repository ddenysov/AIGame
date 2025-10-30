.PHONY: build deploy delete validate clean

# Build the SAM application
build:
	sam build

# Deploy the SAM application
deploy: build
	sam deploy --no-confirm-changeset

# Build and deploy
all: build deploy

# Delete the CloudFormation stack
delete:
	sam delete

# Validate the SAM template
validate:
	sam validate

# Clean build artifacts
clean:
	rm -rf .aws-sam

