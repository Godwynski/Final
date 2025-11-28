-- Add case_id to audit_logs
do $$ begin
    if not exists (select 1 from information_schema.columns where table_name = 'audit_logs' and column_name = 'case_id') then
        alter table audit_logs add column case_id uuid references cases(id) on delete set null;
    end if;
end $$;
