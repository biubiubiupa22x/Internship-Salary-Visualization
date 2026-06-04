from __future__ import annotations

import csv
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATABASE_DIR = ROOT / "database"
CSV_PATH = ROOT / "data_clean" / "data_clean" / "shixiseng_jobs_cleaned.csv"
SKILL_FREQ_PATH = ROOT / "data_clean" / "data_clean" / "viz_skill_freq.csv"
DB_PATH = DATABASE_DIR / "jobs_dashboard.sqlite"
SCHEMA_PATH = DATABASE_DIR / "schema.sql"
VIEWS_PATH = DATABASE_DIR / "views.sql"


POSITION_RULES = [
    ("大模型", "算法与AI"),
    ("算法", "算法与AI"),
    ("人工智能", "算法与AI"),
    ("机器学习", "算法与AI"),
    ("计算机视觉", "算法与AI"),
    ("数据", "数据类"),
    ("数仓", "数据类"),
    ("后端", "开发类"),
    ("前端", "开发类"),
    ("Java", "开发类"),
    ("Python", "开发类"),
    ("C++", "开发类"),
    ("iOS", "开发类"),
    ("客户端", "开发类"),
    ("嵌入式", "开发类"),
    ("游戏", "开发类"),
    ("运维", "开发类"),
    ("测试", "测试类"),
    ("产品", "产品类"),
    ("运营", "运营类"),
    ("UI", "设计类"),
]


SKILL_KEYWORDS = {
    "Java": ["java", "Java开发"],
    "Python": ["python", "Python开发"],
    "C++": ["c++", "C++开发"],
    "iOS": ["ios", "iOS开发"],
    "前端": ["前端"],
    "后端": ["后端"],
    "算法": ["算法"],
    "机器学习": ["机器学习"],
    "大模型": ["大模型"],
    "计算机视觉": ["计算机视觉", "视觉"],
    "数据分析": ["数据分析"],
    "数据挖掘": ["数据挖掘"],
    "数仓": ["数据仓库", "数仓"],
    "测试": ["测试"],
    "产品": ["产品"],
    "运营": ["运营"],
    "运维": ["运维"],
    "UI": ["UI", "ui"],
    "游戏": ["游戏"],
    "嵌入式": ["嵌入式"],
}


def to_float(value: str | None) -> float | None:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def to_bool_int(value: str | None) -> int:
    return 1 if str(value).strip().lower() in {"true", "1", "yes"} else 0


def normalize_position_type(keyword: str, title: str) -> tuple[str, str]:
    text = f"{keyword or ''} {title or ''}"
    for token, parent in POSITION_RULES:
        if token.lower() in text.lower():
            return token, parent
    return keyword or "其他", "其他"


def get_id(conn: sqlite3.Connection, table: str, id_col: str, value_col: str, value: str, extra: dict | None = None) -> int:
    value = value or "未知"
    row = conn.execute(
        f"SELECT {id_col} FROM {table} WHERE {value_col} = ?",
        (value,),
    ).fetchone()
    if row:
        return int(row[0])

    columns = [value_col]
    values = [value]
    if extra:
        columns.extend(extra.keys())
        values.extend(extra.values())
    placeholders = ", ".join("?" for _ in columns)
    conn.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
        values,
    )
    return int(conn.execute("SELECT last_insert_rowid()").fetchone()[0])


def load_skill_seed(conn: sqlite3.Connection) -> None:
    if not SKILL_FREQ_PATH.exists():
        return
    with SKILL_FREQ_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            skill = row.get("skill", "").strip()
            if skill:
                get_id(conn, "dim_skill", "skill_id", "skill_name", skill)


def extract_skills(text: str) -> set[str]:
    matched = set()
    lowered = text.lower()
    for skill, aliases in SKILL_KEYWORDS.items():
        if any(alias.lower() in lowered for alias in aliases):
            matched.add(skill)
    return matched


