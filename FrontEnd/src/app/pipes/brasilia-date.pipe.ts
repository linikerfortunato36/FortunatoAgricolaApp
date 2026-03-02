import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converte datas UTC vindas do backend para o horário de Brasília (UTC-3).
 * Uso no template: {{ date | brasiliaDate }} ou {{ date | brasiliaDate:'dd/MM/yyyy' }}
 */
@Pipe({
    name: 'brasiliaDate',
    standalone: true
})
export class BrasiliaDatePipe implements PipeTransform {
    transform(value: string | Date | null | undefined, format: 'datetime' | 'date' | 'time' = 'datetime'): string {
        if (!value) return '-';

        // Garante que o valor seja tratado como UTC
        const raw = typeof value === 'string' ? value : value.toISOString();
        const utcString = raw.includes('Z') || raw.includes('+') ? raw : raw + 'Z';
        const date = new Date(utcString);

        if (isNaN(date.getTime())) return '-';

        const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Sao_Paulo' };

        if (format === 'date') {
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
        } else if (format === 'time') {
            options.hour = '2-digit';
            options.minute = '2-digit';
        } else {
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return new Intl.DateTimeFormat('pt-BR', options).format(date);
    }
}
