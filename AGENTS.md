# AGENTS.md

General behavioral guidelines for any AI agent working in this repository.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

> **Note:** If your tool has built-in memory or task tracking (e.g. Claude Code's persistent memory and todo system), prefer those over file-based tracking. The file-based approach above is the universal fallback.

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Code Standards

- Always fully type your code
- For classes & services use PascalCase
- For functions use camelCase
- For variables use snake_case
- For CSS class names use kebab-case
- Include JSDoc comments for functions
- Keep your code DRY and avoid deep nesting and triangles of doom
- Patterns in the front end should be data down and actions up

## TypeScript File Structure

All `.ts` component and service files must follow this ordering convention. Each section should be separated by a blank line.

### 1. Imports (grouped by category, separated by blank lines)

```ts
/* Core Dependencies */        // Angular core, router, CDK, etc.
/* Vendor Dependencies */      // Third-party libs (luxon, rxjs, material, etc.)
/* Application Dependencies */ // Cross-module app imports (@client/modules/...)
/* Native Dependencies */      // Same-module imports (@client/modules/<this-module>/...)
/* Shared Dependencies */      // Generated types from @shared/
```

### 2. Class Body (strict top-to-bottom ordering)

```ts
export class ExampleComponent implements OnInit, OnDestroy {
    // ── Injected dependencies (private readonly, using inject()) ──
    private readonly myService = inject(MyService);
    private readonly router = inject(Router);

    // ── Public properties (non-reactive) ──
    public page_settings!: SomeType;
    public data_source = new MatTableDataSource<Item>([]);

    // ── Public signals ──
    public readonly count = signal<number>(0);
    public readonly error = signal<boolean>(false);

    // ── Public computed signals ──
    public readonly total = computed(() => this.count() * 2);

    // ── Private properties (non-reactive) ──
    private genesis_timestamp = 0;

    // ── Private signals ──
    private readonly loading_items = signal<boolean>(true);
    private readonly loading_users = signal<boolean>(true);

    // ── Private computed signals ──
    public readonly loading = computed(() => this.loading_items() || this.loading_users());

    // ── Private non-signal fields ──
    private subscriptions = new Subscription();

    // ── Constructor (only if needed beyond inject()) ──
    constructor() { }

    // ── Lifecycle: Init ──
    ngOnInit(): void { }

    // ── Methods (organized by section headers) ──

    /* *******************************************************
        Section Name
    ******************************************************** */

    /** JSDoc for each method */
    public onSomeAction(): void { }

    private loadData(): void { }

    /* *******************************************************
        Destroy
    ******************************************************** */

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
```

### Key rules

- **Dependencies**: Always use `inject()`, never constructor injection. Mark as `private readonly`.
- **Signals over primitives**: Prefer `signal()` / `computed()` for any reactive state.
- **Section headers**: Group related methods under comment block headers (Settings, Subscriptions, Data, Actions Up, Agent, Destroy, etc.).
- **`ngOnInit` at the top of methods**: Sits between properties and the method sections.
- **`ngOnDestroy` always last**: Cleanup logic is the final section in the class body.
- **Spec files required**: Every new `.component.ts` or `.service.ts` file must have an accompanying `.spec.ts` file created alongside it.
