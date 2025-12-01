-- ==========================================
-- SEED DATA GENERATOR FOR BLOTTER SYSTEM
-- ==========================================
-- This script generates hundreds of realistic test data entries
-- Run this after setting up your schema and creating at least one user

-- First, let's create some helper data arrays
DO $$
DECLARE
    user_ids UUID[];
    case_id UUID;
    party_id UUID;
    i INT;
    j INT;
    random_user UUID;
    random_date TIMESTAMP;
    random_status TEXT;
    random_type TEXT;
BEGIN
    -- Get existing user IDs
    SELECT ARRAY_AGG(id) INTO user_ids FROM profiles LIMIT 10;
    
    -- If no users exist, exit
    IF user_ids IS NULL OR array_length(user_ids, 1) = 0 THEN
        RAISE NOTICE 'No users found. Please create at least one user before running this seed script.';
        RETURN;
    END IF;

    RAISE NOTICE 'Generating seed data...';

    -- ==========================================
    -- GENERATE 200 CASES
    -- ==========================================
    FOR i IN 1..200 LOOP
        -- Random status
        random_status := (ARRAY['New', 'Under Investigation', 'Hearing Scheduled', 'Settled', 'Closed', 'Dismissed', 'Referred'])[1 + floor(random() * 7)];
        
        -- Random incident type
        random_type := (ARRAY['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other'])[1 + floor(random() * 7)];
        
        -- Random user
        random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
        
        -- Random date in the last 365 days
        random_date := NOW() - (random() * INTERVAL '365 days');
        
        -- Insert case
        INSERT INTO cases (
            title,
            description,
            incident_date,
            incident_location,
            status,
            incident_type,
            narrative_facts,
            narrative_action,
            reported_by,
            created_at,
            updated_at
        ) VALUES (
            CASE random_type
                WHEN 'Theft' THEN (ARRAY['Bicycle Theft Report', 'Stolen Cellphone', 'Missing Wallet', 'Shoplifting Incident', 'House Burglary'])[1 + floor(random() * 5)]
                WHEN 'Harassment' THEN (ARRAY['Verbal Harassment Complaint', 'Online Bullying Report', 'Stalking Incident', 'Workplace Harassment', 'Neighbor Dispute'])[1 + floor(random() * 5)]
                WHEN 'Vandalism' THEN (ARRAY['Property Damage Report', 'Graffiti on Public Wall', 'Broken Windows', 'Damaged Vehicle', 'Destroyed Mailbox'])[1 + floor(random() * 5)]
                WHEN 'Physical Injury' THEN (ARRAY['Assault Report', 'Bar Fight Incident', 'Domestic Violence', 'School Altercation', 'Sports Injury Dispute'])[1 + floor(random() * 5)]
                WHEN 'Property Damage' THEN (ARRAY['Car Accident Damage', 'Fallen Tree Damage', 'Water Damage Complaint', 'Fire Damage Report', 'Construction Damage'])[1 + floor(random() * 5)]
                WHEN 'Public Disturbance' THEN (ARRAY['Noise Complaint', 'Loud Party Report', 'Street Gathering', 'Public Intoxication', 'Disorderly Conduct'])[1 + floor(random() * 5)]
                ELSE (ARRAY['General Complaint', 'Civil Dispute', 'Community Concern', 'Public Safety Issue', 'Miscellaneous Report'])[1 + floor(random() * 5)]
            END,
            'Detailed description of the incident. The complainant reported that on ' || 
            TO_CHAR(random_date, 'Month DD, YYYY') || ' at approximately ' || 
            LPAD((8 + floor(random() * 12))::TEXT, 2, '0') || ':' || 
            LPAD(floor(random() * 60)::TEXT, 2, '0') || 
            ' ' || (ARRAY['AM', 'PM'])[1 + floor(random() * 2)] || 
            ', they witnessed/experienced the incident at the location mentioned below.',
            random_date,
            (ARRAY[
                'Brgy. Hall Area', 'Main Street', 'Market District', 'School Zone', 
                'Park Area', 'Residential Subdivision', 'Commercial Complex', 
                'Sports Complex', 'Health Center Vicinity', 'Church Area',
                'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5',
                'Sitio San Jose', 'Sitio Riverside', 'Corner Main and Oak',
                'Near Public School', 'Basketball Court Area'
            ])[1 + floor(random() * 20)],
            random_status::case_status,
            random_type::incident_type,
            'Statement of facts as narrated by the complainant. The incident occurred as follows: ' ||
            (ARRAY[
                'The suspect approached the victim and allegedly committed the offense.',
                'According to witnesses, the incident started with a verbal argument.',
                'The complainant claims damages amounting to a significant sum.',
                'Multiple witnesses corroborate the complainants account.',
                'Evidence at the scene suggests the incident happened as described.'
            ])[1 + floor(random() * 5)],
            CASE 
                WHEN random_status = 'New' THEN 'Case logged and waiting for initial assessment.'
                WHEN random_status = 'Under Investigation' THEN 'Investigation ongoing. Statements being collected from involved parties.'
                WHEN random_status = 'Hearing Scheduled' THEN 'Mediation hearing scheduled. Both parties notified.'
                WHEN random_status = 'Settled' THEN 'Case settled through mediation. Agreement signed by all parties.'
                WHEN random_status = 'Closed' THEN 'Case closed. All necessary actions completed.'
                WHEN random_status = 'Dismissed' THEN 'Case dismissed due to lack of evidence/withdrawal of complaint.'
                ELSE 'Case referred to higher authorities for further action.'
            END,
            random_user,
            random_date,
            random_date + (random() * INTERVAL '30 days')
        ) RETURNING id INTO case_id;

        -- ==========================================
        -- ADD 2-4 INVOLVED PARTIES PER CASE
        -- ==========================================
        FOR j IN 1..(2 + floor(random() * 3)) LOOP
            INSERT INTO involved_parties (
                case_id,
                name,
                type,
                contact_number,
                email,
                address
            ) VALUES (
                case_id,
                (ARRAY[
                    'Juan Dela Cruz', 'Maria Santos', 'Jose Rizal', 'Pedro Garcia',
                    'Ana Reyes', 'Carlos Mendoza', 'Sofia Torres', 'Miguel Fernandez',
                    'Isabel Ramos', 'Antonio Lopez', 'Carmen Gonzales', 'Roberto Aquino',
                    'Lucia Bautista', 'Fernando Cruz', 'Elena Villanueva', 'Ramon Diaz',
                    'Teresa Martinez', 'Diego Sanchez', 'Angelica Rivera', 'Manuel Castro'
                ])[1 + floor(random() * 20)],
                (ARRAY['Complainant', 'Respondent', 'Witness'])[1 + floor(random() * 3)]::party_type,
                '09' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'),
                CASE WHEN random() > 0.5 THEN 
                    lower(substring(md5(random()::text), 1, 8)) || '@gmail.com'
                ELSE NULL END,
                'Blk ' || (1 + floor(random() * 50)) || ' Lot ' || (1 + floor(random() * 30)) || 
                ', ' || (ARRAY['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Sitio San Jose', 'Sitio Riverside'])[1 + floor(random() * 7)]
            ) RETURNING id INTO party_id;
        END LOOP;

        -- ==========================================
        -- ADD 1-5 CASE NOTES
        -- ==========================================
        FOR j IN 1..(1 + floor(random() * 5)) LOOP
            random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
            INSERT INTO case_notes (
                case_id,
                content,
                created_by,
                created_at
            ) VALUES (
                case_id,
                (ARRAY[
                    'Initial investigation conducted. All parties contacted.',
                    'Follow-up interview scheduled for next week.',
                    'Additional evidence submitted by complainant.',
                    'Witness testimony recorded and filed.',
                    'Mediation session completed. Progress made.',
                    'Waiting for respondent response to summons.',
                    'Case documents prepared for hearing.',
                    'Settlement proposal drafted and sent to parties.',
                    'Investigation findings documented.',
                    'Status update: proceeding to next phase.'
                ])[1 + floor(random() * 10)],
                random_user,
                random_date + (j * INTERVAL '3 days')
            );
        END LOOP;

        -- ==========================================
        -- ADD 0-3 EVIDENCE FILES
        -- ==========================================
        FOR j IN 1..floor(random() * 4) LOOP
            random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
            INSERT INTO evidence (
                case_id,
                file_path,
                file_name,
                file_type,
                description,
                uploaded_by,
                created_at
            ) VALUES (
                case_id,
                '/storage/evidence/' || gen_random_uuid()::text || 
                (ARRAY['.jpg', '.pdf', '.png', '.docx'])[1 + floor(random() * 4)],
                (ARRAY[
                    'incident_photo', 'damage_report', 'witness_statement', 
                    'receipt', 'cctv_screenshot', 'official_document',
                    'medical_certificate', 'police_report', 'barangay_clearance'
                ])[1 + floor(random() * 9)] || '_' || 
                floor(random() * 1000)::text ||
                (ARRAY['.jpg', '.pdf', '.png', '.docx'])[1 + floor(random() * 4)],
                (ARRAY['image/jpeg', 'application/pdf', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])[1 + floor(random() * 4)],
                (ARRAY[
                    'Photo evidence of the incident scene',
                    'Document supporting the complaint',
                    'Visual proof of damages',
                    'Official statement from witness',
                    'Receipt for claimed expenses',
                    'Supporting documentation',
                    'Medical report from hospital',
                    'Screenshot of online evidence'
                ])[1 + floor(random() * 8)],
                random_user,
                random_date + (j * INTERVAL '2 days')
            );
        END LOOP;

        -- ==========================================
        -- ADD 0-2 HEARINGS (for cases with Hearing Scheduled status)
        -- ==========================================
        IF random_status IN ('Hearing Scheduled', 'Settled', 'Closed') THEN
            FOR j IN 1..(1 + floor(random() * 2)) LOOP
                INSERT INTO hearings (
                    case_id,
                    hearing_date,
                    hearing_type,
                    status,
                    notes,
                    created_at
                ) VALUES (
                    case_id,
                    random_date + INTERVAL '7 days' + (j * INTERVAL '14 days'),
                    (ARRAY['Mediation', 'Conciliation', 'Arbitration'])[1 + floor(random() * 3)],
                    CASE 
                        WHEN random_status = 'Hearing Scheduled' THEN 'Scheduled'
                        WHEN random_status = 'Settled' THEN (ARRAY['Completed', 'Settled'])[1 + floor(random() * 2)]
                        ELSE (ARRAY['Completed', 'Settled', 'No Show'])[1 + floor(random() * 3)]
                    END,
                    (ARRAY[
                        'Both parties attended. Productive discussion.',
                        'Initial mediation session. Setting ground rules.',
                        'Settlement terms being negotiated.',
                        'Hearing postponed at parties request.',
                        'Final hearing. Agreement reached.',
                        'Respondent failed to appear. Rescheduled.',
                        'Complainant presented additional evidence.',
                        'Mediator facilitated compromise discussion.'
                    ])[1 + floor(random() * 8)],
                    random_date + INTERVAL '5 days'
                );
            END LOOP;
        END IF;

        -- ==========================================
        -- ADD 0-2 GUEST LINKS (25% chance)
        -- ==========================================
        IF random() > 0.75 THEN
            FOR j IN 1..(1 + floor(random() * 2)) LOOP
                random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
                INSERT INTO guest_links (
                    case_id,
                    token,
                    pin,
                    created_by,
                    expires_at,
                    is_active,
                    created_at
                ) VALUES (
                    case_id,
                    substring(md5(random()::text || clock_timestamp()::text), 1, 32),
                    LPAD(floor(random() * 10000)::TEXT, 4, '0'),
                    random_user,
                    random_date + INTERVAL '30 days',
                    random() > 0.3,
                    random_date + INTERVAL '1 day'
                );
            END LOOP;
        END IF;

        -- ==========================================
        -- ADD AUDIT LOG ENTRY
        -- ==========================================
        random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
        INSERT INTO audit_logs (
            user_id,
            case_id,
            action,
            details,
            created_at
        ) VALUES (
            random_user,
            case_id,
            'Case Created',
            jsonb_build_object(
                'case_number', (SELECT case_number FROM cases WHERE id = case_id),
                'status', random_status,
                'type', random_type
            ),
            random_date
        );

        -- Add status update audit logs
        IF random_status != 'New' THEN
            INSERT INTO audit_logs (
                user_id,
                case_id,
                action,
                details,
                created_at
            ) VALUES (
                random_user,
                case_id,
                'Status Updated',
                jsonb_build_object(
                    'old_status', 'New',
                    'new_status', random_status
                ),
                random_date + INTERVAL '1 day'
            );
        END IF;
    END LOOP;

    -- ==========================================
    -- GENERATE NOTIFICATIONS FOR USERS
    -- ==========================================
    FOR i IN 1..100 LOOP
        random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
        random_date := NOW() - (random() * INTERVAL '60 days');
        
        INSERT INTO notifications (
            user_id,
            title,
            message,
            link,
            is_read,
            created_at
        ) VALUES (
            random_user,
            (ARRAY[
                'New Case Assigned',
                'Case Status Updated',
                'Hearing Scheduled',
                'Evidence Uploaded',
                'New Note Added',
                'Case Settled',
                'Urgent: Case Requires Action',
                'Reminder: Upcoming Hearing'
            ])[1 + floor(random() * 8)],
            (ARRAY[
                'A new case has been assigned to you for review.',
                'Case status has been updated. Please check for details.',
                'A hearing has been scheduled. Review the date and time.',
                'New evidence has been uploaded to one of your cases.',
                'A new note has been added. Please review and respond.',
                'A case under your supervision has been marked as settled.',
                'This case requires immediate attention. Please review ASAP.',
                'Reminder: You have an upcoming hearing tomorrow.'
            ])[1 + floor(random() * 8)],
            '/dashboard/cases/' || gen_random_uuid()::text,
            random() > 0.4,
            random_date
        );
    END LOOP;

    RAISE NOTICE 'Seed data generation complete!';
    RAISE NOTICE '- 200 cases created';
    RAISE NOTICE '- ~600 involved parties created';
    RAISE NOTICE '- ~400 case notes created';
    RAISE NOTICE '- ~200 evidence files created';
    RAISE NOTICE '- ~100 hearings created';
    RAISE NOTICE '- ~50 guest links created';
    RAISE NOTICE '- ~300 audit logs created';
    RAISE NOTICE '- 100 notifications created';

END $$;
