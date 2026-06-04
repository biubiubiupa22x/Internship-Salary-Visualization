-- Aggregation views used by the current frontend dashboard.

CREATE VIEW IF NOT EXISTS v_dashboard_summary AS
SELECT
  COUNT(*) AS total_jobs,
  COUNT(DISTINCT city_id) AS total_cities,
  ROUND(AVG(CASE WHEN salary_valid = 1 THEN salary_mid END), 2) AS avg_salary,
  (SELECT COUNT(*) FROM dim_skill) AS total_skills
FROM fact_job;

CREATE VIEW IF NOT EXISTS v_city_job_counts AS
SELECT
  c.city_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_city AS c ON j.city_id = c.city_id
GROUP BY c.city_id, c.city_name;

CREATE VIEW IF NOT EXISTS v_city_salary_stats AS
SELECT
  c.city_name,
  COUNT(*) AS job_count,
  ROUND(AVG(j.salary_mid), 2) AS avg_salary,
  MAX(j.salary_mid) AS max_salary,
  ROUND(AVG(j.edu_score), 2) AS avg_edu_score
FROM fact_job AS j
JOIN dim_city AS c ON j.city_id = c.city_id
WHERE j.salary_valid = 1
GROUP BY c.city_id, c.city_name;

CREATE VIEW IF NOT EXISTS v_salary_tier_distribution AS
SELECT
  s.tier_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_salary_tier AS s ON j.salary_tier_id = s.salary_tier_id
GROUP BY s.salary_tier_id, s.tier_name;

CREATE VIEW IF NOT EXISTS v_education_distribution AS
SELECT
  e.education_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_education AS e ON j.education_id = e.education_id
GROUP BY e.education_id, e.education_name;

CREATE VIEW IF NOT EXISTS v_experience_distribution AS
SELECT
  experience,
  COUNT(*) AS job_count
FROM fact_job
GROUP BY experience;

CREATE VIEW IF NOT EXISTS v_education_salary AS
SELECT
  e.education_name,
  COUNT(*) AS job_count,
  ROUND(AVG(j.salary_mid), 2) AS avg_salary
FROM fact_job AS j
JOIN dim_education AS e ON j.education_id = e.education_id
WHERE j.salary_valid = 1
GROUP BY e.education_id, e.education_name;

CREATE VIEW IF NOT EXISTS v_company_size_salary AS
SELECT
  cs.size_name,
  COUNT(*) AS job_count,
  ROUND(AVG(j.salary_mid), 2) AS avg_salary
FROM fact_job AS j
JOIN dim_company_size AS cs ON j.company_size_id = cs.company_size_id
WHERE j.salary_valid = 1
GROUP BY cs.company_size_id, cs.size_name;

CREATE VIEW IF NOT EXISTS v_industry_salary AS
SELECT
  i.industry_name,
  COUNT(*) AS job_count,
  ROUND(AVG(j.salary_mid), 2) AS avg_salary
FROM fact_job AS j
JOIN dim_industry AS i ON j.industry_id = i.industry_id
WHERE j.salary_valid = 1
GROUP BY i.industry_id, i.industry_name;

CREATE VIEW IF NOT EXISTS v_position_type_distribution AS
SELECT
  p.type_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_position_type AS p ON j.position_type_id = p.position_type_id
GROUP BY p.position_type_id, p.type_name;

CREATE VIEW IF NOT EXISTS v_position_type_salary AS
SELECT
  p.type_name,
  COUNT(*) AS job_count,
  ROUND(AVG(j.salary_mid), 2) AS avg_salary,
  ROUND(AVG(j.edu_score), 2) AS avg_edu_score
FROM fact_job AS j
JOIN dim_position_type AS p ON j.position_type_id = p.position_type_id
WHERE j.salary_valid = 1
GROUP BY p.position_type_id, p.type_name;

CREATE VIEW IF NOT EXISTS v_city_position_heatmap AS
SELECT
  c.city_name,
  p.type_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_city AS c ON j.city_id = c.city_id
JOIN dim_position_type AS p ON j.position_type_id = p.position_type_id
GROUP BY c.city_id, c.city_name, p.position_type_id, p.type_name;

CREATE VIEW IF NOT EXISTS v_city_salary_tier_heatmap AS
SELECT
  c.city_name,
  s.tier_name,
  COUNT(*) AS job_count
FROM fact_job AS j
JOIN dim_city AS c ON j.city_id = c.city_id
JOIN dim_salary_tier AS s ON j.salary_tier_id = s.salary_tier_id
GROUP BY c.city_id, c.city_name, s.salary_tier_id, s.tier_name;

CREATE VIEW IF NOT EXISTS v_skill_frequency AS
SELECT
  s.skill_name,
  COUNT(*) AS skill_count
FROM job_skill AS js
JOIN dim_skill AS s ON js.skill_id = s.skill_id
GROUP BY s.skill_id, s.skill_name;

CREATE VIEW IF NOT EXISTS v_skill_cooccurrence AS
SELECT
  s1.skill_name AS source_skill,
  s2.skill_name AS target_skill,
  COUNT(*) AS cooccurrence_count
FROM job_skill AS js1
JOIN job_skill AS js2
  ON js1.job_id = js2.job_id
 AND js1.skill_id < js2.skill_id
JOIN dim_skill AS s1 ON js1.skill_id = s1.skill_id
JOIN dim_skill AS s2 ON js2.skill_id = s2.skill_id
GROUP BY s1.skill_id, s1.skill_name, s2.skill_id, s2.skill_name;

CREATE VIEW IF NOT EXISTS v_competitiveness_salary_scatter AS
SELECT
  job_id,
  salary_mid,
  competitiveness_score,
  edu_score
FROM fact_job
WHERE salary_valid = 1
  AND salary_mid IS NOT NULL
  AND competitiveness_score IS NOT NULL;
