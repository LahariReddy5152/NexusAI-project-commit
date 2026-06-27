import { buildLesson } from "../lesson-builder.js";

export const SQL_CURRICULUM = [
  buildLesson({
    title: "SQL Fundamentals",
    description: "SELECT, filtering, sorting, and aggregating relational data",
    difficulty: "Beginner",
    duration: "25 min",
    codeLang: "sql",
    overview: "SQL (Structured Query Language) is the standard language for reading and writing data in relational databases. This lesson covers table structure, SELECT statements, WHERE filters, ORDER BY, and GROUP BY—the foundation every data and backend engineer needs.",
    theory: "Relational databases store data in tables (relations) made of rows and columns. SQL is declarative: you describe what data you want, and the database engine determines how to fetch it. The core read pattern is SELECT columns FROM table WHERE condition. Primary keys uniquely identify rows; foreign keys link tables.",
    explanation: "A SELECT query projects columns from one or more tables. WHERE filters rows before aggregation. ORDER BY sorts results. GROUP BY collapses rows sharing key values so aggregate functions (COUNT, SUM, AVG) can summarize data. Always qualify column names when joining tables to avoid ambiguity.",
    realWorldExample: "An e-commerce analytics dashboard runs daily SQL: count orders by status, sum revenue by region, and list top products. The same patterns power fraud detection (filter suspicious transactions) and inventory alerts (GROUP BY stock levels).",
    architectureDiagram: `┌──────────────┐     SQL Query      ┌─────────────────┐
│   Client /   │ ─────────────────► │  Query Parser   │
│   Application│                    │  & Optimizer    │
└──────────────┘                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
             ┌────────────┐          ┌────────────┐          ┌────────────┐
             │   users    │          │   orders   │          │  products  │
             │  (table)   │          │  (table)   │          │  (table)   │
             └────────────┘          └────────────┘          └────────────┘`,
    flowDiagram: `Parse SQL → Validate schema → Build execution plan → Scan/index tables → Filter (WHERE) → Aggregate (GROUP BY) → Sort (ORDER BY) → Return result set`,
    objectives: [
      "Write SELECT queries with column lists and aliases",
      "Filter rows with WHERE and comparison operators",
      "Sort with ORDER BY and limit results",
      "Aggregate data with GROUP BY and HAVING"
    ],
    syntax: `-- Basic SELECT\nSELECT id, name, email FROM users WHERE active = true;\n\n-- Aggregation\nSELECT status, COUNT(*) AS cnt\nFROM orders\nGROUP BY status\nHAVING COUNT(*) > 10\nORDER BY cnt DESC\nLIMIT 5;`,
    practicalExample: `-- Customer order summary\nSELECT u.name, COUNT(o.id) AS order_count, SUM(o.total) AS spent\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE o.created_at >= '2025-01-01'\nGROUP BY u.id, u.name\nORDER BY spent DESC;`,
    bestPractices: [
      "Select only columns you need—avoid SELECT * in production APIs",
      "Use indexes on columns in WHERE and JOIN conditions",
      "Use parameterized queries in application code to prevent SQL injection",
      "Name aggregates with aliases for readable results",
      "Test filters on large tables with EXPLAIN to verify index use"
    ],
    commonMistakes: [
      "Forgetting GROUP BY columns that appear in SELECT",
      "Using WHERE to filter aggregates instead of HAVING",
      "Implicit type coercion in comparisons (string vs numeric IDs)",
      "Unbounded SELECT * on large tables causing memory pressure"
    ],
    exercise: "Write a query returning each product category, the number of products, and average price. Filter to categories with more than 3 products. Sort by average price descending.",
    assignment: "Given tables `employees(id, dept_id, salary)` and `departments(id, name)`, write three queries: (1) all employees in Engineering, (2) average salary per department, (3) departments where average salary exceeds company average.",
    miniProject: "Design a mini reporting schema (users, orders, order_items) with 5 seed rows each. Write 4 analytical queries: daily revenue, top customer, products never ordered, and month-over-month growth.",
    quizQuestions: [
      { question: "Which clause filters rows before grouping?", options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"], correct: 1 },
      { question: "What does COUNT(*) return?", options: ["Sum of values", "Number of rows", "Unique values only", "Average"], correct: 1 },
      { question: "HAVING is used to filter:", options: ["Rows before GROUP BY", "Groups after aggregation", "Column names", "Indexes"], correct: 1 },
      { question: "Primary keys must be:", options: ["Nullable", "Unique per row", "Always strings", "Shared across tables"], correct: 1 },
      { question: "ORDER BY DESC sorts:", options: ["Ascending", "Descending", "Randomly", "By primary key only"], correct: 1 }
    ],
    interviewQuestions: [
      "Explain the difference between WHERE and HAVING with an example.",
      "When would you use a composite index vs separate single-column indexes?",
      "How does NULL behave in SQL comparisons and aggregations?"
    ],
    summary: "SQL fundamentals center on SELECT, filtering, sorting, and grouping. Master these before joins and subqueries. Always consider indexes and avoid selecting unnecessary columns in production.",
    resources: ["PostgreSQL SELECT documentation", "Use The Index, Luke (indexing guide)", "SQLBolt interactive tutorials"]
  }),

  buildLesson({
    title: "Joins",
    description: "Combine rows from multiple tables with INNER, LEFT, RIGHT, and FULL joins",
    difficulty: "Beginner",
    duration: "30 min",
    codeLang: "sql",
    overview: "Joins connect related rows across tables using key relationships. Understanding join types is essential for reporting, APIs, and data modeling—especially INNER vs OUTER joins and when rows are excluded.",
    theory: "A join matches rows from two tables on a predicate (usually equality of foreign key to primary key). INNER JOIN returns only matching pairs. LEFT JOIN keeps all rows from the left table and fills NULLs when no match exists on the right. RIGHT JOIN is the mirror. FULL OUTER JOIN keeps unmatched rows from both sides.",
    explanation: "Inner joins answer 'which orders have customers?' Left joins answer 'which customers have zero orders?' Right join mirrors left (all right rows preserved). Full outer keeps orphans on both sides. Join order and table size affect performance—filter early when possible. Always specify join conditions explicitly; accidental cross joins (missing ON) multiply rows catastrophically.\n\nPerformance tips: index foreign keys on both sides of frequent joins; reduce row sets with WHERE before joining large tables; prefer hash joins on equality predicates at scale (planner choice); use EXPLAIN ANALYZE to detect nested loops on millions of rows; avoid selecting unused columns from wide joined tables.",
    realWorldExample: "A support dashboard LEFT JOINs customers to tickets to show accounts with open issues AND customers who never filed a ticket (for outreach). INNER JOINs power order detail pages joining orders, line items, and products.",
    architectureDiagram: `     users                    orders
┌─────────────┐            ┌─────────────┐
│ id (PK)     │◄───────────│ user_id(FK) │
│ name        │   1 : N    │ id (PK)     │
└─────────────┘            │ total       │
       │                   └─────────────┘
       │    INNER: only users WITH orders
       │    LEFT:  all users, NULL order cols if none
       └────► JOIN ON users.id = orders.user_id`,
    flowDiagram: `Choose join type → Define ON predicate → (Optional) pre-filter tables → Nested-loop / hash / merge join → Project columns → Return combined rows`,
    objectives: [
      "Write INNER JOIN for matched rows only",
      "Use LEFT JOIN to include unmatched left-table rows",
      "Compare RIGHT and FULL OUTER join semantics",
      "Avoid accidental Cartesian products"
    ],
    syntax: `-- INNER JOIN (matched rows only)\nSELECT u.name, o.id AS order_id\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id;\n\n-- LEFT JOIN (all left rows)\nSELECT u.name, o.id\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;\n\n-- RIGHT JOIN (all right rows)\nSELECT u.name, o.id\nFROM users u\nRIGHT JOIN orders o ON o.user_id = u.id;\n\n-- FULL OUTER JOIN (unmatched from both)\nSELECT u.name, o.id\nFROM users u\nFULL OUTER JOIN orders o ON o.user_id = u.id;`,
    practicalExample: `-- RIGHT JOIN: orders without matching users (data quality check)\nSELECT o.id, o.total, u.name\nFROM users u\nRIGHT JOIN orders o ON o.user_id = u.id\nWHERE u.id IS NULL;\n\n-- Products with optional review stats (LEFT)\nSELECT p.name, AVG(r.rating) AS avg_rating\nFROM products p\nLEFT JOIN reviews r ON r.product_id = p.id\nGROUP BY p.id, p.name;`,
    bestPractices: [
      "Filter in WHERE after join, or in subqueries, to reduce join size",
      "Index foreign key columns used in join predicates",
      "Use table aliases for readability",
      "Prefer LEFT JOIN over RIGHT JOIN for consistent readability",
      "Validate row counts after joins to detect fan-out from many-to-many"
    ],
    commonMistakes: [
      "Omitting ON clause and creating a cross join",
      "Using INNER JOIN when you need to preserve unmatched parent rows",
      "Joining on non-indexed columns on large tables",
      "Duplicating rows by joining along two unrelated many-to-many paths"
    ],
    exercise: "List all departments and employee count including departments with zero employees (LEFT JOIN + GROUP BY).",
    assignment: "Given `students`, `enrollments`, and `courses`, write queries for: enrolled students per course, courses with no enrollments, and students taking more than 3 courses.",
    miniProject: "Model a blog (authors, posts, comments). Write INNER query for posts with authors, LEFT query for authors without posts, and a report of comment counts per post including posts with zero comments.",
    quizQuestions: [
      { question: "INNER JOIN returns rows when:", options: ["Left table only", "Match exists in both", "Right table only", "Either table unmatched"], correct: 1 },
      { question: "LEFT JOIN preserves all rows from:", options: ["Right table", "Left table", "Both tables", "Neither"], correct: 1 },
      { question: "NULL in a LEFT JOIN unmatched column means:", options: ["Error", "No matching right row", "Zero value", "Duplicate row"], correct: 1 },
      { question: "A missing ON clause typically causes:", options: ["Empty result", "Cartesian product", "Syntax error always", "Index scan only"], correct: 1 },
      { question: "FULL OUTER JOIN is useful when:", options: ["Only matches needed", "Unmatched rows from both sides matter", "Never in production", "Replacing GROUP BY"], correct: 1 }
    ],
    interviewQuestions: [
      "Explain INNER vs LEFT JOIN with a customers/orders example.",
      "What is a fan-out in joins and how do you detect it?",
      "How would you optimize a slow join on two 10M-row tables?"
    ],
    summary: "Joins link relational data. INNER for matches, LEFT to preserve driving table rows, FULL when you need orphans on both sides. Always verify join keys and watch for row multiplication.",
    resources: ["PostgreSQL JOIN types", "SQL join visualizer (joins.surge.sh)", "Database indexing for join columns"]
  })
];

const SQL_EXTENDED = [
  {
    title: "Subqueries",
    overview: "Subqueries nest SELECT statements inside WHERE, FROM, or SELECT clauses to answer multi-step questions in one SQL statement.",
    theory: "Non-correlated subqueries run independently; correlated subqueries reference outer rows and execute per row. IN, EXISTS, and scalar subqueries each suit different shapes. Derived tables in FROM require aliases.",
    explanation: "Use EXISTS for existence checks (often faster than IN on large sets). Scalar subqueries must return one row/column. CTEs (WITH) often improve readability over deep nesting.",
    realWorldExample: "Reporting dashboards use subqueries to find customers whose last order exceeds average order value.",
    architectureDiagram: `Outer SELECT\n    └── Inner SELECT (filter / derive / scalar)`,
    flowDiagram: `Parse outer query → Execute inner query → Bind results → Complete outer projection`,
    syntax: `-- Scalar\nSELECT name FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- EXISTS\nSELECT c.name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    practicalExample: `-- Products never ordered\nSELECT p.id, p.name FROM products p\nWHERE p.id NOT IN (\n  SELECT DISTINCT product_id FROM order_items WHERE product_id IS NOT NULL\n);`,
    exercise: "List employees earning more than their department average using a correlated subquery.",
    assignment: "Rewrite three nested subqueries as CTEs and compare EXPLAIN plans.",
    miniProject: "Sales leaderboard query combining scalar and derived-table subqueries on a 4-table schema.",
    quiz: [
      { question: "EXISTS is often preferred over IN when:", options: ["You need all columns", "Checking row existence on large tables", "Sorting results", "Updating rows"], correct: 1 },
      { question: "A scalar subquery must return:", options: ["Many rows", "One row and one column", "No rows always", "Only NULL"], correct: 1 }
    ]
  },
  {
    title: "Indexes",
    overview: "Indexes accelerate lookups by maintaining sorted data structures (typically B-trees) at the cost of extra storage and slower writes.",
    theory: "B-tree indexes support equality and range scans. Composite indexes follow left-prefix rule. Partial indexes filter rows. Covering indexes include all queried columns to avoid table access.",
    explanation: "Create indexes on foreign keys and frequent WHERE/JOIN columns. EXPLAIN ANALYZE reveals sequential scans vs index scans. Too many indexes hurt INSERT/UPDATE throughput.",
    realWorldExample: "E-commerce product search adds composite index on (category_id, price) after slow category browse reports.",
    architectureDiagram: `Table heap\n    │\n    ▼\nB-tree Index (key → row pointer)`,
    flowDiagram: `Query → Planner chooses index scan → Traverse B-tree → Fetch heap rows → Return`,
    syntax: `CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);\nCREATE INDEX idx_active_users ON users(email) WHERE active = true;`,
    practicalExample: `EXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 42 AND created_at > '2025-01-01';`,
    exercise: "Add an index that speeds up JOIN orders to users on user_id; verify with EXPLAIN.",
    assignment: "Document index strategy for a 10M-row events table queried by user_id and event_type.",
    miniProject: "Benchmark SELECT before/after indexes on a seeded 1M-row table; capture timing and plan diffs.",
    quiz: [
      { question: "Composite index (a, b) helps queries filtering on:", options: ["Only column b alone", "Column a or both a and b", "Neither column", "Only ORDER BY c"], correct: 1 },
      { question: "Covering index means:", options: ["Index includes all queried columns", "Index covers entire disk", "No table exists", "Only primary key"], correct: 0 }
    ]
  },
  {
    title: "Views",
    overview: "Views are saved queries presenting virtual tables—simplifying complex joins and enforcing read-only access patterns.",
    theory: "Views do not store data (except materialized views). Updatable views have restrictions (single table, no aggregates). Security views hide sensitive columns from roles.",
    explanation: "Use views to encapsulate reporting logic. Materialized views trade freshness for speed in analytics. Document view dependencies before schema migrations.",
    realWorldExample: "Finance teams query v_monthly_revenue instead of repeating 5-table joins in every report.",
    architectureDiagram: `Client → VIEW definition → Base tables`,
    flowDiagram: `CREATE VIEW → Store query text → SELECT view → Rewrite to base tables`,
    syntax: `CREATE VIEW active_customers AS\nSELECT id, name, email FROM customers WHERE active = true;`,
    practicalExample: `CREATE VIEW order_summary AS\nSELECT o.id, u.name, o.total, o.status\nFROM orders o JOIN users u ON u.id = o.user_id;`,
    exercise: "Create a view for product inventory including reserved quantity from open orders.",
    assignment: "Design role-based views hiding salary column from analysts.",
    miniProject: "Reporting layer: 3 views (daily sales, top products, churn risk) over sample schema.",
    quiz: [
      { question: "Standard views store:", options: ["Query definition only", "Physical copy always", "Indexes only", "Triggers"], correct: 0 },
      { question: "Materialized views trade:", options: ["Freshness for speed", "SQL for HTML", "Rows for columns", "Joins for unions"], correct: 0 }
    ]
  },
  {
    title: "Stored Procedures",
    overview: "Stored procedures encapsulate transactional logic inside the database for consistency, performance, and centralized rules.",
    theory: "PostgreSQL uses functions/procedures (CREATE PROCEDURE since PG11). Parameters can be IN/OUT. Transactions inside procedures ensure atomic multi-step changes.",
    explanation: "Prefer procedures when multiple apps share the same write rules. Version and test like application code. Avoid hiding business logic that belongs only in one microservice unless sharing is required.",
    realWorldExample: "Banking systems use stored procedures for atomic fund transfers with row-level locking.",
    architectureDiagram: `App → CALL procedure → PL/pgSQL block → Tables`,
    flowDiagram: `CALL → Parse args → Begin transaction → Execute steps → Commit/rollback`,
    syntax: `CREATE OR REPLACE PROCEDURE deactivate_user(uid INT)\nLANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE users SET active = false WHERE id = uid;\nEND; $$;`,
    practicalExample: `CREATE OR REPLACE PROCEDURE apply_discount(order_id INT, pct NUMERIC)\nLANGUAGE sql AS $$\n  UPDATE orders SET total = total * (1 - pct/100) WHERE id = order_id;\n$$;`,
    exercise: "Write a procedure that archives orders older than 1 year into an orders_archive table.",
    assignment: "Compare maintaining transfer logic in app vs stored procedure—list tradeoffs.",
    miniProject: "Inventory reservation procedure decrementing stock and creating order rows atomically.",
    quiz: [
      { question: "Procedures help when:", options: ["Multiple apps share write rules", "Styling UI", "Parsing JSON in browser", "DNS routing"], correct: 0 },
      { question: "Transaction inside procedure ensures:", options: ["Atomic multi-step changes", "Faster CSS", "No SQL", "Automatic indexes"], correct: 0 }
    ]
  },
  {
    title: "Triggers",
    overview: "Triggers run automatically on INSERT/UPDATE/DELETE for auditing, validation, and derived data maintenance.",
    theory: "BEFORE triggers can modify or reject rows; AFTER triggers see final row state. FOR EACH ROW vs STATEMENT scope matters. Trigger functions return NEW/OLD in PostgreSQL.",
    explanation: "Use triggers sparingly—hidden logic complicates debugging. Great for audit trails and updated_at timestamps. Avoid heavy work in hot paths.",
    realWorldExample: "Audit log tables capture who changed salary fields via AFTER UPDATE triggers.",
    architectureDiagram: `DML on table → Trigger fires → trigger_function() → side effects`,
    flowDiagram: `INSERT/UPDATE/DELETE → BEFORE trigger → apply change → AFTER trigger → audit`,
    syntax: `CREATE TRIGGER set_updated_at\nBEFORE UPDATE ON products\nFOR EACH ROW EXECUTE FUNCTION touch_updated_at();`,
    practicalExample: `CREATE TABLE audit_log(id serial, tbl text, action text, at timestamptz default now());`,
    exercise: "Create updated_at trigger maintaining timestamp on any row update.",
    assignment: "Design audit trigger capturing old/new JSON for sensitive columns only.",
    miniProject: "Order status history table populated by AFTER UPDATE trigger on orders.",
    quiz: [
      { question: "BEFORE trigger runs:", options: ["Before row change is applied", "After commit only", "On SELECT", "On index create"], correct: 0 },
      { question: "Triggers are best for:", options: ["Audit timestamps", "Replacing all app logic", "UI layout", "HTTP caching"], correct: 0 }
    ]
  },
  {
    title: "Optimization",
    overview: "Query optimization aligns SQL, indexes, and schema design with SLA latency and cost targets.",
    theory: "EXPLAIN shows planner choices: Seq Scan, Index Scan, Hash Join, Nested Loop. Statistics (ANALYZE) guide estimates. N+1 query patterns in ORMs dwarf single-query tuning wins.",
    explanation: "Start with EXPLAIN ANALYZE on slow queries. Reduce selected columns, add selective indexes, rewrite correlated subqueries, batch writes. Monitor pg_stat_statements in production.",
    realWorldExample: "API p99 dropped from 800ms to 40ms after fixing ORM N+1 and adding covering index on foreign key.",
    architectureDiagram: `Slow query log → EXPLAIN → Index/schema fix → Verify → Deploy`,
    flowDiagram: `Identify slow query → Measure baseline → Hypothesis → Change → Re-measure`,
    syntax: `EXPLAIN (ANALYZE, BUFFERS)\nSELECT ...;`,
    practicalExample: `-- Rewrite IN subquery as JOIN for planner flexibility\nSELECT u.* FROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE o.status = 'shipped';`,
    exercise: "Take a sequential scan query and achieve index scan with proper index and statistics.",
    assignment: "Write runbook for investigating slow queries in production PostgreSQL.",
    miniProject: "Optimize 3 provided slow queries on seeded data; document plans before/after.",
    quiz: [
      { question: "EXPLAIN ANALYZE shows:", options: ["Actual execution stats", "Only syntax errors", "UI colors", "Git history"], correct: 0 },
      { question: "ORM N+1 problem causes:", options: ["Many small queries in a loop", "One big JOIN always", "Too many indexes", "No primary keys"], correct: 0 }
    ]
  },
  {
    title: "PostgreSQL",
    overview: "PostgreSQL extends SQL with JSONB, arrays, full-text search, extensions, and MVCC concurrency—common in modern backends.",
    theory: "MVCC keeps row versions for concurrent reads without blocking writers. JSONB stores semi-structured documents with GIN indexes. Sequences generate surrogate keys. Extensions (pgvector, PostGIS) add capabilities.",
    explanation: "Use JSONB for flexible attributes with GIN indexes on keys you filter. Understand vacuum/autovacuum for bloat. LISTEN/NOTIFY for lightweight pub/sub.",
    realWorldExample: "SaaS products store feature flags in JSONB columns; analytics uses pgvector for semantic search.",
    architectureDiagram: `PostgreSQL Cluster\n ├── JSONB / Arrays\n ├── Extensions (pgvector)\n └── MVCC storage`,
    flowDiagram: `SQL + PG types → Planner → MVCC read/write → WAL durability`,
    syntax: `SELECT data->>'city' AS city FROM profiles WHERE data @> '{"active": true}';\nCREATE EXTENSION IF NOT EXISTS vector;`,
    practicalExample: `SELECT id, title FROM articles\nWHERE to_tsvector('english', body) @@ to_tsquery('database & tuning');`,
    exercise: "Query JSONB orders for line items containing a SKU using @> containment.",
    assignment: "Compare storing attributes in JSONB vs normalized columns for an e-commerce catalog.",
    miniProject: "PostgreSQL schema with JSONB metadata, GIN index, and full-text search on descriptions.",
    quiz: [
      { question: "JSONB is suited for:", options: ["Semi-structured attributes", "Replacing all relational columns", "CSS storage", "Thread pools"], correct: 0 },
      { question: "MVCC allows:", options: ["Readers without blocking writers", "No transactions", "Only one connection", "No indexes"], correct: 0 }
    ]
  }
];

for (const spec of SQL_EXTENDED) {
  SQL_CURRICULUM.push(
    buildLesson({
      title: spec.title,
      description: `${spec.title} for production PostgreSQL workloads`,
      difficulty: spec.title === "Optimization" || spec.title === "PostgreSQL" ? "Advanced" : "Intermediate",
      duration: "24 min",
      codeLang: "sql",
      overview: spec.overview,
      theory: spec.theory,
      explanation: spec.explanation,
      realWorldExample: spec.realWorldExample,
      architectureDiagram: spec.architectureDiagram,
      flowDiagram: spec.flowDiagram,
      objectives: spec.objectives || [
        `Apply ${spec.title} in realistic PostgreSQL schemas`,
        "Measure impact with EXPLAIN ANALYZE",
        "Avoid common production pitfalls"
      ],
      syntax: spec.syntax,
      practicalExample: spec.practicalExample,
      bestPractices: spec.bestPractices || [
        "Test on realistic data volumes",
        "Use EXPLAIN ANALYZE before shipping",
        "Keep migrations versioned",
        "Document assumptions in team wiki"
      ],
      commonMistakes: spec.commonMistakes || [
        "Optimizing without measuring",
        "Ignoring index maintenance cost",
        "Hidden logic without tests",
        "Skipping NULL handling in joins"
      ],
      exercise: spec.exercise,
      assignment: spec.assignment,
      miniProject: spec.miniProject,
      quizQuestions: spec.quiz || [
        { question: `${spec.title} primarily affects:`, options: ["CSS layout", "Database layer", "DNS routing", "GPU drivers"], correct: 1 },
        { question: "Validate SQL changes with:", options: ["Guessing", "EXPLAIN and tests", "Deleting indexes", "SELECT * only"], correct: 1 }
      ],
      interviewQuestions: spec.interview || [
        `Explain ${spec.title} with a real schema example.`,
        `What tradeoffs does ${spec.title} introduce in OLTP systems?`
      ],
      summary: spec.summary || `${spec.title} is a core PostgreSQL skill—measure, document, and test every change.`,
      resources: ["PostgreSQL official docs", "Use The Index, Luke", "pg_stat_statements guide"]
    })
  );
}

export default SQL_CURRICULUM;
