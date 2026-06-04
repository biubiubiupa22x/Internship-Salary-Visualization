# 数据库设计说明

这个目录用于承接 `data_clean/data_clean` 中的清洗数据，并为 `final_web` 前端提供真实数据来源。

## 文件

- `schema.sql`: 数据库表结构，默认按 SQLite 编写。
- `views.sql`: 面向前端图表的聚合视图。

## 设计思路

数据库采用「岗位明细事实表 + 维度表 + 技能关系表 + 城市指标表 + 聚合视图」。

核心表：

- `fact_job`: 每一条实习僧岗位记录。
- `dim_city`: 城市维度。
- `dim_search_keyword`: 搜索关键词维度。
- `dim_position_type`: 岗位类型维度，后续可由 `search_keyword` 或 `job_title` 映射得到。
- `dim_education`: 学历维度。
- `dim_company_size`: 公司规模维度。
- `dim_industry`: 行业维度。
- `dim_salary_tier`: 薪资档位维度。
- `dim_skill`: 技能维度。
- `job_skill`: 岗位与技能的多对多关系，用于技能频次、共现热力图、技能网络图。
- `city_metrics`: 城市综合画像指标，用于雷达图和结论页。

## 与前端图表的对应关系

| 前端展示 | 推荐数据源 |
| --- | --- |
| 首页统计卡 | `v_dashboard_summary` |
| 城市岗位数量排名 | `v_city_job_counts` |
| 城市薪资对比 | `v_city_salary_stats` |
| 薪资档位占比 | `v_salary_tier_distribution` |
| 学历分布 | `v_education_distribution` |
| 学历与薪资 | `v_education_salary` |
| 经验分布 | `v_experience_distribution` |
| 公司规模与薪资 | `v_company_size_salary` |
| 行业平均薪资 | `v_industry_salary` |
| 岗位类型分布 | `v_position_type_distribution` |
| 岗位类型薪资 | `v_position_type_salary` |
| 城市 x 岗位类型热力图 | `v_city_position_heatmap` |
| 城市 x 薪资档位热力图 | `v_city_salary_tier_heatmap` |
| 技能频次/词云 | `v_skill_frequency` |
| 技能共现热力图/网络图 | `v_skill_cooccurrence` |
| 竞争力评分与薪资散点图 | `v_competitiveness_salary_scatter` |
| 城市综合画像雷达图 | `city_metrics` |

## 注意事项

当前前端数据多数仍是硬编码。后续接入数据库时，建议先新增 API 路由读取这些视图，再逐个替换图表组件中的模拟数据。

另外，当前清洗数据里的 `company_size_clean` 可能存在异常，例如原始公司规模与清洗后规模不一致；正式入库前建议重新核对公司规模清洗规则。
