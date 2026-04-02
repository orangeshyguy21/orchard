import { execSync } from 'child_process';

const steps = [
    { label: 'Generating graph API schema', cmd: 'npx ts-node -r tsconfig-paths/register --project tsconfig.server.json scripts/generate-schema.ts' },
    { label: 'Generating shared types', cmd: 'npx graphql-codegen' },
    { label: 'Building server', cmd: 'nest build' },
    { label: 'Building client', cmd: 'ng build' },
];

steps.forEach((step, i) => {
    console.log(`\n${step.label}...`);
    execSync(step.cmd, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
});
