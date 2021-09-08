CREATE TABLE identities (
  identity_id INT AUTO_INCREMENT NOT NULL,
  identity VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT identity UNIQUE (identity),
  PRIMARY KEY (identity_id)
);
CREATE TABLE privileges (
  privilege_id INT AUTO_INCREMENT NOT NULL,
  privilege VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT privilege UNIQUE (privilege),
  PRIMARY KEY (privilege_id)
);
CREATE TABLE feelings (
  feeling_id INT AUTO_INCREMENT NOT NULL,
  feeling VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT feeling UNIQUE (feeling),
  PRIMARY KEY (feeling_id)
);
CREATE TABLE occupations (
  occupation_id INT AUTO_INCREMENT NOT NULL,
  occupation VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT occupation UNIQUE (occupation),
  PRIMARY KEY (occupation_id)
);
CREATE TABLE industries (
  industry_id INT AUTO_INCREMENT NOT NULL,
  industry VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT industry UNIQUE (industry),
  PRIMARY KEY (industry_id)
);
CREATE TABLE workplaces (
  workplace_id INT AUTO_INCREMENT NOT NULL,
  workplace_name VARCHAR(255) NOT NULL,
  workplace_abbreviation VARCHAR(64),
  has_locations TINYINT(1) NOT NULL,
  industry_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT workplace_name UNIQUE (workplace_name),
  CONSTRAINT workplace_abbreviation UNIQUE (workplace_abbreviation),
  PRIMARY KEY (workplace_id)
);

ALTER TABLE workplaces 
  ADD FOREIGN KEY (industry_id) REFERENCES industries(industry_id);

CREATE TABLE locations (
  location_id INT AUTO_INCREMENT NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_coordinates POINT SRID 4326 NOT NULL,
  workplace_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (location_id)
);
ALTER TABLE locations
  ADD FOREIGN KEY (workplace_id) REFERENCES workplaces(workplace_id);

CREATE TABLE workplace_email_address_domains (
  workplace_email_address_domain_id INT AUTO_INCREMENT NOT NULL,
  domain_name VARCHAR(255) NOT NULL,
  workplace_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT domain_name UNIQUE (domain_name),
  PRIMARY KEY (workplace_email_address_domain_id)
);
ALTER TABLE workplace_email_address_domains 
  ADD FOREIGN KEY (workplace_id) REFERENCES workplaces(workplace_id);

CREATE TABLE users (
  user_id VARCHAR(255) NOT NULL,
  occupation_id INT NOT NULL,
  username VARCHAR(32) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  local_email_address VARCHAR(64) NOT NULL,
  workplace_email_address_domain_id INT NOT NULL,
  privilege_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT email_address UNIQUE (local_email_address, workplace_email_address_domain_id),
  CONSTRAINT username UNIQUE (username),
  PRIMARY KEY (user_id)
);
ALTER TABLE users
  ADD FOREIGN KEY (occupation_id) REFERENCES occupations(occupation_id),
  ADD FOREIGN KEY (privilege_id) REFERENCES privileges(privilege_id),
  ADD FOREIGN KEY (workplace_email_address_domain_id) REFERENCES workplace_email_address_domains(workplace_email_address_domain_id);

CREATE TABLE reports (
  report_id VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  privacy TINYINT(1) NOT NULL,
  workplace_id INT NOT NULL,
  location_id INT DEFAULT (-1),
  feeling_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (report_id)
);

ALTER TABLE reports
  ADD FOREIGN KEY (workplace_id) REFERENCES workplaces(workplace_id),
  ADD FOREIGN KEY (feeling_id) REFERENCES feelings(feeling_id),
  ADD FOREIGN KEY (username) REFERENCES users(username);

CREATE TABLE reports_identities (
  report_id VARCHAR(255),
  identity_id INT
);

ALTER TABLE reports_identities 
  ADD FOREIGN KEY (report_id) REFERENCES reports(report_id);
ALTER TABLE reports_identities
  ADD FOREIGN KEY (identity_id) REFERENCES identities(identity_id);

CREATE TABLE confirmation_tokens (
  confirmation_token VARCHAR(255),
  user_id VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (confirmation_token)
);

ALTER TABLE confirmation_tokens
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

-- must join the users local email address and workplace address domain = full_email
-- then where full_email NOT LIKE '%_@__%.__%'
-- created_at TIMESTAMP NOT NULL DEFAULT NOW() NOT NULL,
-- updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now() NOT NULL,










-- must join the users local email address and workplace address domain = full_email
-- then where full_email NOT LIKE '%_@__%.__%'
-- created_at TIMESTAMP NOT NULL DEFAULT NOW() NOT NULL,
-- updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now() NOT NULL,


-- // rollbackSave: function() {},
-- // save: function(report) {
-- //   const rawReport = reportMap.toPersistence(report);

-- //   try {
-- //   } catch (error) {
-- //     rollbackSave(report);
-- //   }
-- // },

-- // export function getAllReports() {
-- //   const getAllReportsQuery = `SELECT
-- //   CAST(ROW_NUMBER () OVER (ORDER BY reports.id) AS INT) AS id,
-- //   array_agg(identities.identity) as identities,
-- //   description,
-- //   feelings.feeling,
-- //   locations.name,
-- //   ST_X(locations.location) as longitude,
-- //   ST_Y(locations.location) as latitude FROM reports
-- //   INNER JOIN identities_to_reports_mapping ON reports.id = identities_to_reports_mapping.report_id
-- //   INNER JOIN identities ON identities_to_reports_mapping.identity_id = identities.id
-- //   INNER JOIN feelings_to_reports_mapping ON reports.id = feelings_to_reports_mapping.report_id
-- //   INNER JOIN feelings ON feelings_to_reports_mapping.feeling_id = feelings.id
-- //   LEFT JOIN locations ON reports.location_id = locations.id
-- //   GROUP BY reports.id, feelings.feeling, locations.name, locations.location`
-- //   return selectFromDB(getAllReportsQuery)
-- // }