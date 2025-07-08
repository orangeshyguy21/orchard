export function median(values: number[]): number {
    if (values.length === 0) return 0;
    values = [...values].sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return (values.length % 2
        ? values[half]
        : (values[half - 1] + values[half]) / 2
    );  
}