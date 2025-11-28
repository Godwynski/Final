-- Replace 'your-email@example.com' with the email of the user you want to promote
update profiles
set role = 'admin'
where email = 'your-email@example.com';
