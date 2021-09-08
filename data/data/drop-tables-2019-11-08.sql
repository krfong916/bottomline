DROP TABLE reports_identities;
DROP TABLE reports;
DROP TABLE feelings;
DROP TABLE locations;
DROP TABLE identities;
DROP TABLE users;
DROP TABLE workplace_email_address_domains;
DROP TABLE workplaces;
DROP TABLE occupations;
DROP TABLE privileges;
DROP TABLE industries;


ALTER TABLE reports DROP FOREIGN KEY workplace_id;
ALTER TABLE reports DROP FOREIGN KEY location_id;
ALTER TABLE reports DROP FOREIGN KEY feeling_id;
ALTER TABLE reports DROP FOREIGN KEY username;
ALTER TABLE users DROP FOREIGN KEY occupation_id;
ALTER TABLE users DROP FOREIGN KEY privilege_id;
ALTER TABLE users DROP FOREIGN KEY workplace_email_address_domain_id;
ALTER TABLE workplaces DROP FOREIGN KEY industry_id;
ALTER TABLE locations DROP FOREIGN KEY workplace_id;
ALTER TABLE workplace_email_address_domains DROP FOREIGN KEY workplace_id;
ALTER TABLE reports_identities DROP FOREIGN KEY private_report_id;
ALTER TABLE reports_identities DROP FOREIGN KEY identity_id;