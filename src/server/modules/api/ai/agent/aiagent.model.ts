/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardAiAgentSystemMessage {

    @Field()
    role: string;

    @Field()
    content: string;

    constructor(ai_agent_system_message: any) {
        this.role = ai_agent_system_message.role;
        this.content = ai_agent_system_message.content;
    }
}

@ObjectType()
export class OrchardAiAgentToolParameters {

    @Field()
    type: string;

    @Field()
    properties: string;

    constructor(ai_agent_tool_parameters: any) {
        this.type = ai_agent_tool_parameters.type;
        this.properties = JSON.stringify(ai_agent_tool_parameters.properties);
    }
}

@ObjectType()
export class OrchardAiAgentToolFunction {

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => OrchardAiAgentToolParameters)
    parameters: OrchardAiAgentToolParameters;

    constructor(ai_agent_tool_function: any) {
        this.name = ai_agent_tool_function.name;
        this.description = ai_agent_tool_function.description;
        this.parameters = new OrchardAiAgentToolParameters(ai_agent_tool_function.parameters);
    }
}

@ObjectType()
export class OrchardAiAgentTool {

    @Field()
    type: string;

    @Field(() => OrchardAiAgentToolFunction)
    function: OrchardAiAgentToolFunction;

    constructor(ai_agent_tool: any) {
        this.type = ai_agent_tool.type;
        this.function = new OrchardAiAgentToolFunction(ai_agent_tool.function);
    }
}

@ObjectType()
export class OrchardAiAgent {

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => OrchardAiAgentSystemMessage)
    system_message: OrchardAiAgentSystemMessage; 

    @Field(() => [OrchardAiAgentTool])
    tools: OrchardAiAgentTool[];

    constructor(ai_agent: any) {
        this.name = ai_agent.name;
        this.description = ai_agent.description;
        this.system_message = new OrchardAiAgentSystemMessage(ai_agent.system_message);
        this.tools = ai_agent.tools.map((tool: any) => new OrchardAiAgentTool(tool));
    }
}   