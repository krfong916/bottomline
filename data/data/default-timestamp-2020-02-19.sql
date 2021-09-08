ALTER TABLE identities 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE privileges 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE feelings 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE occupations 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE industries 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE workplaces 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE locations 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE workplace_email_address_domains 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE users 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE reports 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;
ALTER TABLE reports_identities 
  ALTER COLUMN 
  created_at created_at timestamp NOT NULL;
  updated_at timestamp NOT NULL;