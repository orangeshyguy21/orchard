/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardStatus {

  @Field()
  title: string;

  @Field()
  online: boolean;
  
}