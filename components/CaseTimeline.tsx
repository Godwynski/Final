'use client'

import { useMemo } from 'react'

interface TimelineEvent {
    id: string
    type: 'note' | 'log' | 'evidence' | 'creation'
    date: Date
    title: string
    description?: string
    user?: string
    metadata?: any
}

export default function CaseTimeline({
    caseData,
    notes,
    auditLogs,
    evidence,
    onViewImage
}: {
    caseData: any,
    notes: any[],
    auditLogs: any[],
    evidence: any[],
    onViewImage?: (url: string) => void
}) {
    const events: TimelineEvent[] = useMemo(() => {
        const list: TimelineEvent[] = []

        // Case Creation
        list.push({
            id: 'creation',
            type: 'creation',
            date: new Date(caseData.created_at),
            title: 'Case Created',
            description: `Case #${caseData.case_number} reported by ${caseData.reported_by?.full_name || caseData.reported_by?.email || 'Unknown'}.`,
            user: caseData.reported_by?.full_name || 'System'
        })

        // Notes
        notes.forEach(note => {
            list.push({
                id: `note-${note.id}`,
                type: 'note',
                date: new Date(note.created_at),
                title: 'Note Added',
                description: note.content,
                user: note.profiles?.full_name || note.profiles?.email || 'Unknown'
            })
        })

        // Evidence
        evidence.forEach(item => {
            list.push({
                id: `evidence-${item.id}`,
                type: 'evidence',
                date: new Date(item.created_at),
                title: 'Evidence Uploaded',
                description: `${item.file_name} (${item.description || 'No description'})`,
                user: item.uploaded_by_profile?.full_name || item.uploaded_by_profile?.email || 'Unknown',
                metadata: { url: item.file_path }
            })
        })

        // Audit Logs
        auditLogs.forEach(log => {
            // Filter out logs that are redundant if we want (e.g. "Case Created" is already handled)
            // But let's keep them for completeness or filter specific ones.
            if (log.action === 'Created Case') return;

            let description = '';
            let metadata: any = undefined;

            if (log.details?.narrative_action) {
                description = log.details.narrative_action;
            } else if (log.details?.new_status) {
                description = `Status changed from ${log.details.old_status} to ${log.details.new_status}`;
            } else if (log.action === 'Deleted Evidence' && log.details?.file_name) {
                // Handle evidence deletion
                description = `Deleted file: ${log.details.file_name}`;
            } else if (log.details?.file_name) {
                // Handle evidence upload details (both guest and staff)
                description = `File: ${log.details.file_name}${log.details.description ? ` - ${log.details.description}` : ''}`;
                // Add file_path to metadata if available so View Attachment link appears
                if (log.details.file_path) {
                    metadata = { url: log.details.file_path };
                }
            } else if (log.details?.name && log.details?.type) {
                // Handle party addition
                description = `Added ${log.details.name} as ${log.details.type}`;
            } else if (log.details) {
                // For other details, create a more readable format
                const entries = Object.entries(log.details)
                    .filter(([key, value]) => value !== null && value !== undefined && key !== 'case_id')
                    .map(([originalKey, value]) => {
                        const key = originalKey.toLowerCase();
                        const label = originalKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        let val = value;
                        // Try to parse stringified JSON if it looks like JSON
                        if (typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
                            try {
                                val = JSON.parse(value);
                            } catch (e) {
                                // Not JSON, keep original value
                            }
                        }

                        // Skip Action Key if it's just repeating the action or internal code
                        if (key === 'action_key') {
                             return `${label}: ${String(val).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
                        }

                        // Handle 'resolution' object
                        if (key === 'resolution' && typeof val === 'object' && val !== null) {
                            const res = val as any;
                            const parts = [];
                            if (res.type) parts.push(`Type: ${res.type}`);
                            if (res.terms) parts.push(`Terms: ${res.terms}`);
                            if (res.officer) parts.push(`Officer: ${res.officer}`);
                            // Handle date in resolution
                            if (res.date) {
                                try {
                                    parts.push(`Date: ${new Date(res.date).toLocaleDateString()}`);
                                } catch (e) {
                                    parts.push(`Date: ${res.date}`);
                                }
                            }
                            return `${label}:\n  ${parts.join('\n  ')}`;
                        }
                        
                        // Handle 'input' object (common in re-scheduling etc)
                        if (key === 'input' && typeof val === 'object' && val !== null) {
                            const input = val as any;
                            const parts = [];
                            if (input.type) parts.push(`Type: ${input.type}`);
                            if (input.date) {
                                try {
                                    parts.push(`Date: ${new Date(input.date).toLocaleString()}`);
                                } catch (e) {
                                    parts.push(`Date: ${input.date}`);
                                }
                            }
                            // Add other input fields if they exist
                            Object.keys(input).forEach(k => {
                                if (k !== 'type' && k !== 'date') {
                                    parts.push(`${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${input[k]}`);
                                }
                            });
                            return `${label}: ${parts.join(', ')}`;
                        }
                        
                        // Handle generic objects (recurse slightly or just JSON stringify safely)
                        if (typeof val === 'object' && val !== null) {
                            // Try to extract meaningful info from objects
                            const objEntries = Object.entries(val)
                                .filter(([, v]) => v !== null && v !== undefined)
                                .map(([k, v]) => {
                                    const niceKey = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    return `${niceKey}: ${v}`;
                                })
                                .join(', ');
                            return objEntries ? `${label}: ${objEntries}` : `${label}: ${JSON.stringify(val)}`;
                        }
                        
                        return `${label}: ${val}`;
                    })
                    .filter(entry => entry !== null); // Remove null entries
                
                // If there are multiple entries, format them as a list
                if (entries.length > 3) {
                    description = entries.join('\n• ');
                    description = '• ' + description;
                } else if (entries.length > 0) {
                    description = entries.join(' • ');
                } else {
                    description = 'Action performed';
                }
            } else {
                description = 'Action performed';
            }

            list.push({
                id: `log-${log.id}`,
                type: 'log',
                date: new Date(log.created_at),
                title: log.action,
                description: description,
                user: log.profiles?.full_name || log.profiles?.email || 'System',
                metadata: metadata
            })
        })

        // Sort by date descending (newest first)
        return list.sort((a, b) => b.date.getTime() - a.date.getTime())
    }, [caseData, notes, auditLogs, evidence])

    return (
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
            {events.map((event) => (
                <div key={event.id} className="relative ml-6">
                    <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-10 ring-8 ring-white dark:ring-gray-900 
                        ${event.type === 'creation' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${event.type === 'note' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${event.type === 'evidence' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${event.type === 'log' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                    `}>
                        {event.type === 'creation' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>}
                        {event.type === 'note' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
                        {event.type === 'evidence' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>}
                        {event.type === 'log' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </span>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                                {event.date.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words mb-2">{event.description}</p>

                        {event.metadata?.url && (
                            <a
                                href={event.metadata.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (onViewImage) {
                                        e.preventDefault()
                                        onViewImage(event.metadata.url)
                                    }
                                }}
                                className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                View Attachment
                            </a>
                        )}

                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                            Action by: <span className="font-medium">{event.user}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
