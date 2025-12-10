'use client';

import { Session } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AddToCalendar({ session }: { session: Session }) {
    const getGoogleCalendarUrl = () => {
        // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
        // Note: Simple implementation assuming local time or UTC issues might exist, 
        // but for MVP we parse the stored date/time string.

        const [year, month, day] = session.date.split('-');
        const [hours, minutes] = session.time.split(':');

        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
        const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // Assume 3 hours duration default

        const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: session.title,
            details: `Master: ${session.masterName}\nSistema: ${session.system}\n\n${session.description}`,
            location: session.location,
            dates: `${format(startDate)}/${format(endDate)}`
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const downloadIcs = () => {
        const [year, month, day] = session.date.split('-');
        const [hours, minutes] = session.time.split(':');

        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
        const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));

        const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${format(startDate)}`,
            `DTEND:${format(endDate)}`,
            `SUMMARY:${session.title}`,
            `DESCRIPTION:Master: ${session.masterName}\\nSistema: ${session.system}\\n\\n${session.description}`,
            `LOCATION:${session.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${session.title.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    textDecoration: 'none',
                    color: 'var(--foreground)'
                }}
            >
                📅 Google Calendar
            </a>
            <button
                onClick={downloadIcs}
                className="btn"
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                }}
            >
                ⬇️ Scarica ICS
            </button>
        </div>
    );
}
