/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardAiAssistantSystemMessage {
	@Field()
	role: string;

	@Field()
	content: string;

	constructor(ai_assistant_system_message: any) {
		this.role = ai_assistant_system_message.role;
		this.content = ai_assistant_system_message.content;
	}
}

@ObjectType()
export class OrchardAiAssistantToolParameters {
	@Field()
	type: string;

	@Field()
	properties: string;

	@Field(() => [String])
	required: string[];

	constructor(ai_assistant_tool_parameters: any) {
		this.type = ai_assistant_tool_parameters.type;
		this.properties = JSON.stringify(ai_assistant_tool_parameters.properties);
		this.required = ai_assistant_tool_parameters.required;
	}
}

@ObjectType()
export class OrchardAiAssistantToolFunction {
	@Field()
	name: string;

	@Field()
	description: string;

	@Field(() => OrchardAiAssistantToolParameters)
	parameters: OrchardAiAssistantToolParameters;

	constructor(ai_assistant_tool_function: any) {
		this.name = ai_assistant_tool_function.name;
		this.description = ai_assistant_tool_function.description;
		this.parameters = new OrchardAiAssistantToolParameters(ai_assistant_tool_function.parameters);
	}
}

@ObjectType()
export class OrchardAiAssistantTool {
	@Field()
	type: string;

	@Field(() => OrchardAiAssistantToolFunction)
	function: OrchardAiAssistantToolFunction;

	constructor(ai_assistant_tool: any) {
		this.type = ai_assistant_tool.type;
		this.function = new OrchardAiAssistantToolFunction(ai_assistant_tool.function);
	}
}

@ObjectType()
export class OrchardAiAssistant {
	@Field()
	name: string;

	@Field()
	description: string;

	@Field()
	icon: string;

	@Field({nullable: true})
	section: string;

	@Field(() => OrchardAiAssistantSystemMessage)
	system_message: OrchardAiAssistantSystemMessage;

	@Field(() => [OrchardAiAssistantTool])
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
