-- Create Incident Type Enum
do $$ begin
    if not exists (select 1 from pg_type where typname = 'incident_type') then
        create type incident_type as enum (
            'Theft', 
            'Harassment', 
            'Vandalism', 
            'Physical Injury', 
            'Property Damage', 
            'Public Disturbance', 
            'Other'
        );
    end if;
end $$;

-- Add columns to cases table
do $$ begin
    -- Add incident_type
    if not exists (select 1 from information_schema.columns where table_name = 'cases' and column_name = 'incident_type') then
        alter table cases add column incident_type incident_type default 'Other';
    end if;

    -- Add narrative_facts
    if not exists (select 1 from information_schema.columns where table_name = 'cases' and column_name = 'narrative_facts') then
        alter table cases add column narrative_facts text;
    end if;

    -- Add narrative_action
    if not exists (select 1 from information_schema.columns where table_name = 'cases' and column_name = 'narrative_action') then
        alter table cases add column narrative_action text;
    end if;
end $$;
