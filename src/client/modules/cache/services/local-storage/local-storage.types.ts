export type Timezone = {
    tz: string|null;
}

export type Locale = {
    code: string|null;
}

export type Theme = {
    type: ThemeType | null;
}

export enum ThemeType {
    DARK_MODE = 'dark-mode',
    LIGHT_MODE = 'light-mode',
}