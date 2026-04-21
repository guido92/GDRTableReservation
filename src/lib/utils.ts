export function formatDate(dateString: string): string {
    if (!dateString) return 'Data da definire';
    try {
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
}

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
