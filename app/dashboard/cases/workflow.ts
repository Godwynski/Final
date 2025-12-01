
export type CaseStatus = 'New' | 'Under Investigation' | 'Hearing Scheduled' | 'Settled' | 'Closed' | 'Dismissed' | 'Referred';

export interface WorkflowAction {
    label: string;
    action: string;
    nextStatus?: CaseStatus;
    variant: 'primary' | 'secondary' | 'danger' | 'success';
    icon?: string;
    requiresInput?: boolean; // If true, might need a modal/prompt (e.g. for hearing date)
    inputLabel?: string;
    inputType?: 'text' | 'date' | 'textarea';
    description?: string; // Tooltip for the action
}

export const STATUS_DESCRIPTIONS: Record<string, string> = {
    'New': "This case has just been reported. It needs to be reviewed by the Captain or Desk Officer before any action is taken.",
    'Under Investigation': "The Barangay is currently gathering facts, talking to witnesses, or waiting for the parties to appear.",
    'Hearing Scheduled': "A formal face-to-face meeting has been set. Both the Complainant and Respondent are expected to attend.",
    'Settled': "Success! Both parties have reached a mutual agreement. The case is considered resolved.",
    'Closed': "This case is finished. A Certificate to File Action (CFA) may have been issued, or the parties stopped pursuing it.",
    'Dismissed': "The case was rejected. This usually happens if the Barangay doesn't have authority over the issue or if the complaint is invalid.",
    'Referred': "This case is too serious for the Barangay or belongs elsewhere. It has been sent to the Police, PAO, or Social Services."
};

export const CASE_WORKFLOW: Record<string, WorkflowAction[]> = {
    'New': [
        {
            label: 'Accept Case',
            action: 'accept_case',
            nextStatus: 'Under Investigation',
            variant: 'primary',
            icon: 'check',
            description: "Officially acknowledge this complaint and start the Barangay Justice process."
        },
        {
            label: 'Refer to Police/Agency',
            action: 'refer_case',
            nextStatus: 'Referred',
            variant: 'secondary',
            icon: 'share',
            requiresInput: true,
            inputLabel: 'Referred To (Agency/Office)',
            inputType: 'text',
            description: "Transfer this case to the Police, DSWD, or other agencies if it's not within Barangay jurisdiction."
        },
        {
            label: 'Dismiss Case',
            action: 'dismiss_case',
            nextStatus: 'Dismissed',
            variant: 'danger',
            icon: 'x',
            requiresInput: true,
            inputLabel: 'Reason for Dismissal',
            inputType: 'textarea',
            description: "Reject this complaint if it is invalid, baseless, or outside Barangay authority."
        }
    ],
    'Under Investigation': [
        {
            label: 'Schedule Hearing',
            action: 'schedule_hearing',
            nextStatus: 'Hearing Scheduled',
            variant: 'primary',
            icon: 'calendar',
            requiresInput: true,
            inputLabel: 'Hearing Date & Time',
            inputType: 'date',
            description: "Set a date for the Complainant and Respondent to meet face-to-face for mediation."
        },
        {
            label: 'Issue Summon',
            action: 'issue_summon',
            // Status stays same or maybe we have a 'Summon Issued' status?
            // For now let's keep it Under Investigation or move to Hearing Scheduled if summon implies hearing.
            // Let's assume Issue Summon implies a hearing is set or it's just a document generation.
            // Let's keep status same but log it.
            variant: 'secondary',
            icon: 'file-text',
            description: "Generate an official Summon letter ordering the Respondent to appear."
        },
        {
            label: 'Amicable Settlement',
            action: 'settle_case',
            nextStatus: 'Settled',
            variant: 'success',
            icon: 'handshake',
            requiresInput: true,
            inputLabel: 'Terms of Settlement',
            inputType: 'textarea',
            description: "Record that both parties have agreed to settle the dispute peacefully."
        }
    ],
    'Hearing Scheduled': [
        {
            label: 'Record Settlement',
            action: 'settle_case',
            nextStatus: 'Settled',
            variant: 'success',
            icon: 'handshake',
            requiresInput: true,
            inputLabel: 'Terms of Settlement',
            inputType: 'textarea',
            description: "Document the final agreement signed by both parties."
        },
        {
            label: 'Reschedule Hearing',
            action: 'reschedule_hearing',
            nextStatus: 'Hearing Scheduled',
            variant: 'secondary',
            icon: 'clock',
            requiresInput: true,
            inputLabel: 'New Hearing Date',
            inputType: 'date',
            description: "Change the date of the hearing if one or both parties cannot attend."
        },
        {
            label: 'Issue CFA (File Action)',
            action: 'issue_cfa',
            nextStatus: 'Closed',
            variant: 'danger',
            icon: 'file-minus',
            requiresInput: true,
            inputLabel: 'Reason for CFA (e.g. Mediation Failed)',
            inputType: 'textarea',
            description: "Issue a Certificate to File Action, allowing the Complainant to go to court since mediation failed."
        }
    ],
    'Settled': [
        {
            label: 'Re-open Case',
            action: 'reopen_case',
            nextStatus: 'Under Investigation',
            variant: 'secondary',
            icon: 'refresh-cw',
            requiresInput: true,
            inputLabel: 'Reason for Re-opening',
            inputType: 'textarea',
            description: "Re-activate this case if the settlement agreement was breached or new issues arose."
        }
    ],
    'Closed': [
        {
            label: 'Re-open Case',
            action: 'reopen_case',
            nextStatus: 'Under Investigation',
            variant: 'secondary',
            icon: 'refresh-cw',
            requiresInput: true,
            inputLabel: 'Reason for Re-opening',
            inputType: 'textarea',
            description: "Re-activate the case for further investigation or new hearings."
        }
    ],
    'Dismissed': [
        {
            label: 'Re-open Case',
            action: 'reopen_case',
            nextStatus: 'Under Investigation',
            variant: 'secondary',
            icon: 'refresh-cw',
            requiresInput: true,
            inputLabel: 'Reason for Re-opening',
            inputType: 'textarea',
            description: "Re-activate the case if the dismissal was a mistake or new evidence was found."
        }
    ],
    'Referred': [
        {
            label: 'Re-open Case',
            action: 'reopen_case',
            nextStatus: 'Under Investigation',
            variant: 'secondary',
            icon: 'refresh-cw',
            requiresInput: true,
            inputLabel: 'Reason for Re-opening',
            inputType: 'textarea',
            description: "Re-activate the case if the referral agency sent it back to the Barangay."
        }
    ]
};
