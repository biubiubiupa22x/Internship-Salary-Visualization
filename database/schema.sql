-- Database schema for the internship job visualization project.
-- Target: SQLite by default. The structure also maps cleanly to PostgreSQL/MySQL
-- with minor syntax changes.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS dim_city (
  city_id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_name TEXT NOT NULL UNIQUE,
  province TEXT,
  region TEXT,
  longitude REAL,
  latitude REAL
);

CREATE TABLE IF NOT EXISTS dim_search_keyword (
  keyword_id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL UNIQUE,
  category TEXT
);

CREATE TABLE IF NOT EXISTS dim_position_type (
  position_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_name TEXT NOT NULL UNIQUE,
  parent_type TEXT
);

CREATE TABLE IF NOT EXISTS dim_education (
  education_id INTEGER PRIMARY KEY AUTOINCREMENT,
  education_name TEXT NOT NULL UNIQUE,
  edu_score REAL
);

CREATE TABLE IF NOT EXISTS dim_company_size (
  company_size_id INTEGER PRIMARY KEY AUTOINCREMENT,
  size_name TEXT NOT NULL UNIQUE,
  size_min INTEGER,
  size_max INTEGER,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS dim_industry (
  industry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  industry_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_salary_tier (
  salary_tier_id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_name TEXT NOT NULL UNIQUE,
  min_salary REAL,
  max_salary REAL,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS dim_skill (
  skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_name TEXT NOT NULL UNIQUE,
  skill_category TEXT
);

CREATE TABLE IF NOT EXISTS fact_job (
  job_id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_title TEXT NOT NULL,
  company_name TEXT,
  city_raw TEXT,
  city_id INTEGER,
  search_keyword_id INTEGER,
  position_type_id INTEGER,
  salary_raw TEXT,
  salary_min REAL,
  salary_max REAL,
  salary_mid REAL,
  salary_valid INTEGER,
  education_id INTEGER,
  experience TEXT,
  duration TEXT,
  company_size_raw TEXT,
  company_size_id INTEGER,
  industry_id INTEGER,
  salary_tier_id INTEGER,
  edu_score REAL,
  competitiveness_score REAL,
  url TEXT UNIQUE,
  source_file TEXT DEFAULT 'shixiseng_jobs_cleaned.csv',

  FOREIGN KEY (city_id) REFERENCES dim_city(city_id),
  FOREIGN KEY (search_keyword_id) REFERENCES dim_search_keyword(keyword_id),
  FOREIGN KEY (position_type_id) REFERENCES dim_position_type(position_type_id),
  FOREIGN KEY (education_id) REFERENCES dim_education(education_id),
  FOREIGN KEY (company_size_id) REFERENCES dim_company_size(company_size_id),
  FOREIGN KEY (industry_id) REFERENCES dim_industry(industry_id),
  FOREIGN KEY (salary_tier_id) REFERENCES dim_salary_tier(salary_tier_id)
);

CREATE TABLE IF NOT EXISTS job_skill (
  job_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  source TEXT,
  confidence REAL,
  PRIMARY KEY (job_id, skill_id),
  FOREIGN KEY (job_id) REFERENCES fact_job(job_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES dim_skill(skill_id)
);

CREATE TABLE IF NOT EXISTS city_metrics (
  city_id INTEGER PRIMARY KEY,
  job_count INTEGER,
  avg_salary REAL,
  max_salary REAL,
  avg_edu_score REAL,
  avg_competitiveness_score REAL,
  skill_diversity_score REAL,
  demand_score REAL,
  salary_score REAL,
  development_score REAL,
  competition_score REAL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES dim_city(city_id)
);

CREATE INDEX IF NOT EXISTS idx_fact_job_city ON fact_job(city_id);
CREATE INDEX IF NOT EXISTS idx_fact_job_keyword ON fact_job(search_keyword_id);
CREATE INDEX IF NOT EXISTS idx_fact_job_position_type ON fact_job(position_type_id);
CREATE INDEX IF NOT EXISTS idx_fact_job_industry ON fact_job(industry_id);
CREATE INDEX IF NOT EXISTS idx_fact_job_salary_mid ON fact_job(salary_mid);
CREATE INDEX IF NOT EXISTS idx_fact_job_education ON fact_job(education_id);
CREATE INDEX IF NOT EXISTS idx_fact_job_company_size ON fact_job(company_size_id);
CREATE INDEX IF NOT EXISTS idx_job_skill_skill ON job_skill(skill_id);
