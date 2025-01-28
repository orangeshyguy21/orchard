/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Status {
  @Field()
  title: string;

  @Field()
  online: boolean;
}