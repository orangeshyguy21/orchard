import { execSync } from 'child_process';

const steps = [
    { label: 'Generating Graph API schema', cmd: 'npx ts-node -r tsconfig-paths/register --project tsconfig.server.json scripts/generate-schema.ts' },
    { label: 'Generating TypeScript types', cmd: 'npx graphql-codegen' },
    { label: 'Building Server', cmd: 'nest build' },
    { label: 'Building Client', cmd: 'ng build' },
];

steps.forEach((step, i) => {
    console.log(`\n${step.label}...`);
    execSync(step.cmd, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
});
