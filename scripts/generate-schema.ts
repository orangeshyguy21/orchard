import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import { writeFileSync } from 'fs';
import { AppModule } from '../src/server/app.module';

async function generateSchema() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync('schema.gql', printSchema(schema));

  await app.close();
  console.log('Schema generated successfully');
}

generateSchema();