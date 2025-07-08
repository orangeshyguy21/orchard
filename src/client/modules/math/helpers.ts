export function median(values: number[]): number {
    if (values.length === 0) return 0;
    values = [...values].sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return (values.length % 2
        ? values[half]
        : (values[half - 1] + values[half]) / 2
    );  
}

export function avg(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

export function max(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values);
}

export function min(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.min(...values);
}