/**
 * Lambda function to roll dice
 * Handles both Bedrock Agent format and direct Lambda invocation
 * @param {Object} event - Lambda event object
 * @returns {Object} Response with array of dice roll results
 */
exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Check if this is a Bedrock Agent request
        const isBedrockAgent = event.messageVersion && event.agent;
        
        let sides, count;
        
        if (isBedrockAgent) {
            // Extract parameters from Bedrock Agent format
            const parameters = event.parameters || [];
            const sidesParam = parameters.find(p => p.name === 'sides');
            const countParam = parameters.find(p => p.name === 'count');
            
            sides = sidesParam ? parseInt(sidesParam.value) : null;
            count = countParam ? parseInt(countParam.value) : 1;
        } else {
            // Direct Lambda invocation format
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
            sides = body.sides || body.numberOfSides;
            count = body.count || body.numberOfDice || 1;
        }

        // Validate input parameters
        if (!sides || sides < 1) {
            const errorResponse = {
                error: 'Invalid number of sides. Must be a positive integer.'
            };
            
            if (isBedrockAgent) {
                return {
                    messageVersion: '1.0',
                    response: {
                        actionGroup: event.actionGroup,
                        apiPath: event.apiPath,
                        httpMethod: event.httpMethod,
                        httpStatusCode: 400,
                        responseBody: {
                            'application/json': {
                                body: JSON.stringify(errorResponse)
                            }
                        }
                    }
                };
            }
            
            return {
                statusCode: 400,
                body: JSON.stringify(errorResponse)
            };
        }

        if (!count || count < 1) {
            const errorResponse = {
                error: 'Invalid number of dice. Must be a positive integer.'
            };
            
            if (isBedrockAgent) {
                return {
                    messageVersion: '1.0',
                    response: {
                        actionGroup: event.actionGroup,
                        apiPath: event.apiPath,
                        httpMethod: event.httpMethod,
                        httpStatusCode: 400,
                        responseBody: {
                            'application/json': {
                                body: JSON.stringify(errorResponse)
                            }
                        }
                    }
                };
            }
            
            return {
                statusCode: 400,
                body: JSON.stringify(errorResponse)
            };
        }

        // Roll the dice and generate results
        const results = [];
        for (let i = 0; i < count; i++) {
            // Generate random number between 1 and sides (inclusive)
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
        }

        const responseBody = {
            sides: sides,
            count: count,
            results: results,
            total: results.reduce((sum, val) => sum + val, 0)
        };

        console.log('Dice roll result:', JSON.stringify(responseBody, null, 2));

        // Return successful response in appropriate format
        if (isBedrockAgent) {
            return {
                messageVersion: '1.0',
                response: {
                    actionGroup: event.actionGroup,
                    apiPath: event.apiPath,
                    httpMethod: event.httpMethod,
                    httpStatusCode: 200,
                    responseBody: {
                        'application/json': {
                            body: JSON.stringify(responseBody)
                        }
                    }
                }
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(responseBody)
        };
    } catch (error) {
        console.error('Error rolling dice:', error);
        
        const errorResponse = {
            error: 'Internal server error',
            message: error.message
        };

        // Check if this is a Bedrock Agent request
        const isBedrockAgent = event.messageVersion && event.agent;
        
        if (isBedrockAgent) {
            return {
                messageVersion: '1.0',
                response: {
                    actionGroup: event.actionGroup,
                    apiPath: event.apiPath,
                    httpMethod: event.httpMethod,
                    httpStatusCode: 500,
                    responseBody: {
                        'application/json': {
                            body: JSON.stringify(errorResponse)
                        }
                    }
                }
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify(errorResponse)
        };
    }
};