def rebuild_database() -> None:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV not found: {CSV_PATH}")

    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")

    with SCHEMA_PATH.open("r", encoding="utf-8") as file:
        conn.executescript(file.read())

    load_skill_seed(conn)

    with CSV_PATH.open("r", encoding="gb18030", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            city_name = row.get("city_clean") or row.get("city") or "未知"
            keyword = row.get("search_keyword") or "未知"
            education = row.get("education") or "未知"
            company_size = row.get("company_size") or row.get("company_size_clean") or "未知"
            industry = row.get("industry") or "未知"
            salary_tier = row.get("salary_tier") or "未知"
            position_type, parent_type = normalize_position_type(keyword, row.get("job_title", ""))

            city_id = get_id(conn, "dim_city", "city_id", "city_name", city_name)
            keyword_id = get_id(conn, "dim_search_keyword", "keyword_id", "keyword", keyword)
            position_type_id = get_id(
                conn,
                "dim_position_type",
                "position_type_id",
                "type_name",
                position_type,
                {"parent_type": parent_type},
            )
            education_id = get_id(
                conn,
                "dim_education",
                "education_id",
                "education_name",
                education,
                {"edu_score": to_float(row.get("edu_score"))},
            )
            company_size_id = get_id(conn, "dim_company_size", "company_size_id", "size_name", company_size)
            industry_id = get_id(conn, "dim_industry", "industry_id", "industry_name", industry)
            salary_tier_id = get_id(conn, "dim_salary_tier", "salary_tier_id", "tier_name", salary_tier)

            conn.execute(
                """
                INSERT OR IGNORE INTO fact_job (
                  job_title, company_name, city_raw, city_id, search_keyword_id,
                  position_type_id, salary_raw, salary_min, salary_max, salary_mid,
                  salary_valid, education_id, experience, duration, company_size_raw,
                  company_size_id, industry_id, salary_tier_id, edu_score,
                  competitiveness_score, url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    row.get("job_title") or "未知岗位",
                    row.get("company_name") or None,
                    row.get("city") or None,
                    city_id,
                    keyword_id,
                    position_type_id,
                    row.get("salary_raw") or None,
                    to_float(row.get("salary_min")),
                    to_float(row.get("salary_max")),
                    to_float(row.get("salary_mid")),
                    to_bool_int(row.get("salary_valid")),
                    education_id,
                    row.get("experience") or None,
                    row.get("duration") or None,
                    row.get("company_size") or None,
                    company_size_id,
                    industry_id,
                    salary_tier_id,
                    to_float(row.get("edu_score")),
                    to_float(row.get("competitiveness_score")),
                    row.get("url") or None,
                ),
            )

            job_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            skill_text = f"{row.get('job_title', '')} {keyword}"
            for skill in extract_skills(skill_text):
                skill_id = get_id(conn, "dim_skill", "skill_id", "skill_name", skill)
                conn.execute(
                    "INSERT OR IGNORE INTO job_skill (job_id, skill_id, source, confidence) VALUES (?, ?, ?, ?)",
                    (job_id, skill_id, "title_or_keyword_rule", 0.8),
                )

    with VIEWS_PATH.open("r", encoding="utf-8") as file:
        conn.executescript(file.read())

    conn.execute(
        """
        INSERT OR REPLACE INTO city_metrics (
          city_id, job_count, avg_salary, max_salary, avg_edu_score,
          avg_competitiveness_score, demand_score, salary_score,
          development_score, competition_score
        )
        SELECT
          city_id,
          COUNT(*) AS job_count,
          ROUND(AVG(CASE WHEN salary_valid = 1 THEN salary_mid END), 2) AS avg_salary,
          MAX(CASE WHEN salary_valid = 1 THEN salary_mid END) AS max_salary,
          ROUND(AVG(edu_score), 2) AS avg_edu_score,
          ROUND(AVG(competitiveness_score), 2) AS avg_competitiveness_score,
          ROUND(100.0 * COUNT(*) / (SELECT MAX(city_count) FROM (
            SELECT COUNT(*) AS city_count FROM fact_job GROUP BY city_id
          )), 2) AS demand_score,
          ROUND(100.0 * AVG(CASE WHEN salary_valid = 1 THEN salary_mid END) / (
            SELECT MAX(city_salary) FROM (
              SELECT AVG(salary_mid) AS city_salary FROM fact_job WHERE salary_valid = 1 GROUP BY city_id
            )
          ), 2) AS salary_score,
          ROUND((AVG(edu_score) + AVG(competitiveness_score)) * 50.0, 2) AS development_score,
          ROUND(AVG(competitiveness_score) * 100.0, 2) AS competition_score
        FROM fact_job
        GROUP BY city_id
        """
    )

    conn.commit()
    summary = conn.execute("SELECT total_jobs, total_cities, avg_salary, total_skills FROM v_dashboard_summary").fetchone()
    conn.close()

    print(f"Created: {DB_PATH}")
    print(f"Jobs: {summary[0]}, Cities: {summary[1]}, Avg salary: {summary[2]}, Skills: {summary[3]}")


if __name__ == "__main__":
    rebuild_database()
