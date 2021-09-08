-- manually identified workplace id and industry
INSERT INTO workplaces (workplace_name, workplace_abbreviation, has_locations, industry_id)
	VALUES ('University of California, Santa Cruz', 'UC Santa Cruz', 1, 1),
	('University of California, Los Angeles', 'UCLA', 0, 1),
	('Google', 'Google', 0, 4);
INSERT INTO workplace_email_address_domains (domain_name, workplace_id) VALUES ('ucsc.edu', 1);
INSERT INTO locations (location_name, location_coordinates, workplace_id) 
  VALUES ("Kresge Town Hall", (ST_GeomFromText('POINT(36.998882 -122.066376)', 4326)), 1),
  ("Engineering 2", (ST_GeomFromText('POINT(37.001148 -122.063263)', 4326)), 1);
-- create a google workplace email
INSERT INTO workplace_email_address_domains (domain_name, workplace_id) VALUES ('gmail.com', 3);
-- create a 'google' user
INSERT INTO users (user_id, occupation_id, username, password, local_email_address, workplace_email_address_domain_id, privilege_id)
	VALUES ('991fd4cb-881a-444d-915b-7e92155801ed', 3, 'qwe', 'qwe', 'krfong', 2, 2);
	-- create a ucsc user
INSERT INTO users (user_id, occupation_id, username, password, local_email_address, workplace_email_address_domain_id, privilege_id)
	VALUES ('17bac180-dc4f-4522-a479-ed8611a83491', 1, 'test', 'test', 'krfong', 1, 2);
-- create a ucsc report, private
-- create a google report, public
INSERT INTO reports (report_id, description, privacy, workplace_id, feeling_id, username)
	VALUES ('44eb70e1-26cb-42e0-9a21-dc3f95baf8f5', 'from test', 0, 1, 1, 'test'),
	('dcdc99ea-f313-4edf-8767-3f7acab30c4f', 'from qwe', 1, 3, 3, 'qwe');
INSERT INTO reports (report_id, description, privacy, workplace_id, feeling_id, username)
	VALUES ('57bf6e26-9d56-4d17-9363-5088eefc8200', 'second from test', 0, 1, 3, 'test'),
