/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'AI assistant system message'})
export class OrchardAiAssistantSystemMessage {
	@Field({description: 'Message role'})
	role: string;

	@Field({description: 'Message content'})
	content: string;

	constructor(ai_assistant_system_message: any) {
		this.role = ai_assistant_system_message.role;
		this.content = ai_assistant_system_message.content;
	}
}

@ObjectType({description: 'AI assistant tool function parameters'})
export class OrchardAiAssistantToolParameters {
	@Field({description: 'Parameter schema type'})
	type: string;

	@Field({description: 'JSON-encoded parameter properties'})
	properties: string;

	@Field(() => [String], {description: 'List of required parameter names'})
	required: string[];

	constructor(ai_assistant_tool_parameters: any) {
		this.type = ai_assistant_tool_parameters.type;
		this.properties = JSON.stringify(ai_assistant_tool_parameters.properties);
		this.required = ai_assistant_tool_parameters.required;
	}
}

@ObjectType({description: 'AI assistant tool function definition'})
export class OrchardAiAssistantToolFunction {
	@Field({description: 'Function name'})
	name: string;

	@Field({description: 'Function description'})
	description: string;

	@Field(() => OrchardAiAssistantToolParameters, {description: 'Function parameters schema'})
	parameters: OrchardAiAssistantToolParameters;

	constructor(ai_assistant_tool_function: any) {
		this.name = ai_assistant_tool_function.name;
		this.description = ai_assistant_tool_function.description;
		this.parameters = new OrchardAiAssistantToolParameters(ai_assistant_tool_function.parameters);
	}
}

@ObjectType({description: 'AI assistant tool'})
export class OrchardAiAssistantTool {
	@Field({description: 'Tool type'})
	type: string;

	@Field(() => OrchardAiAssistantToolFunction, {description: 'Tool function definition'})
	function: OrchardAiAssistantToolFunction;

	constructor(ai_assistant_tool: any) {
		this.type = ai_assistant_tool.type;
		this.function = new OrchardAiAssistantToolFunction(ai_assistant_tool.function);
	}
}

@ObjectType({description: 'AI assistant configuration'})
export class OrchardAiAssistant {
	@Field({description: 'Assistant name'})
	name: string;

	@Field({description: 'Assistant description'})
	description: string;

	@Field({description: 'Display icon identifier'})
	icon: string;

	@Field({nullable: true, description: 'UI section grouping'})
	section: string;

	@Field(() => OrchardAiAssistantSystemMessage, {description: 'System message configuration'})
	system_message: OrchardAiAssistantSystemMessage;

	@Field(() => [OrchardAiAssistantTool], {description: 'Tools available to the assistant'})
	tools: OrchardAiAssistantTool[];

	constructor(ai_assistant: any) {
		this.name = ai_assistant.name;
		this.description = ai_assistant.description;
		this.icon = ai_assistant.icon;
		this.section = ai_assistant.section;
		this.system_message = new OrchardAiAssistantSystemMessage(ai_assistant.system_message);
		this.tools = ai_assistant.tools.map((tool: any) => new OrchardAiAssistantTool(tool));
	}
}
