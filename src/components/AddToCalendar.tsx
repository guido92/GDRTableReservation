'use client';

import { Session } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AddToCalendar({ session }: { session: Session }) {
    const isValidData = session.date && session.date.includes('-') && session.time && session.time.includes(':');

    const getGoogleCalendarUrl = () => {
        if (!isValidData) return '#';
        
        try {
            const [year, month, day] = session.date.split('-');
            const [hours, minutes] = session.time.split(':');

            const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
            if (isNaN(startDate.getTime())) return '#';

            const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));
            const formatStr = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

            const params = new URLSearchParams({
                action: 'TEMPLATE',
                text: session.title,
                details: `Master: ${session.masterName}\nSistema: ${session.system}\n\n${session.description}`,
                location: session.location,
                dates: `${formatStr(startDate)}/${formatStr(endDate)}`
            });

            return `https://calendar.google.com/calendar/render?${params.toString()}`;
        } catch (e) {
            console.error("Error creating Calendar URL:", e);
            return '#';
        }
    };

    const downloadIcs = () => {
        if (!isValidData) return;

        try {
            const [year, month, day] = session.date.split('-');
            const [hours, minutes] = session.time.split(':');

            const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
            if (isNaN(startDate.getTime())) return;

            const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));
            const formatStr = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `DTSTART:${formatStr(startDate)}`,
                `DTEND:${formatStr(endDate)}`,
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
        } catch (e) {
            console.error("Error creating ICS:", e);
        }
    };

    if (!isValidData) {
        return (
            <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Dati calendario non disponibili
            </div>
        );
    }

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
