-- ==========================================
-- SEED DATA GENERATOR FOR BLOTTER SYSTEM
-- ==========================================
-- This script generates hundreds of realistic test data entries
-- Run this AFTER `user.sql` (so Admin exists)

-- Enable pgcrypto for password hashing if not already enabled
create extension if not exists "pgcrypto";

DO $$
DECLARE
    user_ids UUID[];
    staff_ids UUID[];
    case_id UUID;
    party_id UUID;
    guest_link_id UUID;
    i INT;
    j INT;
    random_user UUID;
    random_staff UUID;
    random_date TIMESTAMP;
    random_status TEXT;
    random_type TEXT;
    random_resolution JSONB;
BEGIN
    -- ==========================================
    -- 0. CRITICAL: ENSURE STAFF USERS EXIST
    -- ==========================================
    -- We want a mix of Admin (from user.sql) and Staff users.
    -- Let's create 5 dummy staff users if they don't exist.
    
    FOR i IN 1..5 LOOP
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'staff' || i || '@barangay.gov.ph') THEN
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, 
                email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
                created_at, updated_at
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                gen_random_uuid(),
                'authenticated',
                'authenticated',
                'staff' || i || '@barangay.gov.ph',
                crypt('staff123', gen_salt('bf')), -- Password: staff123
                now(),
                '{"provider": "email", "providers": ["email"]}',
                jsonb_build_object('full_name', 'Staff Member ' || i, 'role', 'staff'),
                now(),
                now()
            );
        END IF;
    END LOOP;

    -- Refresh user_ids array with ALL users (Admin + Staff)
    SELECT ARRAY_AGG(id) INTO user_ids FROM profiles;
    
    -- Get just staff IDs for specific staff actions
    SELECT ARRAY_AGG(id) INTO staff_ids FROM profiles WHERE role = 'staff';

    IF user_ids IS NULL OR array_length(user_ids, 1) = 0 THEN
        RAISE EXCEPTION 'No users found. Something went wrong with user generation.';
    END IF;

    RAISE NOTICE 'Generating seed data with % users...', array_length(user_ids, 1);

    -- ==========================================
    -- 1. GENERATE 200 CASES
    -- ==========================================
    FOR i IN 1..200 LOOP
        -- Random status
        random_status := (ARRAY['New', 'Under Investigation', 'Hearing Scheduled', 'Settled', 'Closed', 'Dismissed', 'Referred'])[1 + floor(random() * 7)];
        
        -- Random incident type
        random_type := (ARRAY['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other'])[1 + floor(random() * 7)];
        
        -- Random user (reporter/handler)
        random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
        
        -- Random date in the last 365 days
        random_date := NOW() - (random() * INTERVAL '365 days');
        
        -- Generate Resolution Details if case is resolved
        IF random_status IN ('Settled', 'Closed', 'Dismissed', 'Referred') THEN
            random_resolution := jsonb_build_object(
                'resolution_date', random_date + INTERVAL '5 days',
                'resolved_by', (SELECT full_name FROM profiles WHERE id = random_user),
                'terms', CASE random_status
                    WHEN 'Settled' THEN 'Both parties agreed to monetary compensation of P5,000 and public apology.'
                    WHEN 'Dismissed' THEN 'Complaint withdrawn by the complainant.'
                    WHEN 'Referred' THEN 'Case referred to PNP for criminal filing.'
                    ELSE 'Case closed after successful mediation.'
                END,
                'notes', 'Resolution reached peacefully.'
            );
        ELSE
            random_resolution := NULL;
        END IF;

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
            resolution_details, 
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
            random_resolution, -- Insert resolution details
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
                    'Lucia Bautisa', 'Fernando Cruz', 'Elena Villanueva', 'Ramon Diaz',
                    'Teresa Martinez', 'Diego Sanchez', 'Angelica Rivera', 'Manuel Castro'
                ])[1 + floor(random() * 20)],
                (ARRAY['Complainant', 'Respondent', 'Witness'])[1 + floor(random() * 3)]::party_type,
                '09' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'),
                CASE WHEN random() > 0.5 THEN 
                    lower(substring(md5(random()::text), 1, 8)) || '@gmail.com'
                ELSE NULL END,
                'Blk ' || (1 + floor(random() * 50)) || ' Lot ' || (1 + floor(random() * 30)) || 
                ', ' || (ARRAY['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Sitio San Jose', 'Sitio Riverside'])[1 + floor(random() * 7)]
            );
        END LOOP;

        -- ==========================================
        -- ADD 0-2 GUEST LINKS (25% chance)
        -- ==========================================
        guest_link_id := NULL; -- Reset for this case
        
        IF random() > 0.75 THEN
            FOR j IN 1..1 LOOP -- Generate 1 link for simplicity usually
                random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
                INSERT INTO guest_links (
                    case_id,
                    token,
                    pin,
                    created_by,
                    expires_at,
                    is_active,
                    recipient_name,  -- NEW: Populate recipient fields
                    recipient_email,
                    recipient_phone,
                    created_at
                ) VALUES (
                    case_id,
                    substring(md5(random()::text || clock_timestamp()::text), 1, 32),
                    LPAD(floor(random() * 10000)::TEXT, 4, '0'),
                    random_user,
                    random_date + INTERVAL '30 days',
                    random() > 0.3, -- Active status
                    (ARRAY['Juan Dela Cruz', 'Maria Santos', 'Jose Rizal'])[1 + floor(random() * 3)],
                    'guest' || floor(random() * 100) || '@gmail.com',
                    '09' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'),
                    random_date + INTERVAL '1 day'
                ) RETURNING id INTO guest_link_id; -- Capture ID for potential evidence linkage
            END LOOP;
        END IF;

        -- ==========================================
        -- ADD 0-3 EVIDENCE FILES
        -- ==========================================
        FOR j IN 1..floor(random() * 4) LOOP
            random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
            
            -- Decide if this evidence is from a guest (if link exists, small chance)
            -- If guest_link_id is set and random < 0.3, link it.
            
            INSERT INTO evidence (
                case_id,
                file_path,
                file_name,
                file_type,
                description,
                uploaded_by,
                guest_link_id, -- NEW: Link to guest link if applicable
                is_visible_to_others, -- NEW: Explicit visibility
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
                    'Supporting documentation'
                ])[1 + floor(random() * 6)],
                CASE WHEN (guest_link_id IS NOT NULL AND random() < 0.3) THEN NULL ELSE random_user END, -- Guest uploads have null uploaded_by
                CASE WHEN (guest_link_id IS NOT NULL AND random() < 0.3) THEN guest_link_id ELSE NULL END,
                (random() > 0.1), -- 90% visible
                random_date + (j * INTERVAL '2 days')
            );
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
                    'Mediation session completed. Progress made.'
                ])[1 + floor(random() * 5)],
                random_user,
                random_date + (j * INTERVAL '3 days')
            );
        END LOOP;

        -- ==========================================
        -- ADD 0-2 HEARINGS (for cases with Hearing Scheduled or resolved)
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
                    'Routine hearing session.',
                    random_date + INTERVAL '5 days'
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

    END LOOP;

    -- ==========================================
    -- 2. GENERATE NOTIFICATIONS
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
            'New Notification',
            'You have a new update required on one of your cases.',
            '/dashboard/cases',
            random() > 0.4,
            random_date
        );
    END LOOP;

    -- ==========================================
    -- 3. GENERATE SITE VISITS (Analytics)
    -- ==========================================
    RAISE NOTICE 'Generating site visits data...';
    FOR i IN 1..500 LOOP
        random_date := NOW() - (random() * INTERVAL '30 days'); -- Last 30 days
        INSERT INTO site_visits (
            ip_address,
            user_agent,
            page_path,
            referrer,
            country,
            city,
            device_type,
            browser,
            os,
            visit_type,
            session_id,
            user_id,
            visitor_email,
            visitor_role,
            visited_at
        ) VALUES (
            '192.168.1.' || floor(random() * 255),
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
            (ARRAY['/dashboard', '/dashboard/cases', '/dashboard/calendar', '/dashboard/reports', '/login'])[1 + floor(random() * 5)],
            (ARRAY['direct', 'google.com', 'facebook.com'])[1 + floor(random() * 3)],
            'Philippines',
            (ARRAY['Manila', 'Quezon City', 'Makati', 'Cebu'])[1 + floor(random() * 4)],
            (ARRAY['desktop', 'mobile', 'tablet'])[1 + floor(random() * 3)],
            (ARRAY['Chrome', 'Firefox', 'Safari', 'Edge'])[1 + floor(random() * 4)],
            (ARRAY['Windows', 'MacOS', 'iOS', 'Android'])[1 + floor(random() * 4)],
            (ARRAY['page_view', 'session', 'unique_daily'])[1 + floor(random() * 3)],
            md5(random()::text),
            (ARRAY[NULL, user_ids[1 + floor(random() * array_length(user_ids, 1))]])[1 + floor(random() * 2)], -- 50% chance logged in
            NULL,
            'anonymous',
            random_date
        );
    END LOOP;

    RAISE NOTICE 'Seed data generation complete!';
    RAISE NOTICE '- Verified/Created Staff users';
    RAISE NOTICE '- 200 cases created with resolution details';
    RAISE NOTICE '- Included guest links with recipient info';
    RAISE NOTICE '- Evidence linked to guest uploads';
    RAISE NOTICE '- 500 site visit records for analytics';

END $$;
