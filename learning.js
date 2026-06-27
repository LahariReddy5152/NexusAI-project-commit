function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function renderList(items) {
    if (!items || !items.length) return "<p>No content available.</p>";
    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderCode(code) {
    if (!code) return "<pre></pre>";
    return `<pre>${escapeHtml(code)}</pre>`;
}

function renderTheory(text) {
    if (!text) return "";
    return text
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("");
}

function renderExercises(d) {
    return `
<div class="exercise-grid">
  <div class="exercise-card">
    <h3>Easy Exercise</h3>
    <p>${d.easyExercise}</p>
  </div>
  <div class="exercise-card">
    <h3>Medium Exercise</h3>
    <p>${d.mediumExercise}</p>
  </div>
  <div class="exercise-card">
    <h3>Hard Exercise</h3>
    <p>${d.hardExercise}</p>
  </div>
</div>`;
}

function buildLesson(d) {
    return {
        title: d.title,
        content: `
<h2>1. Topic Overview</h2>
<p>${d.overview}</p>

<h2>2. Beginner Explanation</h2>
<p>${d.beginnerExplanation}</p>

<h2>3. Why It Matters</h2>
<p>${d.whyItMatters}</p>

<h2>4. Real Industry Use Cases</h2>
${renderList(d.useCases)}

<h2>5. Detailed Theory</h2>
${renderTheory(d.detailedTheory)}

<h2>6. Multiple Code Examples</h2>
<h3>Beginner Example</h3>
${renderCode(d.beginnerCode)}
<h3>Intermediate Example</h3>
${renderCode(d.intermediateCode)}
<h3>Advanced Example</h3>
${renderCode(d.advancedCode)}

<h2>7. Line-by-Line Code Explanation</h2>
${renderList(d.lineByLine)}

<h2>8. Common Mistakes</h2>
${renderList(d.commonMistakes)}

<h2>9. Best Practices</h2>
${renderList(d.bestPractices)}

<h2>10. Practice Exercises</h2>
${renderExercises(d)}

<h2>11. Quiz Questions</h2>
${renderList(d.quizQuestions)}

<h2>12. Interview Questions</h2>
${renderList(d.interviewQuestions)}

<h2>13. AI Mentor Tips</h2>
${renderList(d.aiMentorTips)}

<h2>14. Summary Notes</h2>
${renderList(d.summaryNotes)}

<h2>15. Mini Project</h2>
<p>${d.miniProject}</p>

<h2>16. Completion Tracking</h2>
<p>Click Mark Complete to update your progress for this lesson.</p>

<h2>Expected Output</h2>
${renderCode(d.expectedOutput)}
`
    };
}

const pythonBasicsTheory = `Python is a high-level, interpreted programming language built around clarity and developer productivity. It is designed so that humans can read code quickly and reason about behavior without unnecessary syntax overhead. That design goal explains why Python is used by both beginners and senior engineers in high-impact domains. In AI engineering specifically, Python dominates because it combines fast iteration with a massive ecosystem of mature libraries. Teams can move from idea to prototype quickly, then harden that same code into production services.

At runtime, the most common implementation (CPython) transforms source code into bytecode and executes it inside the Python virtual machine. You do not see this pipeline directly, but understanding it helps explain module imports, caching behavior, and startup costs. Python also supports alternative implementations such as PyPy, but most AI tooling is optimized for CPython, so that is what most professionals use. The key takeaway for learners is that Python emphasizes productivity, readability, and ecosystem leverage over low-level manual control.

Python's readability is enforced by indentation. Code blocks are defined by consistent spaces, not braces. This can feel strict initially, but it improves maintainability because structure is always visible. In collaborative teams, this consistency lowers code review friction and reduces ambiguous formatting. You should configure your editor for four spaces per indent and avoid tabs. Pair this with standard naming conventions and your code immediately becomes easier for others to understand.

Another foundational concept is environment isolation. In professional work, every Python project should run in its own virtual environment. Without isolation, dependency conflicts appear quickly: one project may require one version of a package while another needs a different version. Virtual environments solve this by isolating installed dependencies per project. Combined with pinned dependency files, this creates reproducible behavior across developer machines, CI pipelines, and production deployments.

Python also encourages modular architecture. A file is a module, and modules can be grouped into packages. Breaking logic into modules improves testability and reduces complexity. For example, a learning application may have separate modules for content rendering, progress storage, analytics calculations, and mentor logic. This separation allows focused testing and easier refactoring. Beginners often place everything in one script, but production systems rely on modular design to scale safely.

Error handling, logging, and observability are part of Python fundamentals too. Reading traceback messages carefully is a core skill. The traceback tells you file, line number, and exception type, which often points directly to root cause. Professional engineers instrument scripts with clear logs and avoid silent failures. If a script fails, it should fail loudly with useful context.

Finally, Python basics are not just syntax rules. They are engineering habits: clear naming, explicit data flow, modular decomposition, consistent formatting, and reproducible environments. These habits are what differentiate temporary scripts from production-ready software. Mastering these basics early accelerates everything that follows, including data structures, APIs, AI workflows, and system design.`;

const variablesTheory = `Variables are labels that reference objects in memory. In Python, assignment does not copy a raw value into a fixed memory slot in the way beginners often imagine. Instead, a name is bound to an object. That object can be immutable (like an integer or string) or mutable (like a list or dictionary). This distinction drives many real bugs in production systems, so understanding references and mutability early is critical.

When you write x = 10 and later x = 'hello', the name x now points to a new object of a different type. Python's dynamic typing allows this flexibility and speeds up development, but careless rebinding can reduce clarity. In production code, variables should keep stable meaning through their lifetime. If a variable name implies count, it should not later hold a dictionary or response payload. Stable semantic meaning is a major code quality signal.

Scope is another essential variable concept. Local variables exist inside functions, global variables exist at module level, and nonlocal variables appear in nested function closures. Excessive global state increases coupling and creates hidden dependencies that are hard to test. Strong engineering practice is to pass values explicitly into functions and return results clearly. This improves traceability and allows deterministic tests.

Mutability adds another layer. If two variables reference the same list, mutating through one name affects both references. Beginners may believe they created a copy when they only copied the reference. In pipelines and services, this can cause subtle side effects where one function unexpectedly changes data consumed by another function. Defensive copying, immutable defaults, and clear ownership conventions reduce these risks.

Naming conventions are not cosmetic. A variable called score_threshold communicates intent immediately; a variable called x does not. Descriptive names reduce cognitive load, simplify debugging, and improve onboarding for new contributors. In AI workflows where values like temperature, max_tokens, and confidence thresholds move through many steps, naming precision is especially important.

Constants should be represented in UPPER_CASE to signal fixed intent by convention, such as MAX_RETRIES or API_TIMEOUT_SECONDS. Although Python does not enforce immutability for constants, this convention prevents accidental reassignment and improves readability.

Variable discipline directly affects observability. Logs, metrics, and traces often include variable values. If names are vague, telemetry is hard to interpret. If names are explicit, incident diagnosis becomes faster. Combined with validation and clear type expectations, well-managed variables help prevent both logic defects and operational failures.

In summary, variables are the backbone of data flow. Mastering assignment behavior, scope, mutability, and naming turns Python code from fragile scripts into maintainable systems. This topic may look simple, but it influences every advanced skill you will learn later in APIs, ML pipelines, and production operations.`;

const dataTypesTheory = `Data types define how Python stores values, what operations are valid, and how behavior is interpreted at runtime. Choosing the correct type is not a stylistic decision; it directly affects correctness, performance, and maintainability. In application engineering and AI workflows, many runtime bugs originate from type assumptions that were never validated.

Python provides scalar types like int, float, bool, and str. It also provides collection types like list, tuple, set, and dict. Each has specific strengths. Integers represent whole numbers with arbitrary precision. Floats represent decimal values but can introduce precision artifacts due to binary representation. Strings hold immutable Unicode text. Booleans drive logical decisions in control flow.

Collection types model structured data. Lists are ordered and mutable, useful for sequences that evolve. Tuples are ordered and immutable, useful for fixed records and safe hashable structures. Sets enforce uniqueness and provide fast membership checks. Dictionaries map keys to values and are foundational for JSON-like payloads and configuration data.

In real systems, type boundaries matter most at input/output edges: API request bodies, file reads, environment variables, and user input. External data often arrives as strings, even when numeric semantics are required. Robust code validates and converts these values explicitly before using them in business logic. Silent type coercion is a common source of hidden bugs.

Type behavior also impacts performance characteristics. Using a list for repeated membership checks in large datasets may be inefficient compared to a set. Using deeply nested dictionaries without validation can produce brittle code. Good engineers choose structures based on access patterns and update requirements, not habit.

Precision considerations are especially important for financial, statistical, and AI scoring contexts. Floats are suitable for many operations but not all. Where exact decimal behavior is required, specialized numeric types should be used. For confidence thresholds and probabilistic outputs, float plus tolerance-aware comparisons is standard.

Type hints improve communication and tooling support. While Python does not enforce hints at runtime by default, hints enable editors, static analyzers, and reviewers to reason about expectations before execution. In teams, this reduces misunderstanding and shortens debugging cycles.

Truthiness is another subtle area. Empty strings, zero, empty collections, and None evaluate to false in conditional contexts. This is convenient but can be ambiguous if you need to distinguish between missing and empty values. Explicit checks (for example, is None) are often safer in critical flows.

Ultimately, mastering data types means designing reliable data contracts. Type clarity at boundaries, deliberate collection choices, and explicit conversion rules create resilient systems. This foundation becomes essential in APIs, database interactions, model pipelines, and production observability where shape and meaning of data must remain consistent across components.`;

const operatorsTheory = `Operators are the symbols and keywords that perform computation, comparison, and logical combination in Python. They may appear simple, but they control much of your application's behavior. Eligibility rules, score calculations, filtering logic, and routing conditions all rely on correct operator usage. Small mistakes in expressions can silently produce wrong outcomes.

Arithmetic operators include +, -, *, /, //, %, and **. Each has specific behavior. Division with / returns float, while // performs floor division. Modulo % is useful for periodic checks and partitioning logic. Exponentiation ** supports scoring formulas and growth calculations. In production code, arithmetic expressions should be written clearly and tested with representative inputs.

Comparison operators (==, !=, <, >, <=, >=) return booleans and drive branch decisions. Python also supports chained comparisons like 0 < score <= 100, which are readable and efficient. However, equality checks on floating-point values require caution. Because float representation is approximate, tolerance-based checks are often safer than direct equality.

Logical operators (and, or, not) combine boolean expressions. Python short-circuits these expressions, meaning evaluation stops once result is known. This can improve performance and prevent errors when checking optional structures, but overusing compact logical tricks can reduce readability. In business-critical logic, clarity is more valuable than cleverness.

Assignment operators like += and -= provide concise state updates. They can improve readability when used appropriately. However, mutation semantics for mutable objects should still be understood carefully. Identity operators (is, is not) are for object identity checks, not general value equality. A frequent bug is using is instead of == for strings or numbers.

Membership operators (in, not in) are heavily used for validation and filtering. They become especially important when selecting the right data structure: membership in set is generally faster than in list for large collections. This affects performance in high-volume data paths.

Operator precedence determines evaluation order. While Python precedence rules are consistent, relying on implicit precedence in long expressions makes code harder to review. Parentheses are a communication tool: they reveal intent and reduce ambiguity. Teams should prefer explicit grouping in non-trivial expressions.

In AI systems, operators frequently control thresholds, confidence routing, and fallback selection. A minor threshold mistake may send too many requests to expensive models or degrade output quality. Unit tests should include boundary values, near-threshold cases, and invalid inputs.

Strong operator usage means writing expressions that are both correct and readable. Break complex conditions into named intermediate variables. Verify assumptions with tests. Keep side effects minimal inside expressions. These practices create deterministic behavior and lower regression risk as systems evolve.`;

const controlFlowTheory = `Control flow defines how a program chooses between alternative paths. In Python, if, elif, and else blocks are the primary structures for branching decisions. Control flow is where business rules become executable behavior, so clarity and correctness here are central to software quality.

A frequent source of defects is branch ordering. Python evaluates conditions top to bottom and executes the first true branch. If broad conditions appear before specific conditions, specific behavior may never execute. Professional practice is to order checks from most specific to most general and to test branch boundaries explicitly.

Nested branching can quickly become hard to understand. Guard clauses reduce this complexity by returning early for failure or edge conditions, allowing the main path to remain flat and readable. This style improves maintainability and reduces cognitive overhead during reviews.

Control flow should also be observable. In critical workflows such as authentication, payments, or model routing, logging branch decisions helps production diagnosis. If a user ends up in the wrong branch, logs should make that path clear. Silent branching logic is difficult to debug when incidents occur.

As systems grow, some branching can be replaced by data-driven dispatch (for example, mapping keys to handler functions). This reduces long if/elif chains and simplifies extension. Still, explicit if/elif remains the most common and appropriate pattern for many scenarios.

In AI engineering, control flow often handles retries, fallbacks, safety checks, and escalation logic. For instance, if model confidence is low, route to secondary model or human review. If response parsing fails, trigger recovery path. These branches influence both reliability and cost, so they require disciplined design.

Combining conditions should prioritize readability. Named booleans such as has_access, is_active_subscription, and passed_risk_check are easier to reason about than one long compound expression. Clarity here improves test quality and reduces maintenance mistakes.

Testing control flow means covering every meaningful branch: happy path, failure path, boundary path, and fallback path. If a threshold is 75, test 74, 75, and 76. If role and status are combined, test key combinations. Branch coverage tools can help ensure no critical path is untested.

Control flow is not just syntax. It is decision architecture. Well-designed control flow produces predictable behavior, easier debugging, and safer refactoring. Poorly designed control flow creates hidden defects and brittle code. Mastery of this topic is essential before moving to loops, functions, and larger system orchestration patterns.`;

const loopsTheory = `Loops allow you to execute repeated logic efficiently without writing duplicated code blocks. In Python, the two primary loop constructs are for and while. A for loop is typically used when iterating over a known iterable such as a list, tuple, dictionary, string, or range. A while loop is used when repetition should continue until a condition changes. Choosing correctly between these two patterns improves readability and prevents control-flow bugs in production software.

For loops are preferred for most collection processing tasks. They make intent explicit: iterate over each item and process it. Python provides helpers like enumerate, zip, and reversed to support common iteration patterns cleanly. In data and AI workloads, for loops are used to process records, transform tokens, batch model inputs, and aggregate metrics. While loops are common in retry mechanisms, polling tasks, and state-driven workflows where loop duration is not known ahead of time.

A crucial concept is loop termination. Infinite loops occur when while conditions never become false or when termination logic is skipped accidentally. In production, this can consume CPU resources, flood logs, and trigger cascading failures. Every while loop should have explicit progress toward exit. It is also good practice to include safety guards such as max_attempts for network retries and timeout constraints for long-running operations.

Loop control statements break and continue provide fine-grained behavior. break exits the loop immediately, while continue skips the current iteration and proceeds to the next. These tools are powerful but should be used intentionally. Excessive break/continue usage can make loops harder to reason about. Favor clear condition checks and small helper functions when loop logic becomes dense.

Performance considerations matter for large datasets. Nested loops over large collections can become expensive quickly. In many cases, using sets for membership checks, dictionary lookups, or vectorized operations with specialized libraries can significantly improve speed. However, readability should remain a priority; optimize with evidence, not assumptions. Use profiling tools when processing scale is substantial.

In AI engineering, loops are often used for chunking text, scoring candidates, streaming responses, and retrying external API calls. Each pattern requires careful error handling. For example, retry loops should include exponential backoff and clear stop conditions. Stream-processing loops should validate payload shape per iteration to avoid propagating corrupt data.

Testing loops means validating typical cases and edge cases: empty input, one-item input, max-size input, and failure states. Loop correctness is not only about final output but also about runtime behavior under stress. Well-designed loops are predictable, bounded, and readable.

Mastering loops means mastering controlled repetition. Strong loop design reduces duplication, improves throughput, and lowers operational risk. This makes loops one of the most practical and high-impact fundamentals in Python development.`;

const functionsTheory = `Functions are reusable blocks of logic that take inputs, perform operations, and optionally return outputs. In Python, function design is one of the strongest predictors of code quality because it controls modularity, testability, and maintainability. Rather than repeating business logic in multiple places, functions centralize behavior behind clear interfaces. This reduces defects and accelerates refactoring.

A well-designed function has one clear responsibility. If a function validates input, transforms data, sends network requests, and formats UI output all at once, it becomes hard to test and reason about. A better pattern is separation of concerns: small focused functions composed into pipelines. This approach improves reuse and enables targeted unit tests.

Function signatures communicate contracts. Parameter names should be meaningful, optional behavior should use explicit defaults, and return values should be predictable. Python supports positional arguments, keyword arguments, default parameters, varargs (*args), and keyword varargs (**kwargs). These features are powerful, but overusing flexibility can create unclear APIs. Prefer explicit signatures unless variability is genuinely needed.

Return behavior matters. Functions should return data rather than printing internally when possible. Returning values keeps functions composable and test-friendly. Printing is useful at edges (CLI output, debug logs), but business logic is usually cleaner when pure or near-pure. Pure functions—those without side effects—are easier to reason about and safer to reuse.

Docstrings and type hints strengthen function clarity. A short docstring explains purpose, parameters, and return semantics. Type hints improve editor support and static analysis, reducing misunderstandings in team settings. Even though Python does not enforce hints at runtime by default, they improve long-term maintainability substantially.

Common pitfalls include mutable default arguments, hidden global dependencies, and giant functions. Mutable defaults like def f(items=[]): can persist state across calls unexpectedly. Use None and initialize inside function body. Global dependencies reduce predictability; pass dependencies explicitly where possible. Giant functions should be decomposed into smaller units.

In AI systems, functions often encapsulate prompt building, model invocation, response parsing, fallback logic, and scoring. This modularity enables easier experimentation because each stage can be swapped or improved independently. It also supports robust testing by mocking specific function boundaries.

Testing functions should cover happy path, edge cases, and invalid inputs. Unit tests should assert both outputs and error behavior. Clear function decomposition shortens debugging cycles and supports confident release workflows.

Mastering functions means mastering reusable design. Good functions make codebases easier to understand, easier to test, and safer to evolve. This skill scales from small scripts to enterprise services and AI production pipelines.`;

const listsTheory = `Lists are ordered, mutable collections used to store sequences of values. They are among Python's most frequently used data structures because they are flexible and easy to work with. Lists support indexing, slicing, appending, insertion, removal, sorting, and comprehension-based transformations. In real software systems, lists represent queues, result sets, histories, batches, and many other dynamic datasets.

Because lists are mutable, they can be updated in place. This is useful for iterative processing but introduces side-effect risks when the same list reference is shared across functions. Defensive copying is important when ownership is unclear. For example, passing a list into a function that mutates it can surprise callers if mutation was not expected.

Indexing and slicing are central list operations. list[0] gets first element, list[-1] gets last, and list[start:end] extracts ranges. These operations are powerful but require careful boundary awareness. Accessing invalid indexes raises IndexError. Robust code checks length or uses safer iteration patterns when index certainty is low.

List comprehensions provide concise transformation syntax and are widely used in production Python. They improve readability for simple filter/map patterns, but deeply nested comprehensions can become difficult to understand. Favor clarity over compactness. If a comprehension needs multiple conditional branches, a normal loop may be more maintainable.

Performance characteristics matter at scale. Appending to a list is efficient on average, but inserting at the beginning repeatedly is expensive because elements shift. Membership checks in large lists are linear time; for frequent membership operations, sets are usually faster. Sorting lists with custom keys is common and often cleaner than manual ranking logic.

In AI and data workflows, lists hold tokens, feature vectors, batched requests, and output candidates. When processing large lists, avoid unnecessary copies and repeated expensive operations inside loops. Pipeline performance often improves by restructuring list operations and reducing nested passes.

Common bugs include mutating a list while iterating over it, aliasing unintended references, and assuming sorted modifies original list when using sorted(). Use clear patterns: iterate over copies when removing elements, use list() to clone, and remember sorted returns a new list while list.sort mutates in place.

Testing list logic should include empty lists, single-element lists, duplicate values, and large input sizes. Edge-case awareness prevents runtime failures and logic regressions.

Mastering lists means mastering sequence data flow. This skill is foundational for everything from API processing to ML data preparation and recommendation pipelines.`;

const tuplesTheory = `Tuples are ordered, immutable collections used for fixed-size records and stable grouped values. They look similar to lists but differ in mutability: once created, tuple elements cannot be reassigned. This immutability makes tuples useful for representing data that should not change accidentally, such as coordinates, configuration keys, and structured return values.

One major tuple advantage is hashability (when elements are hashable). Hashable tuples can be used as dictionary keys and set members, enabling patterns like memoization caches and coordinate mapping. Lists cannot be dictionary keys because they are mutable and unhashable. Understanding this distinction is important in performance-sensitive lookup scenarios.

Tuple unpacking is a highly readable Python feature. You can assign multiple values in one statement, such as name, role = ('Lahari', 'Engineer'). Unpacking simplifies loops and function returns. Functions often return tuples to provide multiple related outputs without creating a custom class for simple cases.

Single-element tuples require a trailing comma, for example (5,). Without the comma, Python treats (5) as a grouped expression, not a tuple. This subtle syntax detail is a common beginner trap and appears frequently in bug reports.

Immutability improves safety in shared contexts. When data should remain stable across function boundaries, tuples communicate intent clearly. This is especially useful in concurrent or collaborative code where mutation side effects would be problematic. However, tuple immutability applies to tuple slots, not necessarily to nested mutable objects; a tuple containing a list can still have that list mutated.

In production systems, tuples are often used for fixed schema records, routing keys, and cache identifiers. They also appear in sorted outputs as key-value pairs and in database result handling. In AI tooling, tuples can package model metadata such as (model_name, version, threshold) as stable descriptors.

When deciding between list and tuple, ask whether mutation is a required behavior. If yes, list is usually correct. If no, tuple often communicates intent better and can offer small memory/performance benefits. Clarity of intent is usually more important than micro-optimization.

Testing tuple logic should cover unpacking behavior, indexing, and hashability assumptions. Ensure nested structures behave as intended when immutability is expected.

Mastering tuples helps you model stable data cleanly. Combined with lists, sets, and dictionaries, tuples give you expressive control over data semantics and program safety.`;

const setsTheory = `Sets are unordered collections of unique elements. They are ideal for deduplication, fast membership testing, and mathematical set operations like union, intersection, and difference. In many workflows, replacing list-based membership logic with sets improves both clarity and performance.

Set uniqueness is automatic. If duplicate values are inserted, only one instance is kept. This makes sets useful for cleaning noisy input data such as repeated IDs, tags, or labels. Because sets are unordered, they are not suitable where display order matters. Convert to a sorted list for deterministic output when needed.

Membership checks in sets are typically much faster than in lists for large datasets because sets use hash-based lookup. In high-volume systems, this can significantly reduce runtime for validation and filtering tasks. Choosing the right structure for frequent membership operations is a practical optimization with large impact.

Set algebra is a major strength. Intersection finds common elements, difference finds missing elements, and union combines unique values. These operations map directly to real business questions: which required skills are missing, which users completed both modules, which labels are new compared to yesterday's data.

There are important constraints: set elements must be hashable. Mutable types like lists and dictionaries cannot be inserted directly. For immutable set variants, Python provides frozenset, which can be used as dictionary keys or inside other sets. Understanding hashability prevents runtime TypeError surprises.

A common beginner confusion is creating empty sets. {} creates an empty dictionary, not a set. Use set() for empty set creation. Also remember set iteration order is not guaranteed for business presentation; do not rely on implicit order.

In AI and data applications, sets are useful for unique token extraction, label comparison, data quality checks, and overlap analysis between requirements and predictions. They simplify logic that would otherwise require nested loops and repeated comparisons.

Testing set logic should include duplicate-heavy inputs, empty sets, disjoint sets, and subset/superset scenarios. Verify that expected uniqueness and operation semantics hold across edge cases.

Mastering sets means mastering uniqueness and fast lookup patterns. This skill improves both readability and computational efficiency in many real-world Python workflows.`;

const dictionariesTheory = `Dictionaries are key-value mappings and are one of Python's most important data structures for building real applications. They provide fast lookup by key and are ideal for representing structured records, configuration settings, API payloads, and model metadata. In modern backend and AI systems, dictionaries often serve as the in-memory representation of JSON data, making this topic foundational for service development.

A dictionary is defined with unique keys and associated values. Keys must be hashable, while values can be any Python object. Because keys are unique, assigning to an existing key updates the value instead of adding a duplicate entry. This update behavior is useful for incremental state building but can hide bugs when key naming is inconsistent. Clear key conventions reduce such issues.

Access patterns matter. Direct indexing using dict[key] raises KeyError if key is missing, while get(key, default) provides safer optional access. In production code, input data can be incomplete or malformed, so defensive access patterns are preferred at system boundaries. Pair dictionary access with validation to avoid fragile assumptions.

Dictionary iteration supports keys, values, and key-value pairs through keys(), values(), and items(). Choosing the right iteration form improves readability. If you need both fields, iterate through items(); if you only need values for aggregation, values() keeps code concise. Intent-aligned iteration is a small but meaningful quality signal in review.

Nested dictionaries model hierarchical data such as user profiles, project state, or API responses. They are powerful but can become deeply nested and difficult to navigate. Helper functions and schema validation reduce complexity and prevent runtime errors in nested paths. In larger systems, typed models may complement or replace raw nested dictionaries for maintainability.

Dictionary comprehensions provide compact transformation syntax for remapping keys or filtering entries. They are useful for normalization and feature extraction pipelines. As with list comprehensions, readability should come first. If comprehension logic becomes complex, explicit loops are easier to maintain.

Merge and update operations are common in configuration layering and payload enrichment. Methods like update() and unpacking with ** allow combining dictionaries. This is convenient but can overwrite keys silently when sources conflict. In critical flows, detect key collisions intentionally rather than relying on last-write-wins by accident.

In AI engineering, dictionaries are central to prompt templates, inference settings, token statistics, and response parsing. The quality of dictionary contracts directly impacts system reliability. Consistent keys, clear defaults, and robust validation produce predictable behavior and simplify debugging.

Mastering dictionaries means mastering structured state. When used deliberately, dictionaries make data flow explicit, flexible, and efficient across scripts, services, and model pipelines.`;

const stringHandlingTheory = `String handling is a core skill in Python because text data appears everywhere: user input, logs, prompts, API payloads, configuration files, and generated outputs. Strong string handling is not just about formatting text nicely; it is about creating reliable, secure, and maintainable data transformations that behave correctly across edge cases.

Python strings are immutable, meaning operations create new strings instead of modifying existing ones in place. This simplifies reasoning about side effects but can impact performance if large strings are repeatedly concatenated in loops. For multi-part assembly, joining lists of fragments with ''.join(...) is usually more efficient and clearer than repeated + concatenation.

Essential operations include trimming whitespace with strip, searching with in/find, replacing with replace, splitting with split, and case normalization with lower/upper/casefold. These are heavily used in normalization pipelines before validation and comparison. Case-insensitive matching should use robust normalization to prevent subtle mismatches in multilingual or user-generated inputs.

Formatting strategies matter for readability and safety. f-strings provide concise interpolation and are preferred in modern Python for clarity. format() remains useful for dynamic templates. In logging-heavy systems, avoid constructing expensive strings unless needed and prefer structured logging approaches when possible.

String validation is critical at system boundaries. Inputs should be normalized, length-checked, and validated against expected patterns. In many applications, empty strings and whitespace-only strings should be treated differently from missing values. Clear validation semantics prevent downstream errors in routing and storage.

Regular expressions extend string handling for pattern matching and extraction. They are powerful for parsing logs, validating IDs, and extracting entities, but complex patterns can reduce readability and maintainability. Use regex when it simplifies logic; otherwise plain string methods are often easier to reason about.

Unicode support is another practical concern. Python strings are Unicode by default, which helps with globalized applications, but normalization still matters when comparing visually similar characters. Encoding and decoding are especially important when reading files or consuming external APIs. Explicit encoding declarations reduce platform-dependent surprises.

In AI workflows, string handling governs prompt construction, context window preparation, response cleanup, and content safety filters. Minor string bugs can degrade model quality, inflate token usage, or break parsers. Build small utilities for normalization and sanitization instead of scattering ad-hoc string logic across modules.

Testing string-heavy code should include punctuation, newlines, leading/trailing spaces, mixed casing, non-ASCII characters, and malformed inputs. This coverage reveals brittle assumptions early.

Mastering string handling means mastering text reliability. Clear normalization rules and deliberate formatting practices make downstream logic more predictable and robust.`;

const exceptionHandlingTheory = `Exception handling is the discipline of managing runtime errors without losing control of application behavior. In Python, try, except, else, and finally blocks provide a structured way to capture failures, recover when possible, and preserve system stability. Robust exception handling separates production-grade software from fragile scripts.

Errors happen in every real system: invalid inputs, missing files, network timeouts, parsing failures, and permission issues. The goal is not to eliminate all errors but to handle them intentionally. A well-handled exception should either recover safely or fail fast with clear diagnostic context.

Use specific exception types whenever possible. Catching broad Exception indiscriminately can hide root causes and make debugging harder. For example, catching ValueError for conversion issues communicates intent better than a blanket handler. Narrow handlers support clearer incident analysis and safer recovery logic.

The else block runs when no exception occurs and is useful for separating success-path logic from guarded operations. The finally block always executes, making it ideal for cleanup actions like closing resources or releasing locks. This pattern is essential for avoiding leaks and inconsistent state.

Raising exceptions deliberately is equally important. When input validation fails or domain constraints are violated, raise meaningful errors with actionable messages. Silent failure modes are difficult to detect and can propagate corrupted state. Explicit failure is often safer than incorrect continuation.

Custom exceptions improve clarity in larger systems. Instead of reusing generic errors for everything, define domain-specific exceptions that encode business meaning, such as InvalidApplicantDataError or ModelResponseFormatError. This improves observability, routing, and testability.

Logging and exception handling should work together. Capture context that helps debugging, but avoid exposing sensitive information. Error logs should include operation name, relevant IDs, and exception type. In user-facing surfaces, return safe, understandable messages while preserving detailed diagnostics internally.

In AI engineering, exception handling is critical around external APIs and parsing model outputs. Retries with backoff may be appropriate for transient network failures, but not for deterministic validation failures. Different failure categories require different strategies: retry, fallback, skip, or abort.

Testing exception behavior is as important as testing happy paths. Validate that expected exceptions are raised, unexpected exceptions are not swallowed, and cleanup logic always runs. Include malformed input and dependency-failure simulations.

Mastering exception handling means designing failure behavior explicitly. This leads to reliable services, predictable recovery, and faster incident resolution.`;

const fileHandlingTheory = `File handling allows Python programs to persist, read, and transform data outside runtime memory. It is foundational for logs, reports, datasets, configuration files, and pipeline artifacts. Strong file-handling practices combine correctness, safety, and portability so that programs behave consistently across machines and environments.

The with statement is the preferred way to open files because it guarantees proper closing even if errors occur. This pattern prevents resource leaks and simplifies cleanup logic. Use context managers by default for all file operations unless there is a specific reason not to.

File modes determine behavior: 'r' for read, 'w' for write (overwrite), 'a' for append, and 'x' for exclusive creation. Binary modes add 'b'. Choosing mode carelessly can destroy data or produce unexpected results. In production tasks, write operations should be explicit and often accompanied by backup or versioning strategies.

Encoding is a practical cross-platform concern. Use explicit UTF-8 when reading and writing text to avoid platform defaults causing subtle bugs. Encoding mismatches can produce corrupted characters or decode failures. Treat encoding as part of your data contract.

Path handling should be platform-safe. Python's pathlib offers clear, object-oriented path operations and is generally preferable to manual string concatenation. This reduces separator issues and improves readability when building file workflows.

Large file handling requires memory awareness. Reading entire files into memory may be fine for small inputs but risky for large datasets. Streaming line by line or chunk by chunk scales better and reduces memory pressure. This matters in data engineering and AI preprocessing pipelines.

Error handling around file I/O is essential. Common exceptions include FileNotFoundError, PermissionError, and UnicodeDecodeError. Handle these with clear messages and recovery strategy where appropriate. For user-facing tools, provide actionable guidance rather than generic failure output.

Atomic write patterns improve reliability. Writing to a temporary file and then replacing the target minimizes partial-write risk if a process crashes mid-operation. This pattern is useful for state snapshots, generated configs, and progress metadata.

In AI systems, file handling supports dataset ingestion, model artifacts, prompt templates, and evaluation outputs. Consistent directory layout and naming conventions make automation and debugging easier.

Testing file logic should include missing paths, read-only directories, empty files, malformed content, and concurrent access scenarios where relevant.

Mastering file handling means treating storage operations as critical system behavior, not incidental utility code. Reliable file I/O increases robustness across development, CI, and production.`;

const modulesTheory = `Modules are Python files that organize code into reusable units. They are essential for scaling from simple scripts to maintainable applications. By separating concerns into modules, teams reduce complexity, improve testability, and enable parallel development without frequent merge conflicts.

Each module has its own namespace. This isolates identifiers and prevents name collisions that often occur in monolithic scripts. Import statements bring selected symbols into scope, and the way imports are written affects readability, dependency clarity, and startup behavior.

Python supports multiple import styles: import module, from module import name, and aliasing with as. The most maintainable approach is usually explicit imports that preserve origin context. Overusing wildcard imports (from module import *) can obscure dependencies and should be avoided in professional code.

Packages are directories containing modules, often with __init__.py to define package semantics. Package structure expresses architecture. For example, a learning platform might separate modules for content models, rendering logic, persistence, analytics, and mentor responses. This decomposition maps naturally to ownership and testing boundaries.

The __name__ == '__main__' pattern distinguishes module execution from import usage. This allows a file to provide reusable functions while also supporting command-line execution for quick checks. It is a practical pattern for utility modules and scripts.

Circular imports are a common design problem where modules depend on each other in loops. They usually indicate architecture issues and can cause runtime import errors. Fixes include moving shared logic to a lower-level module, reducing coupling, or deferring imports carefully.

Dependency hygiene matters as projects grow. Keep module interfaces narrow, avoid deep import chains where possible, and group related functionality logically. A clear module graph improves onboarding and accelerates debugging because responsibility boundaries are obvious.

In AI applications, modules often separate prompt templates, model adapters, feature extraction, vector store access, and evaluation utilities. This modularity makes experimentation safer because one component can change without destabilizing the rest.

Testing modular code is easier: each module can be validated independently, then integrated at system level. Mocking external dependencies becomes straightforward when boundaries are clean.

Mastering modules means mastering code organization. Good modular design creates extensible systems that are easier to reason about, test, and evolve over time.`;

const packagesTheory = `Packages are directories that group related Python modules into a cohesive unit. They help teams organize larger codebases by domain rather than by random file growth. In practical terms, packages turn a set of scripts into a maintainable application structure with clear boundaries, import paths, and ownership.

At a technical level, a package usually contains an __init__.py file, which marks the directory as importable and can expose public interfaces. Modern Python tooling supports namespace packages as well, but explicit package structure remains easier for most teams to reason about. A stable package layout improves discoverability and reduces accidental duplication of utility logic.

Packages support layered architecture. For example, a learning platform might use packages such as core, content, persistence, analytics, and api. This makes dependencies visible and helps enforce direction: UI logic should not directly depend on storage internals. Clear package boundaries reduce coupling and make refactoring safer.

Import behavior is heavily influenced by package design. Relative imports can be useful inside a package, while absolute imports improve readability in larger projects. Consistency matters more than style preference. Mixed import strategies without conventions can create confusion and brittle execution behavior between local runs and CI.

Public API design is another key package concept. Not every module should be imported by external callers. Expose only stable entry points and keep implementation details internal. This protects consumers from breaking changes and lets maintainers evolve internals without touching every dependent file.

Package metadata and tooling integration are also important. Packaging files, dependency declarations, and test layout all influence reproducibility. Even when applications are not published to PyPI, package discipline improves local development, deployment clarity, and onboarding.

In AI systems, packages frequently separate prompt templates, model adapters, retrieval logic, evaluation suites, and monitoring utilities. This separation allows teams to iterate on one area without destabilizing others. It also supports better testing strategy because each package can have focused unit and integration tests.

Common package pitfalls include circular imports, leaking internals, and over-fragmenting into too many tiny packages. Balance is essential: package boundaries should reflect real responsibility domains, not arbitrary abstractions.

Mastering packages means mastering scalable organization. With strong package structure, projects remain navigable and maintainable as complexity and team size grow.`;

const oopTheory = `Object-oriented programming in Python is a way to model software as interacting objects that combine data and behavior. Instead of scattering state and functions across unrelated modules, OOP groups them into classes with clear responsibilities. This approach is useful when systems have entities with lifecycle, rules, and collaboration patterns.

A class defines a blueprint; an object is an instance created from that blueprint. Methods operate on instance data through self, making behavior contextual and reusable. Constructors such as __init__ initialize required state and enforce basic invariants at creation time. Good initialization reduces invalid object states and downstream error handling.

OOP improves maintainability when used with clear design principles. Single responsibility is especially important: each class should model one concept well. Large classes that do everything become hard to test and change. Composition often works better than deep inheritance when combining behavior.

Encapsulation, inheritance, and polymorphism are OOP pillars, but practical OOP also includes collaboration boundaries, interface clarity, and dependency management. Class design should expose what callers need while hiding implementation details that may change. This creates stable interfaces and reduces accidental coupling.

Python supports OOP idioms while remaining flexible. You can mix procedural and object-oriented styles where each is most suitable. Not every function needs a class. OOP is valuable when it improves clarity of domain modeling, not as a mandatory pattern for every script.

In production, OOP is common for service layers, domain models, adapters, and workflow engines. In AI engineering, classes can model prompt builders, model clients, retrieval pipelines, and evaluators, each with configuration and behavior packaged together. This improves testability through dependency injection and mocking.

Testing object-oriented code should validate both state transitions and method outcomes. Focus on externally observable behavior rather than private implementation details. Well-designed classes are easier to test because responsibilities are narrow and dependencies are explicit.

Common OOP mistakes include God classes, hidden side effects in methods, weak naming, and overuse of inheritance where composition is simpler. Refactoring toward smaller focused classes usually improves long-term quality.

Mastering OOP means modeling the problem domain clearly. When class design aligns with real responsibilities, code becomes easier to read, extend, and debug.`;

const inheritanceTheory = `Inheritance allows one class to derive behavior and structure from another class, enabling reuse and specialization. A child class inherits attributes and methods from a parent class and can add or override behavior. This is useful when multiple entities share common capabilities but also need distinct rules.

In Python, inheritance is declared by placing the parent class in parentheses after the child class name. Method overriding lets a child provide specialized behavior while keeping a common interface. The super() function enables calling parent implementations safely, which is important when extending behavior instead of replacing it entirely.

Inheritance can reduce duplication when used for true is-a relationships. For example, Employee and Student might inherit from Person if they genuinely share core identity and behavior. If the relationship is forced, inheritance introduces fragile coupling and confusing hierarchies. Prefer composition when reuse does not represent a natural subtype.

Method resolution order (MRO) matters, especially in multiple inheritance. Python defines deterministic lookup rules, but complex inheritance trees can still become difficult to reason about. Keep hierarchies shallow and understandable unless there is a strong architectural reason for depth.

Constructor chaining is another practical concern. Child classes that define __init__ should usually call super().__init__ to preserve parent initialization invariants. Missing this step can leave objects partially initialized and create hard-to-debug runtime issues.

In production systems, inheritance is often used for framework extension points, shared base behaviors, and typed domain categories. In AI applications, base classes can define common interfaces for model providers while child classes implement provider-specific logic.

Testing inherited behavior should include parent-level contract checks and child-specific overrides. A child class should satisfy expected base behavior while extending it correctly. Contract-focused tests prevent regressions when parent logic evolves.

Common inheritance mistakes include overly deep trees, tight coupling to parent internals, and overriding methods without preserving contracts. If subclass behavior diverges too far, it is often a sign inheritance is the wrong abstraction.

Mastering inheritance means using hierarchy intentionally. Done well, it improves reuse and consistency; done poorly, it increases complexity and brittleness.`;

const polymorphismTheory = `Polymorphism is the ability to use different object types through a shared interface while each type provides its own implementation. In practice, this means client code can call the same method name on different objects and get type-specific behavior without conditional branching for every case.

Python supports polymorphism naturally through duck typing. If an object implements the expected method, it can participate in the workflow regardless of its concrete class. This flexibility enables extensible designs where new behaviors can be added with minimal changes to existing code.

Polymorphism reduces if-elif chains that branch on type or mode. Instead of manually checking category and dispatching behavior, code can rely on objects to handle their own logic. This improves readability, localizes changes, and lowers regression risk when new variants are introduced.

Interface consistency is critical for effective polymorphism. Methods with the same role should accept compatible inputs and produce predictable outputs. Contracts can be documented via abstract base classes, protocols, or clear tests. Without stable contracts, polymorphic systems become unpredictable.

In enterprise systems, polymorphism appears in payment processors, notification channels, storage adapters, and model providers. In AI platforms, one pipeline can call generate() on different model client implementations, each handling its own API details while preserving a shared contract.

Error handling and observability remain important in polymorphic designs. A common interface should define expected error semantics so callers can recover consistently across implementations. Logging should include implementation identity to simplify diagnosis when behavior differs.

Testing polymorphism focuses on shared contract compliance and implementation-specific behavior. Contract tests ensure every implementation behaves consistently where required. Additional tests verify each type's unique logic.

Common mistakes include inconsistent method signatures, hidden side effects, and leaking type checks back into caller code. If callers must repeatedly inspect concrete types, polymorphism is not being leveraged effectively.

Mastering polymorphism means designing stable interfaces and independent implementations. This yields systems that are easier to extend and safer to evolve.`;

const encapsulationTheory = `Encapsulation is the practice of bundling data with related behavior and controlling how internal state is accessed or modified. It protects object invariants by exposing a clear public interface while keeping implementation details private or semi-private by convention.

Python does not enforce strict private visibility like some languages, but conventions such as _internal and name-mangling with __attribute communicate intended access levels. Encapsulation in Python is less about hard restrictions and more about disciplined API design and team conventions.

Properties are a powerful encapsulation tool. They allow controlled access to attributes through getter/setter methods while preserving attribute-style syntax. This supports validation, normalization, and derived values without breaking external callers when implementation evolves.

Encapsulation improves maintainability by reducing ripple effects. If callers depend only on stable public methods, internals can change with minimal external impact. This is crucial in large codebases where direct field access across many modules makes refactoring risky.

Strong encapsulation also improves correctness. Validation can be centralized where state changes occur, preventing invalid combinations from entering the system. For example, score ranges, status transitions, and configuration rules can be enforced within class methods.

In production systems, encapsulation supports boundary clarity between modules and services. In AI workflows, classes can encapsulate prompt templates, token limits, retry settings, and parsing rules behind simple public methods. This lowers cognitive load for callers and reduces misuse.

Testing encapsulated code should focus on public behavior and contracts, not internal fields. Tests that depend heavily on internals become fragile and resist refactoring. If internal state must be inspected often, consider whether the public API communicates enough meaningful outcomes.

Common mistakes include exposing mutable internals directly, bypassing validation paths, and creating overly restrictive APIs that are hard to use. Good encapsulation balances protection with usability.

Mastering encapsulation means designing reliable boundaries. When state changes are controlled and intent is explicit, systems become safer, clearer, and easier to maintain.`;

const listComprehensionsTheory = `List comprehensions are a concise Python feature for creating lists from iterables with optional transformation and filtering logic. They replace many repetitive for-loop patterns with compact, readable expressions that are still explicit about intent.

The general structure is [expression for item in iterable if condition]. The expression controls output values, the loop section defines iteration source, and the optional condition filters included elements. This structure is simple but powerful for common data-shaping tasks.

In production code, list comprehensions are widely used for data normalization, extracting fields from records, preparing payloads, and building derived lists for UI or analytics. They reduce boilerplate and keep transformation logic close to the output definition.

Readability is the key quality bar. A short single-purpose comprehension is often clearer than multi-line loops. However, deeply nested or heavily conditional comprehensions can become hard to maintain. When complexity grows, explicit loops with well-named intermediate variables are usually better.

Comprehensions also avoid accidental side effects common in imperative loops where temporary state is mutated. Since they focus on expression output, they encourage a functional style that is easier to reason about and test.

Performance is generally good for typical workloads, but clarity should still be prioritized over micro-optimization. For very large pipelines, generator expressions or streaming approaches may be preferable to avoid loading everything into memory.

Nested comprehensions support matrix-like transformations and flattening tasks, but nesting increases cognitive load quickly. Teams should enforce style standards that keep comprehensions understandable in code reviews.

In AI and data workflows, list comprehensions are useful for token filtering, score extraction, candidate ranking inputs, and prompt fragment generation. They provide a clean bridge between raw records and structured downstream processing.

Common pitfalls include variable shadowing, incorrect condition placement, and writing comprehensions for side effects rather than data creation. Comprehensions should return data, not hide mutation-driven logic.

Mastering list comprehensions means balancing conciseness with clarity. Used well, they improve expressiveness and reduce repetitive transformation code.`;

const multithreadingTheory = `Multithreading in Python allows multiple threads of execution within one process, which is especially useful for I/O-bound tasks such as API calls, file operations, and network communication. Threads can improve responsiveness and throughput when work spends time waiting for external resources.

Python's Global Interpreter Lock (GIL) affects CPU-bound threading performance in CPython because only one thread executes Python bytecode at a time. This means multithreading is not usually the best choice for heavy CPU computation; multiprocessing or native extensions are often better there.

For I/O-bound workloads, threading can significantly reduce wall-clock time by overlapping wait periods. Typical examples include fetching data from multiple endpoints, downloading assets, or writing logs while other tasks continue.

The threading module provides Thread, Lock, Event, and other primitives for coordination. Shared mutable state must be protected to prevent race conditions. Race conditions are hard to reproduce and can create inconsistent outputs, so synchronization discipline is critical.

Thread lifecycle management matters in production systems. Start, join, timeout handling, and failure reporting should be explicit. Daemon vs non-daemon behavior also affects shutdown semantics and resource cleanup.

Higher-level abstractions like concurrent.futures.ThreadPoolExecutor simplify thread management and are often preferred for application-level code. They reduce boilerplate and standardize task submission patterns.

Observability is essential in multithreaded systems. Structured logs should include thread context to support debugging. Without clear tracing, intermittent concurrency issues can consume significant engineering time.

In AI pipelines, threads are often used for parallel request fan-out, result collection, and non-blocking preprocessing steps. Careful rate-limiting and retry strategy are needed to avoid overwhelming external services.

Common mistakes include unsafe shared state, missing joins, excessive thread counts, and assuming deterministic execution order. Thread-safe design and defensive tests are necessary.

Mastering multithreading means using concurrency where it fits and coordinating shared state carefully. Done well, it improves responsiveness and system efficiency for I/O-heavy workflows.`;

const apiDevelopmentTheory = `API development in Python focuses on building reliable interfaces for client-server communication. Modern Python APIs commonly use frameworks like FastAPI, Flask, or Django REST to expose endpoints for CRUD operations, workflows, and integrations.

A strong API begins with clear contracts: endpoint paths, request schemas, response formats, status codes, and error semantics. Consistent contracts reduce client bugs and simplify integration between frontend, backend, and third-party services.

REST principles guide many APIs: resources are represented by URLs, HTTP methods map to actions, and responses are stateless. While not every endpoint must be strictly RESTful, consistency in design is more important than theoretical purity.

Validation is a critical layer in API development. Incoming data should be validated for type, range, and required fields before business logic executes. Good validation prevents corrupt state and provides useful client feedback.

Error handling should return structured, predictable responses. Clients should know how to interpret failures and retry when appropriate. Avoid leaking internal stack details while preserving diagnostic signals in server logs.

Authentication and authorization protect API access. Token-based methods, role checks, and scoped permissions are common. Security should be part of endpoint design from the beginning, not an afterthought.

Versioning helps evolve APIs safely. Backward compatibility strategies (path-based versioning, additive changes, deprecation windows) reduce breaking changes for consumers.

Performance and observability matter in production: request timing, rate limiting, caching, and tracing all support reliability under load. Health checks and readiness endpoints improve deployment confidence.

In AI systems, APIs wrap model inference, prompt routing, retrieval operations, and evaluation results. Contract clarity is crucial because downstream consumers depend on stable response structures.

Mastering API development means combining contract design, validation, security, and observability into a dependable interface that clients can trust.`;

const databaseIntegrationTheory = `Database integration in Python connects application logic to persistent storage systems such as PostgreSQL, MySQL, SQLite, or cloud-managed databases. Robust integration requires careful schema design, query safety, transaction handling, and performance awareness.

Python supports both raw SQL access and ORM-based patterns. Raw SQL gives precise control and can be efficient for complex queries. ORMs like SQLAlchemy improve productivity and model consistency but still require understanding generated queries and indexing behavior.

Connection management is foundational. Applications should use pooled connections where appropriate and ensure connections are closed or returned properly. Leaked connections can degrade system stability quickly under load.

Parameterized queries are mandatory for security. String concatenation in SQL construction introduces injection risks. Safe parameter binding should be a non-negotiable practice.

Transactions protect data integrity across multi-step operations. Commit, rollback, and error handling need to be explicit when operations must succeed or fail together. Ignoring transaction boundaries can create partial writes and inconsistent state.

Schema migrations should be managed systematically with migration tools and version tracking. Manual schema drift across environments causes deployment incidents and hard-to-debug behavior differences.

Performance depends on indexing, query shape, pagination strategy, and avoiding N+1 query patterns. Monitoring slow queries and optimizing high-traffic paths is essential for production reliability.

In AI applications, databases store user profiles, embeddings metadata, job states, feedback signals, and analytics summaries. Data consistency and traceability are critical for reproducible pipeline behavior.

Testing database integration requires realistic fixtures, transaction-isolated tests, and edge-case validation around constraints and rollback behavior. CI pipelines should include integration checks, not only mocked unit tests.

Mastering database integration means treating persistence as a first-class architecture concern. With safe queries, clear transactions, and measured performance, applications remain reliable as usage grows.`;

const pythonProjectsTheory = `Python projects convert isolated language skills into practical, deployable solutions. A strong project combines clean architecture, tested logic, dependency management, observability, and deployment readiness. Building projects is where learners bridge theory into engineering capability.

Successful project execution starts with scope definition and requirements clarity. Teams should define what problem is being solved, who the users are, what inputs/outputs are expected, and what success metrics will be used. Clear scope prevents endless iteration and unclear delivery criteria.

Project structure matters from day one. A maintainable layout separates application code, tests, configuration, scripts, and documentation. Standardized structure improves onboarding and reduces accidental coupling.

Dependency and environment management ensure reproducibility. Virtual environments, pinned dependency files, and environment variable configuration should be part of every project baseline. Reproducibility is essential for collaboration, CI, and deployment consistency.

Implementation should proceed iteratively: build minimal vertical slices, validate behavior, then expand. This reduces integration risk and enables faster feedback. Feature flags or staged rollouts can further reduce production risk.

Quality practices are non-optional in production-grade projects: automated tests, linting, formatting, error handling, and logging. These practices provide confidence when modifying code later.

Deployment readiness includes containerization or platform-specific packaging, health checks, environment separation, and monitoring. A project is not complete until it runs reliably in target environments.

In AI projects, additional concerns include model/version tracking, prompt management, fallback logic, latency budgets, and safety controls. These requirements should be designed into the system early, not patched at the end.

Portfolio value comes from clear problem framing, documented architecture decisions, measurable outcomes, and maintainable code quality. Projects that show engineering discipline stand out more than feature-heavy but unstable demos.

Mastering Python projects means delivering end-to-end systems with reliability, clarity, and repeatability. This is the strongest signal of professional readiness.`;

const javaBasicsTheory = `Java Basics establishes the foundation for building enterprise-grade backend systems. Java is a statically typed, object-oriented language with a strong ecosystem, mature tooling, and long-term support across enterprise environments. Understanding Java basics is essential for full stack development where backend reliability, maintainability, and performance matter.

Java programs compile to bytecode and run on the Java Virtual Machine (JVM), which enables cross-platform portability. This compile-then-run model provides strong compile-time checks and catches many errors earlier than dynamically typed scripting languages. In professional teams, this improves confidence during code review and CI pipelines.

Core basics include syntax, variables, primitive vs reference types, control flow, methods, classes, and package structure. Java naming conventions and project organization are also important because large codebases rely on consistency for readability and onboarding.

Type safety is one of Java's strongest advantages. Explicit type declarations reduce ambiguity and improve IDE tooling, refactoring safety, and static analysis quality. While this can feel verbose to beginners, the tradeoff is stronger maintainability in long-lived systems.

The main method acts as the entry point for standalone applications, while enterprise applications often run inside frameworks or containers that manage lifecycle automatically. Understanding both standalone execution and framework-driven execution helps developers debug startup behavior effectively.

Exception handling, memory management via garbage collection, and package-level access control are also foundational concepts in Java basics. These behaviors influence system stability and error diagnosis in production.

In full stack teams, Java basics support backend APIs, business logic, data processing, and integration layers. Strong fundamentals accelerate learning of Spring Boot, JPA, microservices, and cloud deployment practices.

Mastering Java basics means writing clear, type-safe, maintainable code that scales from small utilities to enterprise services.`;

const javaOopTheory = `Object-Oriented Programming in Java is central to designing maintainable backend systems. Java enforces class-based OOP strongly, making it important to understand classes, objects, constructors, methods, inheritance, polymorphism, and encapsulation in practical software design.

In Java, classes model domain concepts and responsibilities. A well-designed class exposes clear public behavior while protecting internal state. Access modifiers (public, private, protected, package-private) provide explicit visibility control, which is a major difference from more convention-driven languages.

Constructors initialize object state and can be overloaded to support multiple initialization pathways. Good constructor design enforces invariants early, reducing invalid object states that later cause production defects.

Interfaces are a powerful part of Java OOP. They define contracts that multiple classes can implement, supporting loose coupling and testability. Interface-driven architecture is common in enterprise Java and framework-based development.

Inheritance allows reuse but should be used carefully. Deep class hierarchies increase complexity; composition and interface-based design are often safer in large systems. Java's final keyword can protect classes or methods from unintended extension where stability is required.

Polymorphism enables interchangeable implementations behind common contracts, which supports dependency injection and modular architecture. This principle is heavily used in Spring-based applications and service abstractions.

In full stack development, OOP quality directly affects API design, business service boundaries, data model clarity, and test maintainability. Well-structured OOP code makes debugging and feature extension significantly easier.

Mastering Java OOP means designing classes that are cohesive, loosely coupled, and aligned with domain responsibilities.`;

const javaCollectionsTheory = `Java Collections provide structured ways to store, access, and manipulate groups of objects. The Java Collections Framework includes interfaces and implementations such as List, Set, Map, Queue, ArrayList, LinkedList, HashSet, TreeSet, HashMap, and LinkedHashMap.

Choosing the right collection depends on access patterns, ordering requirements, uniqueness constraints, and performance characteristics. For example, ArrayList is efficient for indexed access and appends, while HashSet offers fast membership checks and uniqueness enforcement.

Maps are essential for key-value modeling in service logic, caching, and aggregation. Understanding HashMap behavior, null handling, iteration patterns, and collision implications is important for correctness and performance.

Generics provide compile-time type safety for collections, reducing cast errors and improving readability. Using raw types is discouraged because it weakens static guarantees and increases runtime risk.

Iteration can be done with enhanced for-loops, iterators, or streams. Modifying collections during iteration must be done carefully to avoid ConcurrentModificationException.

Collections utility methods and immutable wrappers can improve safety and code quality. In production, defensive copying and unmodifiable views help enforce boundaries between components.

Concurrency-aware collections like ConcurrentHashMap are important in multithreaded applications. Standard collections are not always thread-safe, so synchronization strategy matters.

In full stack Java, collections are used in DTO mapping, repository results, request processing, and analytics aggregation. Poor collection choices can create performance bottlenecks or subtle bugs.

Mastering collections means selecting data structures intentionally and using them with strong type and mutation discipline.`;

const javaStreamsTheory = `Java Streams provide a declarative approach for processing collections and sequences of data. Instead of imperative loops, streams allow pipelines of operations such as filter, map, sorted, distinct, limit, and collect. This can improve readability for transformation-heavy logic.

Streams support functional-style programming with lambda expressions and method references. Intermediate operations are lazy and only execute when a terminal operation like collect, forEach, reduce, or count is called.

Common stream workflows include filtering records, mapping entities to DTOs, grouping values, aggregating metrics, and composing transformation pipelines. Collectors like toList, groupingBy, mapping, joining, and summarizingInt are widely used.

Parallel streams can leverage multicore processors but require caution. Not all operations are safe or beneficial in parallel execution, especially when side effects or order dependencies exist.

Streams are best for data transformations, not for heavy side-effect logic. Mutable shared state inside stream pipelines should be avoided to preserve correctness and predictability.

Performance should be measured, not assumed. While streams can be expressive, imperative loops may be faster in some hot paths. Maintainability and clarity should guide primary design decisions.

In enterprise Java, streams simplify service-layer transformations, response shaping, and analytics logic. They integrate well with collections and modern Java idioms.

Mastering streams means writing clear, side-effect-aware pipelines and understanding when streams are the right abstraction.`;

const javaExceptionHandlingTheory = `Exception handling in Java is fundamental for building resilient services. Java distinguishes checked and unchecked exceptions, encouraging explicit handling of recoverable conditions while allowing runtime failures to propagate when appropriate.

Try-catch-finally blocks provide controlled error handling and cleanup. Try-with-resources is especially important for automatic resource management with files, streams, and database connections.

Checked exceptions (like IOException, SQLException) must be handled or declared, making failure paths explicit in method contracts. Unchecked exceptions (RuntimeException and subclasses) represent programming errors or unrecoverable runtime issues.

Custom exceptions improve domain clarity by encoding business-specific error semantics. For example, InvalidOrderStateException communicates intent better than generic Exception.

Exception handling should preserve diagnostic context. Catch blocks should log meaningful metadata and either recover safely or rethrow with context. Swallowing exceptions silently is a serious anti-pattern.

In web APIs, exceptions should be translated into structured HTTP responses without leaking sensitive internals. Centralized exception handlers improve consistency and reduce duplication.

In full stack applications, robust exception strategy improves reliability across service, persistence, and integration layers. Clear error contracts also improve frontend/backend coordination.

Mastering Java exception handling means balancing explicit contracts, safe recovery, and high-quality diagnostics.`;

const javaMultithreadingTheory = `Multithreading in Java enables concurrent execution of tasks within a single process. It is central to building responsive applications, high-throughput backends, and scalable systems that handle multiple requests simultaneously.

Java provides multiple ways to work with concurrency: Thread class, Runnable, Callable, ExecutorService, and higher-level utilities in java.util.concurrent. Modern Java applications should usually prefer executors over manually managing raw Thread objects.

Concurrency introduces challenges like race conditions, deadlocks, visibility issues, and thread starvation. Developers must understand synchronized blocks, volatile fields, immutable objects, and thread-safe collections to design correct concurrent behavior.

ExecutorService and thread pools improve resource management by reusing worker threads instead of creating new threads repeatedly. This helps performance and prevents uncontrolled thread growth under load.

Future and CompletableFuture support async workflows where tasks run in the background and results are composed when available. These abstractions are widely used in service orchestration and non-blocking pipelines.

In backend systems, multithreading is used for request handling, batch processing, async notifications, and parallel data operations. Correct design prioritizes safety and predictability over premature performance optimization.

Mastering Java multithreading means writing thread-safe code, understanding coordination primitives, and selecting concurrency abstractions intentionally.`;

const javaJdbcTheory = `JDBC (Java Database Connectivity) is the core Java API for interacting with relational databases. It allows applications to open connections, execute SQL queries, process results, and manage transactions.

The primary JDBC components are DriverManager/DataSource, Connection, PreparedStatement, Statement, ResultSet, and SQLException handling. In production systems, DataSource with connection pooling is preferred over opening raw connections frequently.

PreparedStatement is critical for both safety and performance. It protects against SQL injection by parameterizing inputs and allows database engines to optimize repeated query execution plans.

Transactions ensure data integrity when multiple operations must succeed or fail together. JDBC supports explicit transaction control using setAutoCommit(false), commit, and rollback patterns.

Proper resource management is essential. Connections, statements, and result sets should be closed reliably, typically using try-with-resources to prevent leaks and pool exhaustion.

Even when using ORMs like JPA/Hibernate, understanding JDBC fundamentals is valuable for debugging SQL behavior, tuning query performance, and handling low-level database operations.

Mastering JDBC means writing safe SQL integration logic with proper transaction boundaries, resource cleanup, and performance-aware access patterns.`;

const javaServletsTheory = `Servlets are Java server-side components that handle HTTP requests and generate HTTP responses. They are the foundation of many Java web technologies and historically preceded modern frameworks.

The servlet lifecycle includes initialization (init), request handling (service/doGet/doPost), and destruction (destroy). Containers like Tomcat manage servlet instances, threading, and request dispatching.

HttpServletRequest and HttpServletResponse provide access to request parameters, headers, session data, status codes, and output streams. Correct request parsing and response construction are key to robust web behavior.

Servlets can use filters, listeners, and session management features to implement cross-cutting concerns such as authentication, logging, and request metrics.

Because servlets run in multithreaded containers, shared mutable state in servlet fields can cause race conditions. Request-scoped variables should remain local to handler methods whenever possible.

Although modern applications often use Spring MVC, servlet concepts still matter because those frameworks are built on top of the servlet model.

Mastering servlets means understanding HTTP mechanics, container lifecycle, thread-safety constraints, and foundational web request handling patterns.`;

const javaJspTheory = `JSP (JavaServer Pages) is a server-side view technology used to generate dynamic HTML from Java web applications. JSP pages are translated into servlets by the container and executed to produce response content.

JSP supports expression language (EL), JSTL tags, and custom tags for rendering data and control flow without embedding heavy Java scriptlets directly in view templates. Modern best practice avoids scriptlets to keep views clean.

In MVC-style applications, controllers/servlets prepare model data and forward to JSP pages for presentation. This separation improves maintainability and keeps business logic outside UI templates.

Common JSP concerns include view reuse (includes/tag files), safe output escaping, localization, and form handling patterns.

JSP is less common in newer greenfield systems compared with Thymeleaf or frontend frameworks, but it remains important in legacy enterprise maintenance and migration projects.

Understanding JSP helps developers modernize existing Java monoliths and safely evolve presentation layers without breaking server-rendered workflows.

Mastering JSP means writing clean, secure view templates with proper model binding and minimal logic in the presentation layer.`;

const javaSpringCoreTheory = `Spring Core is the foundation of the Spring ecosystem, centered on Inversion of Control (IoC) and Dependency Injection (DI). It helps build loosely coupled, testable, and configurable Java applications.

IoC containers manage object creation and wiring so components depend on abstractions rather than constructing dependencies manually. This reduces coupling and simplifies testing.

Core concepts include beans, application context, configuration classes, component scanning, stereotype annotations, and constructor injection.

Spring Core also supports externalized configuration and lifecycle callbacks, enabling clean environment-specific behavior across dev, test, and production.

Dependency injection improves maintainability by making dependencies explicit and replaceable. Constructor injection is generally preferred for mandatory dependencies and immutability-friendly design.

Spring Core knowledge is required before Spring MVC, Spring Data, Spring Security, and Spring Boot auto-configuration become intuitive.

Mastering Spring Core means understanding bean lifecycle, DI patterns, configuration strategies, and architecture boundaries in enterprise Java systems.`;

const lessonDefinitions = [
    {
        title: "Python Basics",
        overview: "Python Basics introduces the language philosophy, execution model, project setup standards, and professional habits needed to build production-ready software.",
        beginnerExplanation: "Python is a clean and readable programming language where you can quickly write code, run it, and see immediate results.",
        whyItMatters: "Python is the core language for AI engineering, automation, backend APIs, and data systems.",
        useCases: [
            "Create AI service backends with FastAPI.",
            "Automate repetitive operations with scripts.",
            "Build machine learning pipelines.",
            "Develop data transformation jobs."
        ],
        detailedTheory: pythonBasicsTheory,
        beginnerCode: "print('Hello, NexusAI!')\nname = 'Lahari'\nprint(f'Welcome, {name}!')",
        intermediateCode: "import sys\nprint(sys.version)\nif __name__ == '__main__':\n    print('Script mode enabled')",
        advancedCode: "import sys\ndef check_runtime():\n    return (sys.version_info.major, sys.version_info.minor) >= (3, 10)\nprint('PASS' if check_runtime() else 'FAIL')",
        lineByLine: [
            "print outputs values to the console.",
            "Variables bind names to objects.",
            "f-strings format output clearly.",
            "sys.version exposes runtime version.",
            "__name__ guard controls execution entry.",
            "Version check enforces baseline requirements."
        ],
        commonMistakes: [
            "Skipping virtual environments.",
            "Mixing tabs and spaces.",
            "Ignoring dependency pinning.",
            "Running wrong Python version.",
            "Using unstructured single-file code for large tasks."
        ],
        bestPractices: [
            "Use a virtual environment per project.",
            "Follow PEP 8 formatting.",
            "Add clear module boundaries.",
            "Use reproducible dependency files.",
            "Read and act on traceback details."
        ],
        easyExercise: "Write a script that prints your name, role, and learning goal using f-strings.",
        mediumExercise: "Create a runtime checker that prints PASS only if Python version is 3.10+.",
        hardExercise: "Build an environment audit script that checks version, venv status, and folder structure.",
        quizQuestions: [
            "What is the purpose of a virtual environment?",
            "Why is indentation important in Python?",
            "What does __name__ == '__main__' mean?",
            "Why should dependencies be pinned?",
            "What command checks Python version?"
        ],
        interviewQuestions: [
            "Why is Python widely used for AI engineering?",
            "Explain CPython execution flow.",
            "How do virtual environments prevent issues?",
            "What does PEP 8 standardize?",
            "When do you use script entry guards?",
            "How do you structure a Python project?",
            "What are common environment setup failures?",
            "How do you debug import errors?",
            "What is reproducible setup in Python?",
            "How would you onboard a new Python developer fast?"
        ],
        aiMentorTips: [
            "Environment setup quality saves debugging time later.",
            "Use small scripts to validate assumptions quickly.",
            "Keep code explicit and readable.",
            "Treat errors as feedback, not failure."
        ],
        summaryNotes: [
            "Python is readability-focused and production-capable.",
            "Use isolated environments per project.",
            "Consistency and modularity matter early.",
            "Good fundamentals scale into advanced topics."
        ],
        miniProject: "Build a Python Environment Inspector that validates runtime setup and prints a readiness report.",
        expectedOutput: "Hello, NexusAI!\nWelcome, Lahari!"
    },
    {
        title: "Variables",
        overview: "Variables represent named references to data and are essential to all program state and logic.",
        beginnerExplanation: "A variable is a named container reference that stores a value you can reuse in your program.",
        whyItMatters: "Variables connect all steps in a workflow, from input capture to output generation.",
        useCases: [
            "Store user profile values.",
            "Track model parameters.",
            "Maintain counters and flags.",
            "Prepare API payloads."
        ],
        detailedTheory: variablesTheory,
        beginnerCode: "name = 'Lahari'\nage = 24\nprint(name)\nprint(age)",
        intermediateCode: "profile = {'id': 101, 'role': 'AI Engineer'}\nprofile['experience'] = 3\nprint(profile)",
        advancedCode: "base_prompt = 'Summarize:'\ntext = 'Customer cannot login from mobile.'\nfinal_prompt = f'{base_prompt} {text}'\nprint(final_prompt)",
        lineByLine: [
            "Assignment binds a variable name to an object.",
            "Name clarity improves code readability.",
            "Dictionary fields store related values.",
            "Mutating dictionary updates in place.",
            "f-strings combine variables into clear outputs.",
            "Consistent naming supports debugging and maintenance."
        ],
        commonMistakes: [
            "Using unclear names like x or temp.",
            "Reusing one variable for multiple concepts.",
            "Mutating shared lists unexpectedly.",
            "Using too much global mutable state.",
            "Ignoring scope boundaries."
        ],
        bestPractices: [
            "Use descriptive snake_case names.",
            "Keep variable scope local where possible.",
            "Use constants for fixed values.",
            "Validate assumptions before use.",
            "Avoid hidden shared state mutation."
        ],
        easyExercise: "Create variables for your name, city, and goal, then print them as a formatted sentence.",
        mediumExercise: "Track success and failure counts from a list of status values.",
        hardExercise: "Refactor a script with weak variable names into domain-specific naming.",
        quizQuestions: [
            "What is variable assignment in Python?",
            "What is scope?",
            "What is mutability?",
            "Why do names matter?",
            "When should constants be used?"
        ],
        interviewQuestions: [
            "Explain name binding in Python.",
            "Difference between mutation and reassignment?",
            "How does local scope differ from global scope?",
            "What risks come with global state?",
            "How do naming conventions improve quality?",
            "How can mutable references cause bugs?",
            "What is variable shadowing?",
            "When should you copy data defensively?",
            "How do constants communicate intent?",
            "How do you debug unexpected variable state changes?"
        ],
        aiMentorTips: [
            "Name variables by intent, not brevity.",
            "Keep each variable responsible for one concept.",
            "Use local state over global state whenever possible.",
            "Inspect types during debugging of variable issues."
        ],
        summaryNotes: [
            "Variables are references, not physical boxes.",
            "Scope and mutability define behavior.",
            "Strong naming reduces defects.",
            "Intentional data flow improves maintainability."
        ],
        miniProject: "Build a profile summary generator with validated variable inputs and formatted output.",
        expectedOutput: "Lahari\n24"
    },
    {
        title: "Data Types",
        overview: "Data types determine valid operations, storage behavior, and correctness of calculations and transformations.",
        beginnerExplanation: "Data type means what kind of value you have, like text, number, boolean, or collection.",
        whyItMatters: "Correct data types prevent runtime errors and keep data flows reliable.",
        useCases: [
            "Store user IDs as integers or strings consistently.",
            "Track confidence scores as floats.",
            "Represent payloads with dictionaries.",
            "Maintain ordered outputs with lists."
        ],
        detailedTheory: dataTypesTheory,
        beginnerCode: "name = 'NexusAI'\nusers = 120\nactive = True\nprint(type(name), type(users), type(active))",
        intermediateCode: "scores = [91, 87, 95]\naverage = sum(scores) / len(scores)\nprint(average)",
        advancedCode: "payload = {'user_id': 21, 'skills': ['Python', 'SQL'], 'readiness': 0.82}\nprint(payload['skills'][0])\nprint(type(payload['readiness']))",
        lineByLine: [
            "type() confirms runtime value types.",
            "Lists support ordered numeric processing.",
            "Average calculation returns float.",
            "Dictionaries hold structured heterogeneous data.",
            "Nested access reads specific fields.",
            "Type checks reduce invalid assumptions."
        ],
        commonMistakes: [
            "Mixing string and numeric operations.",
            "Using float where exact precision is required.",
            "Assuming external payload type correctness.",
            "Choosing wrong collection for the task.",
            "Skipping explicit conversion and validation."
        ],
        bestPractices: [
            "Validate incoming data at boundaries.",
            "Use explicit type conversion.",
            "Choose structures by access pattern.",
            "Adopt type hints in larger projects.",
            "Keep data contracts clear across modules."
        ],
        easyExercise: "Create one variable of each main Python scalar type and print their types.",
        mediumExercise: "Convert input strings to numeric values and compute results safely.",
        hardExercise: "Build a payload validator that checks required key types before processing.",
        quizQuestions: [
            "What is the difference between list and tuple?",
            "Why can float comparisons fail?",
            "When should you use set?",
            "What does type() return?",
            "Why validate external payloads?"
        ],
        interviewQuestions: [
            "How do Python data types influence program behavior?",
            "When do you choose tuple over list?",
            "How do you handle float precision concerns?",
            "How do type hints help maintainability?",
            "What is truthiness in Python?",
            "How do you validate JSON data types?",
            "What are immutable core types?",
            "Why explicit conversion is safer than assumptions?",
            "How do you design type-safe service boundaries?",
            "What are common type-related production failures?"
        ],
        aiMentorTips: [
            "Inspect type(value) during debugging sessions.",
            "Treat external data as untrusted until validated.",
            "Design data structures intentionally.",
            "Avoid implicit assumptions about payload fields."
        ],
        summaryNotes: [
            "Type choice impacts correctness and performance.",
            "Collections solve different data problems.",
            "Validation should happen at boundaries.",
            "Type discipline improves reliability at scale."
        ],
        miniProject: "Create a candidate readiness analyzer with strict type validation and score computation.",
        expectedOutput: "<class 'str'> <class 'int'> <class 'bool'>\n91.0"
    },
    {
        title: "Operators",
        overview: "Operators perform arithmetic, comparisons, and logical decisions that power most business rules.",
        beginnerExplanation: "Operators are symbols like +, -, ==, and and that tell Python what to compute or compare.",
        whyItMatters: "Operators drive eligibility, scoring, filtering, and routing in real applications.",
        useCases: [
            "Compute financial totals and taxes.",
            "Evaluate threshold-based eligibility.",
            "Combine conditions for access checks.",
            "Assign labels from confidence values."
        ],
        detailedTheory: operatorsTheory,
        beginnerCode: "a = 10\nb = 3\nprint(a + b)\nprint(a * b)",
        intermediateCode: "score = 78\neligible = score >= 70 and score < 90\nprint(eligible)",
        advancedCode: "confidence = 0.87\npriority = 'high' if confidence > 0.85 else 'normal'\nprint(priority)",
        lineByLine: [
            "Arithmetic operators compute numeric results.",
            "Comparison operators return booleans.",
            "Logical operators combine conditions.",
            "Ternary operator assigns based on a condition.",
            "Parentheses improve readability and safety.",
            "Boundary testing validates operator logic."
        ],
        commonMistakes: [
            "Using = instead of ==.",
            "Overly dense condition expressions.",
            "Direct float equality checks.",
            "Using is instead of == for value comparison.",
            "Ignoring edge thresholds."
        ],
        bestPractices: [
            "Use named booleans for complex rules.",
            "Add parentheses for clarity.",
            "Test boundaries and edge conditions.",
            "Prefer readable expressions over compact tricks.",
            "Keep side effects out of conditions."
        ],
        easyExercise: "Compute sum, product, quotient, and remainder of two numbers.",
        mediumExercise: "Build score band classification with if and comparison operators.",
        hardExercise: "Implement a rule engine function with multiple thresholds and clear boolean decomposition.",
        quizQuestions: [
            "What is / versus // in Python?",
            "What does % do?",
            "What is == used for?",
            "What does short-circuit mean?",
            "How does ternary syntax look?"
        ],
        interviewQuestions: [
            "Explain precedence and why it matters.",
            "Difference between == and is?",
            "How do you compare floats safely?",
            "When do you decompose logical expressions?",
            "What is short-circuit evaluation?",
            "How do membership operators help filtering?",
            "How do you test operator-heavy business rules?",
            "What bugs appear when precedence is misunderstood?",
            "Why should conditions remain readable?",
            "How do you refactor complex condition logic?"
        ],
        aiMentorTips: [
            "Write conditions as readable statements.",
            "Test threshold boundaries explicitly.",
            "Use helper booleans to document intent.",
            "Avoid hidden complexity in one-liners."
        ],
        summaryNotes: [
            "Operators drive calculations and branching decisions.",
            "Precedence influences outcomes.",
            "Float equality requires caution.",
            "Readable logic is maintainable logic."
        ],
        miniProject: "Build an eligibility decision engine with explainable rule outputs.",
        expectedOutput: "13\n30\nTrue\nhigh"
    },
    {
        title: "Control Flow",
        overview: "Control flow determines which code path runs based on conditions and rules.",
        beginnerExplanation: "Control flow means deciding what happens next with if, elif, and else.",
        whyItMatters: "Branching logic directly maps requirements to runtime behavior.",
        useCases: [
            "Route users by role.",
            "Assign grades by score range.",
            "Apply feature gates.",
            "Handle model fallback pathways."
        ],
        detailedTheory: controlFlowTheory,
        beginnerCode: "age = 20\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
        intermediateCode: "score = 84\nif score >= 90:\n    grade = 'A'\nelif score >= 75:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(grade)",
        advancedCode: "role = 'mentor'\nis_active = True\nif role == 'admin':\n    print('Open admin dashboard')\nelif role == 'mentor' and is_active:\n    print('Open mentor workspace')\nelse:\n    print('Open learner home')",
        lineByLine: [
            "if checks first condition and executes when true.",
            "elif checks additional conditions sequentially.",
            "else provides fallback behavior.",
            "Order conditions from specific to general.",
            "Compound conditions encode multi-factor logic.",
            "Named boolean helpers improve readability."
        ],
        commonMistakes: [
            "Broad condition before specific condition.",
            "Deep nesting without guard clauses.",
            "Missing fallback branch.",
            "Duplicating branch logic across functions.",
            "Skipping branch boundary tests."
        ],
        bestPractices: [
            "Use guard clauses for early exits.",
            "Keep branches short and explicit.",
            "Extract repeated logic into helpers.",
            "Log critical branch decisions.",
            "Test all branch paths and edges."
        ],
        easyExercise: "Classify a number as positive, negative, or zero.",
        mediumExercise: "Route users to pages based on role and active status.",
        hardExercise: "Build a ticket router using severity, SLA, and ownership conditions.",
        quizQuestions: [
            "How does Python evaluate if/elif chains?",
            "Why does branch order matter?",
            "What is a guard clause?",
            "When do you use else?",
            "How do you test branch boundaries?"
        ],
        interviewQuestions: [
            "How do you reduce nested branch complexity?",
            "What causes unreachable branches?",
            "How do you design maintainable business rules?",
            "When to use mapping dispatch over if/elif?",
            "How do you test branch-heavy logic?",
            "How does short-circuit affect control flow?",
            "What are common branching anti-patterns?",
            "How do feature flags influence branch design?",
            "How do you debug wrong-path incidents?",
            "Why is branch observability important?"
        ],
        aiMentorTips: [
            "Write branch rules in plain English first.",
            "Prefer clear branching over clever branching.",
            "Use explicit naming for decision variables.",
            "Cover unhappy paths in tests, not just happy paths."
        ],
        summaryNotes: [
            "Control flow is decision architecture.",
            "Condition order can change behavior drastically.",
            "Guard clauses simplify complex code.",
            "Branch coverage protects against regressions."
        ],
        miniProject: "Develop a smart access router for role-based and status-based dashboard navigation.",
        expectedOutput: "Adult\nB\nOpen mentor workspace"
    },
    {
        title: "Loops",
        overview: "Loops execute repeated operations efficiently across sequences and state-driven conditions.",
        beginnerExplanation: "A loop lets you repeat actions without writing the same code again and again.",
        whyItMatters: "Loops power batch processing, retries, iteration, and automation across all engineering systems.",
        useCases: [
            "Process candidate profiles in bulk.",
            "Retry failed API calls with bounded attempts.",
            "Iterate through files and logs.",
            "Run scoring logic over datasets."
        ],
        detailedTheory: loopsTheory,
        beginnerCode: "for i in range(1, 6):\n    print(i)",
        intermediateCode: "skills = ['Python', 'SQL', 'FastAPI']\nfor skill in skills:\n    print(skill)",
        advancedCode: "attempt = 1\nwhile attempt <= 3:\n    print(f'Retry attempt {attempt}')\n    attempt += 1",
        lineByLine: [
            "for loop iterates over a generated range sequence.",
            "Each iteration receives one value at a time.",
            "Loop body executes for every item.",
            "while loop repeats while condition remains true.",
            "Counter increment ensures loop termination.",
            "Bounded retries prevent infinite execution."
        ],
        commonMistakes: [
            "Forgetting to update while loop state.",
            "Mutating a list while iterating over it.",
            "Missing break conditions in retry loops.",
            "Running expensive work inside nested loops blindly.",
            "Ignoring failure handling in iterative API calls."
        ],
        bestPractices: [
            "Prefer for loops for collection iteration.",
            "Use while only when condition-driven repetition is needed.",
            "Add max attempts and timeouts in retry patterns.",
            "Keep loop bodies small and focused.",
            "Test with empty and large inputs."
        ],
        easyExercise: "Print numbers from 1 to 10 using a loop.",
        mediumExercise: "Loop through a list of names and print only names longer than 5 characters.",
        hardExercise: "Implement retry logic with max attempts and break on success.",
        quizQuestions: [
            "What is the difference between for and while?",
            "What does break do?",
            "What does continue do?",
            "How do you avoid infinite loops?",
            "When should you use enumerate?"
        ],
        interviewQuestions: [
            "When do you prefer while over for?",
            "How do you design safe retry loops?",
            "What are common loop performance pitfalls?",
            "How do break and continue affect readability?",
            "How do you handle mutation during iteration?",
            "How do you optimize nested loops?",
            "What edge cases should loop tests include?",
            "How do loops appear in data pipelines?",
            "How do you bound long-running loops?",
            "How do you debug infinite loop incidents?"
        ],
        aiMentorTips: [
            "Always reason about loop exit conditions first.",
            "Use tiny datasets to trace iteration behavior.",
            "Add safeguards for retries and polling loops.",
            "Refactor complex loop logic into helper functions."
        ],
        summaryNotes: [
            "Loops remove repetitive code.",
            "Termination logic is critical.",
            "Use loop controls intentionally.",
            "Test loops under edge inputs."
        ],
        miniProject: "Build a batch candidate processor that loops through profiles, computes score bands, and outputs summaries.",
        expectedOutput: "1\n2\n3\n4\n5\nPython\nSQL\nFastAPI\nRetry attempt 1\nRetry attempt 2\nRetry attempt 3"
    },
    {
        title: "Functions",
        overview: "Functions encapsulate reusable logic and form the core unit of modular Python design.",
        beginnerExplanation: "A function is a named block of code you can call whenever you need that behavior.",
        whyItMatters: "Functions reduce duplication, improve testing, and make codebases maintainable as they grow.",
        useCases: [
            "Validate user input in one place.",
            "Compute scores from multiple criteria.",
            "Encapsulate API request logic.",
            "Build reusable utilities for data transformations."
        ],
        detailedTheory: functionsTheory,
        beginnerCode: "def greet(name):\n    return f'Hello, {name}'\n\nprint(greet('Lahari'))",
        intermediateCode: "def calculate_total(price, tax=0.18):\n    return price + (price * tax)\n\nprint(calculate_total(1000))",
        advancedCode: "def summarize_scores(*scores):\n    return {'count': len(scores), 'max': max(scores), 'avg': sum(scores)/len(scores)}\n\nprint(summarize_scores(78, 90, 88, 95))",
        lineByLine: [
            "def creates a named reusable function block.",
            "Parameters accept dynamic input values.",
            "return sends computed output back to caller.",
            "Default parameters make optional behavior explicit.",
            "*args captures variable positional inputs.",
            "Returned dictionaries package multi-value summaries."
        ],
        commonMistakes: [
            "Writing giant multi-purpose functions.",
            "Using mutable default parameters.",
            "Depending on hidden global state.",
            "Printing instead of returning in core logic.",
            "Unclear function signatures."
        ],
        bestPractices: [
            "Keep each function focused on one job.",
            "Use clear parameter and return naming.",
            "Add docstrings and type hints.",
            "Prefer pure logic where possible.",
            "Test edge cases for every function."
        ],
        easyExercise: "Create a function that returns the square of a number.",
        mediumExercise: "Write a function that normalizes names and returns title-cased values.",
        hardExercise: "Build a scoring function with validation, defaults, and error handling.",
        quizQuestions: [
            "What is the purpose of return?",
            "What are default arguments?",
            "What does *args do?",
            "Why avoid mutable defaults?",
            "Why are small functions preferred?"
        ],
        interviewQuestions: [
            "How do you design a clean function API?",
            "Difference between positional and keyword args?",
            "How do mutable defaults create bugs?",
            "When should functions be pure?",
            "How do type hints help function contracts?",
            "How do you refactor large functions safely?",
            "How do you test function edge cases?",
            "When to use *args and **kwargs?",
            "How do closures capture variables?",
            "How do function boundaries improve architecture?"
        ],
        aiMentorTips: [
            "Name functions by intent and action.",
            "Return data, format output in callers.",
            "Avoid hidden side effects.",
            "Test functions independently before integration."
        ],
        summaryNotes: [
            "Functions are modular building blocks.",
            "Clear signatures communicate contracts.",
            "Small focused functions improve maintainability.",
            "Testing is easier with decomposition."
        ],
        miniProject: "Build a utility toolkit module for profile cleaning, score calculation, and shortlisting decisions.",
        expectedOutput: "Hello, Lahari\n1180.0\n{'count': 4, 'max': 95, 'avg': 87.75}"
    },
    {
        title: "Lists",
        overview: "Lists are ordered, mutable collections used for sequence processing, batching, and transformations.",
        beginnerExplanation: "A list stores multiple items in order, and you can add, remove, or change them.",
        whyItMatters: "Lists are central to API data handling, analytics preparation, and iterative computation workflows.",
        useCases: [
            "Store ordered recommendations.",
            "Process rows from CSV files.",
            "Manage chat history context windows.",
            "Batch records for model scoring."
        ],
        detailedTheory: listsTheory,
        beginnerCode: "skills = ['Python', 'SQL']\nskills.append('FastAPI')\nprint(skills)",
        intermediateCode: "scores = [45, 78, 90, 66]\npassed = [s for s in scores if s >= 70]\nprint(passed)",
        advancedCode: "rows = [{'name': 'A', 'score': 82}, {'name': 'B', 'score': 91}]\nsorted_rows = sorted(rows, key=lambda r: r['score'], reverse=True)\nprint(sorted_rows)",
        lineByLine: [
            "List literals use square brackets.",
            "append adds element at end in-place.",
            "Comprehensions filter and transform elegantly.",
            "sorted returns a new sorted list.",
            "lambda defines inline key extraction.",
            "List semantics support ordered processing workflows."
        ],
        commonMistakes: [
            "Indexing without bounds checks.",
            "Mutating lists during iteration.",
            "Accidental aliasing of list references.",
            "Using nested comprehensions that hurt readability.",
            "Assuming sorted mutates original list."
        ],
        bestPractices: [
            "Use comprehensions for simple transformations.",
            "Copy lists intentionally when needed.",
            "Prefer clear loops for complex logic.",
            "Use proper structures for frequent membership checks.",
            "Test with empty and duplicate-heavy lists."
        ],
        easyExercise: "Create a list of cities and print each city.",
        mediumExercise: "Filter all even numbers from a number list.",
        hardExercise: "Implement ranking of candidate dictionaries by score with tie handling.",
        quizQuestions: [
            "Are lists mutable?",
            "What does list[-1] return?",
            "Difference between append and extend?",
            "Does sorted mutate original list?",
            "What is a list comprehension?"
        ],
        interviewQuestions: [
            "How do list operations scale with size?",
            "When would you choose tuple over list?",
            "How do you avoid mutation side effects?",
            "When are comprehensions inappropriate?",
            "How do you safely remove items while iterating?",
            "How do you sort complex objects by keys?",
            "How do you test list edge cases?",
            "How does list slicing work?",
            "How do you optimize list-heavy code paths?",
            "What are common list anti-patterns in production?"
        ],
        aiMentorTips: [
            "Choose list operations by intent, not habit.",
            "Avoid in-place mutations unless explicit.",
            "Keep comprehensions readable.",
            "Profile before optimizing list performance."
        ],
        summaryNotes: [
            "Lists are ordered and mutable.",
            "Indexing and slicing are powerful but require care.",
            "Comprehensions are concise transformation tools.",
            "Mutation semantics must be intentional."
        ],
        miniProject: "Build a candidate queue manager with filtering, sorting, and export-ready list operations.",
        expectedOutput: "['Python', 'SQL', 'FastAPI']\n[78, 90]\n[{'name': 'B', 'score': 91}, {'name': 'A', 'score': 82}]"
    },
    {
        title: "Tuples",
        overview: "Tuples are ordered immutable collections ideal for fixed records and safe grouped values.",
        beginnerExplanation: "A tuple is like a list that cannot be changed after creation.",
        whyItMatters: "Tuples signal stability and enable hashable structures for reliable keys and metadata.",
        useCases: [
            "Store coordinates as fixed pairs.",
            "Return multiple values from functions.",
            "Use tuple keys in caches.",
            "Represent immutable config identifiers."
        ],
        detailedTheory: tuplesTheory,
        beginnerCode: "point = (10, 20)\nprint(point[0])",
        intermediateCode: "name, role = ('Lahari', 'Engineer')\nprint(name, role)",
        advancedCode: "cache = {('gpt-4.1', 0.2): 'stable'}\nprint(cache[('gpt-4.1', 0.2)])",
        lineByLine: [
            "Tuples use parentheses and comma-separated values.",
            "Tuple indexing works like list indexing.",
            "Unpacking assigns tuple values to variables.",
            "Hashable tuples can be dictionary keys.",
            "Immutability prevents accidental element reassignment.",
            "Tuple intent communicates fixed structure semantics."
        ],
        commonMistakes: [
            "Trying to mutate tuple elements directly.",
            "Forgetting comma in one-item tuple syntax.",
            "Putting mutable objects in hash-key tuples.",
            "Using tuple when mutation is required.",
            "Confusing identity with value grouping."
        ],
        bestPractices: [
            "Use tuples for fixed-size immutable records.",
            "Use unpacking to improve readability.",
            "Prefer named structures when positions become unclear.",
            "Use tuples for stable dictionary keys.",
            "Document tuple field meaning clearly."
        ],
        easyExercise: "Create a tuple of weekdays and print the third value.",
        mediumExercise: "Return min, max, and average from a function as a tuple.",
        hardExercise: "Implement a coordinate cache using tuple keys and safe lookup defaults.",
        quizQuestions: [
            "Are tuples mutable?",
            "How do you create a one-item tuple?",
            "Why can tuples be dict keys?",
            "What is tuple unpacking?",
            "When to use tuple over list?"
        ],
        interviewQuestions: [
            "Difference between tuple and list in semantics?",
            "How does tuple immutability improve safety?",
            "When are tuples hashable?",
            "How do tuple keys support caching patterns?",
            "What pitfalls exist with nested mutable items?",
            "How does unpacking improve readability?",
            "When to migrate tuple to dataclass?",
            "How do you test tuple-based APIs?",
            "What is the one-item tuple gotcha?",
            "How do tuples affect memory and intent?"
        ],
        aiMentorTips: [
            "Use tuples when data should stay stable.",
            "Adopt unpacking to reduce index noise.",
            "Choose tuple keys for deterministic lookup models.",
            "Switch to richer structures when tuple positions become confusing."
        ],
        summaryNotes: [
            "Tuples are ordered and immutable.",
            "Hashable tuples enable key-based patterns.",
            "Unpacking improves code readability.",
            "Use tuples to express fixed semantics."
        ],
        miniProject: "Create a geo-tag inspector that validates coordinate tuples and groups them by region.",
        expectedOutput: "10\nLahari Engineer\nstable"
    },
    {
        title: "Sets",
        overview: "Sets store unique unordered values and excel at deduplication and membership operations.",
        beginnerExplanation: "A set keeps only unique items and is great for checking whether something exists quickly.",
        whyItMatters: "Sets simplify uniqueness logic and improve performance in frequent membership checks.",
        useCases: [
            "Remove duplicate user identifiers.",
            "Compare required and available skills.",
            "Compute overlap between datasets.",
            "Track unique labels in NLP workflows."
        ],
        detailedTheory: setsTheory,
        beginnerCode: "skills = {'Python', 'SQL', 'Python'}\nprint(skills)",
        intermediateCode: "required = {'Python', 'SQL', 'Docker'}\nprofile = {'Python', 'FastAPI', 'Docker'}\nprint(required & profile)",
        advancedCode: "completed = {'variables', 'loops', 'functions'}\nroadmap = {'variables', 'loops', 'functions', 'oop'}\nprint(roadmap - completed)",
        lineByLine: [
            "Set literals use curly braces with unique values.",
            "Duplicate entries collapse automatically.",
            "Intersection operator & finds common elements.",
            "Difference operator - finds missing elements.",
            "Set operations express business logic cleanly.",
            "Use set() to create an empty set explicitly."
        ],
        commonMistakes: [
            "Expecting deterministic display order.",
            "Using {} for empty set instead of set().",
            "Trying to add unhashable elements like lists.",
            "Converting to set and losing intentional duplicates unexpectedly.",
            "Using sets where ordered output is required."
        ],
        bestPractices: [
            "Use sets for uniqueness and membership logic.",
            "Convert to sorted list for display consistency.",
            "Leverage algebraic operations over nested loops.",
            "Use frozenset for immutable set keys when needed.",
            "Validate hashability before insertion."
        ],
        easyExercise: "Create a set from a list with duplicates and print the unique values.",
        mediumExercise: "Given two skill sets, print union, intersection, and difference.",
        hardExercise: "Build a skill-gap analyzer that outputs missing required skills from profile input.",
        quizQuestions: [
            "Can sets contain duplicates?",
            "How do you create an empty set?",
            "What does intersection return?",
            "Why are sets fast for membership checks?",
            "What is frozenset used for?"
        ],
        interviewQuestions: [
            "When should you choose set over list?",
            "How does set membership performance compare to list?",
            "What elements are invalid in a set and why?",
            "How do union and intersection map to business logic?",
            "Why is set order not reliable for UI output?",
            "How do you use frozenset in dictionary keys?",
            "What bugs arise when deduplication is applied blindly?",
            "How do you test set-based algorithms?",
            "How do you preserve order after set operations?",
            "How do sets improve algorithmic complexity?"
        ],
        aiMentorTips: [
            "Reach for sets when uniqueness is the real requirement.",
            "Use set algebra to simplify complex comparisons.",
            "Sort outputs for deterministic presentation.",
            "Benchmark membership-heavy code paths thoughtfully."
        ],
        summaryNotes: [
            "Sets enforce uniqueness automatically.",
            "Membership checks are typically fast.",
            "Set algebra simplifies overlap and gap logic.",
            "Order is not guaranteed in sets."
        ],
        miniProject: "Build a skill gap finder that compares required and candidate skill sets and reports missing skills.",
        expectedOutput: "{'Python', 'SQL'}\n{'Python', 'Docker'}\n{'oop'}"
    },
    {
        title: "Dictionaries",
        overview: "Dictionaries store key-value data and power structured records, payloads, and fast lookups in Python systems.",
        beginnerExplanation: "A dictionary is like a labeled storage box where each value is found by a key name.",
        whyItMatters: "Most API and JSON workflows depend on dictionaries for reliable data exchange.",
        useCases: [
            "Represent API request and response payloads.",
            "Store user profile fields by key.",
            "Map configuration names to values.",
            "Track metrics in keyed counters."
        ],
        detailedTheory: dictionariesTheory,
        beginnerCode: "student = {'name': 'Lahari', 'score': 92}\nprint(student['name'])",
        intermediateCode: "settings = {'theme': 'dark', 'lang': 'en'}\nsettings['lang'] = 'fr'\nprint(settings.get('lang', 'en'))",
        advancedCode: "profiles = [{'id': 1, 'skills': ['Python']}, {'id': 2}]\nnormalized = [p.get('skills', []) for p in profiles]\nprint(normalized)",
        lineByLine: [
            "Dictionary literals use curly braces with key-value pairs.",
            "Keys should be stable and descriptive.",
            "Direct indexing reads required fields.",
            "get() safely reads optional fields with defaults.",
            "Assignment to existing key updates value.",
            "Comprehension/iteration patterns support transformation."
        ],
        commonMistakes: [
            "Using inconsistent key names for same concept.",
            "Assuming optional keys always exist.",
            "Overwriting keys silently during merges.",
            "Deep nesting without validation helpers.",
            "Using mutable/unhashable keys accidentally."
        ],
        bestPractices: [
            "Define clear key contracts and naming conventions.",
            "Use get() for optional fields at boundaries.",
            "Validate dictionary shape before processing.",
            "Prefer helper functions for nested access.",
            "Handle merge collisions intentionally."
        ],
        easyExercise: "Create a dictionary with your name, role, and city, then print each value.",
        mediumExercise: "Given a profile dict, print 'N/A' for any missing optional fields using get().",
        hardExercise: "Build a dictionary normalizer that validates required keys and applies defaults for missing optional keys.",
        quizQuestions: [
            "How are dictionary values accessed safely?",
            "Why must dictionary keys be unique?",
            "What does get(key, default) do?",
            "What happens when assigning to an existing key?",
            "When are nested dictionaries useful?"
        ],
        interviewQuestions: [
            "How do dictionaries differ from lists in access patterns?",
            "How do you prevent KeyError in production code?",
            "How do you model JSON payloads safely?",
            "What are risks of deep nested dictionaries?",
            "How do dictionary merges create hidden bugs?",
            "When would you use defaultdict?",
            "How do you validate dictionary schemas?",
            "How do you optimize dictionary-heavy pipelines?",
            "What key conventions improve maintainability?",
            "How do you test dictionary transformation logic?"
        ],
        aiMentorTips: [
            "Treat dictionary keys as part of your public contract.",
            "Normalize payloads at input boundaries.",
            "Use defaults intentionally, not blindly.",
            "Log missing-key context for faster debugging."
        ],
        summaryNotes: [
            "Dictionaries power structured data in Python.",
            "Key contracts are essential for reliability.",
            "Safe access and validation prevent brittle code.",
            "Merge behavior should be explicit."
        ],
        miniProject: "Create an API payload validator that reads candidate profile dictionaries, applies defaults, and outputs normalized records.",
        expectedOutput: "Lahari\nfr\n[['Python'], []]"
    },
    {
        title: "String Handling",
        overview: "String handling covers text normalization, parsing, formatting, and validation across user and system inputs.",
        beginnerExplanation: "Strings are text values, and string handling means cleaning, checking, and formatting that text correctly.",
        whyItMatters: "Reliable text processing is critical for prompts, logs, APIs, and user-facing communication.",
        useCases: [
            "Normalize user-entered names and emails.",
            "Build dynamic prompts for AI requests.",
            "Parse comma-separated configuration values.",
            "Clean and format log messages."
        ],
        detailedTheory: stringHandlingTheory,
        beginnerCode: "text = '  NexusAI Learning  '\nprint(text.strip())",
        intermediateCode: "email = 'Learner@Example.COM'\nprint(email.lower())\nprint('example' in email.lower())",
        advancedCode: "parts = ['Candidate', 'passed', 'screening']\nmessage = ' | '.join(parts)\nprint(message.replace('screening', 'round-1'))",
        lineByLine: [
            "strip removes unwanted edge whitespace.",
            "lower/case normalization helps consistent comparisons.",
            "Membership checks support simple parsing logic.",
            "join assembles fragments efficiently.",
            "replace performs controlled text substitution.",
            "Formatted output should preserve readability and intent."
        ],
        commonMistakes: [
            "Comparing unnormalized text values.",
            "Using repeated + concatenation in large loops.",
            "Ignoring whitespace-only input edge cases.",
            "Forgetting Unicode/encoding assumptions.",
            "Overusing complex regex for simple tasks."
        ],
        bestPractices: [
            "Normalize text before validation and comparison.",
            "Use f-strings or join for readable formatting.",
            "Handle empty and malformed input explicitly.",
            "Prefer simple string methods when sufficient.",
            "Test with punctuation, casing, and Unicode edge cases."
        ],
        easyExercise: "Trim a sentence, convert it to lowercase, and print the result.",
        mediumExercise: "Split a CSV-style string into tokens and rejoin them with a pipe separator.",
        hardExercise: "Build a text normalizer that standardizes names, removes duplicate spaces, and validates minimum length.",
        quizQuestions: [
            "Are Python strings mutable?",
            "When should you use strip()?",
            "Why is join often better than repeated concatenation?",
            "What does split do?",
            "How do you perform case-insensitive comparisons safely?"
        ],
        interviewQuestions: [
            "How do you design robust text normalization pipelines?",
            "How do you handle Unicode comparison issues?",
            "When should regex be avoided?",
            "How do you test string-heavy business logic?",
            "How do string bugs impact AI prompt quality?",
            "How do you avoid expensive string operations in loops?",
            "What are safe strategies for user-input validation?",
            "How do you sanitize text for logs and outputs?",
            "How do you prevent whitespace-related logic bugs?",
            "How do you design reusable string utility modules?"
        ],
        aiMentorTips: [
            "Normalize early, compare once, and reuse normalized values.",
            "Keep prompt construction deterministic and explicit.",
            "Treat user text as untrusted until validated.",
            "Create helper utilities for repeated string rules."
        ],
        summaryNotes: [
            "String handling is core to data reliability.",
            "Normalization prevents subtle mismatches.",
            "Formatting strategy affects readability and performance.",
            "Edge-case testing is essential for text workflows."
        ],
        miniProject: "Build a profile text cleaner that normalizes names, emails, and free-text summaries before storage.",
        expectedOutput: "NexusAI Learning\nlearner@example.com\nCandidate | passed | round-1"
    },
    {
        title: "Exception Handling",
        overview: "Exception handling ensures runtime failures are managed safely with clear diagnostics and controlled recovery paths.",
        beginnerExplanation: "Exception handling helps your program handle errors instead of crashing unexpectedly.",
        whyItMatters: "Reliable error management is required for stable services, retries, and trustworthy user experiences.",
        useCases: [
            "Handle invalid user input gracefully.",
            "Recover from temporary network/API errors.",
            "Protect file operations from missing-path failures.",
            "Log and classify model response parsing failures."
        ],
        detailedTheory: exceptionHandlingTheory,
        beginnerCode: "try:\n    value = int('42')\n    print(value)\nexcept ValueError:\n    print('Invalid number')",
        intermediateCode: "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 'Cannot divide by zero'\n\nprint(safe_divide(10, 0))",
        advancedCode: "class InvalidScoreError(Exception):\n    pass\n\ndef validate_score(score):\n    if score < 0 or score > 100:\n        raise InvalidScoreError('Score out of range')\n    return 'valid'\n\ntry:\n    print(validate_score(120))\nexcept InvalidScoreError as err:\n    print(err)",
        lineByLine: [
            "try wraps risky operations that may fail at runtime.",
            "except catches expected exception categories.",
            "Specific exception types improve recovery clarity.",
            "Custom exceptions encode domain-specific failure meaning.",
            "raise communicates invalid state explicitly.",
            "Handlers should produce actionable diagnostics."
        ],
        commonMistakes: [
            "Catching broad Exception and hiding root cause.",
            "Swallowing errors without logs or context.",
            "Retrying non-retryable validation failures.",
            "Using exceptions for normal control flow excessively.",
            "Skipping cleanup in failure scenarios."
        ],
        bestPractices: [
            "Catch narrow exception types where possible.",
            "Add contextual logging for operational visibility.",
            "Use finally for guaranteed cleanup.",
            "Raise clear domain errors for invalid state.",
            "Test failure paths, not only success paths."
        ],
        easyExercise: "Convert user input to integer with try/except and print a helpful error message on failure.",
        mediumExercise: "Build safe division with explicit ZeroDivisionError handling and fallback output.",
        hardExercise: "Implement a validator that raises custom exceptions for malformed candidate data and maps them to user-friendly messages.",
        quizQuestions: [
            "What is the purpose of try and except?",
            "Why is catching specific exceptions preferred?",
            "What does finally guarantee?",
            "When should you raise a custom exception?",
            "Why is silent failure dangerous?"
        ],
        interviewQuestions: [
            "How do you design exception strategies for APIs?",
            "When should failures trigger retries versus aborts?",
            "How do custom exceptions improve architecture?",
            "How do you avoid over-catching errors?",
            "What should production error logs include?",
            "How do you test exception behavior comprehensively?",
            "How do you preserve root-cause context?",
            "What are anti-patterns in exception handling?",
            "How does finally support reliability?",
            "How do you map internal exceptions to safe user messages?"
        ],
        aiMentorTips: [
            "Design failure behavior as part of feature design, not as afterthought.",
            "Categorize errors by retryability and severity.",
            "Never swallow exceptions silently in production paths.",
            "Use domain exceptions to make logs and tests clearer."
        ],
        summaryNotes: [
            "Exception handling manages failure intentionally.",
            "Specific handlers are safer than broad catches.",
            "Raise meaningful errors with context.",
            "Failure-path testing is mandatory for reliability."
        ],
        miniProject: "Build a robust data intake function that validates records, raises domain exceptions, logs context, and returns a structured error summary.",
        expectedOutput: "42\nCannot divide by zero\nScore out of range"
    },
    {
        title: "File Handling",
        overview: "File handling covers safe read/write operations, encoding, and resilient path-based workflows.",
        beginnerExplanation: "File handling means opening files, reading or writing content, and closing resources safely.",
        whyItMatters: "Persistent storage workflows depend on reliable file operations across environments.",
        useCases: [
            "Read configuration and prompt template files.",
            "Write processed reports and summaries.",
            "Append structured logs for audit trails.",
            "Stream large datasets for preprocessing."
        ],
        detailedTheory: fileHandlingTheory,
        beginnerCode: "with open('notes.txt', 'w', encoding='utf-8') as file:\n    file.write('NexusAI learning log')",
        intermediateCode: "with open('notes.txt', 'r', encoding='utf-8') as file:\n    content = file.read()\nprint(content)",
        advancedCode: "from pathlib import Path\npath = Path('data') / 'skills.txt'\npath.parent.mkdir(parents=True, exist_ok=True)\npath.write_text('Python\\nSQL', encoding='utf-8')\nprint(path.read_text(encoding='utf-8'))",
        lineByLine: [
            "with context manager ensures file handles close safely.",
            "Mode selection controls read/write behavior.",
            "Explicit UTF-8 encoding improves portability.",
            "Pathlib builds cross-platform paths cleanly.",
            "mkdir prepares directories for safe writes.",
            "Read/write helpers simplify text workflows."
        ],
        commonMistakes: [
            "Forgetting to close files in manual workflows.",
            "Using wrong write mode and overwriting data unexpectedly.",
            "Ignoring encoding mismatches.",
            "Reading huge files fully into memory unnecessarily.",
            "Assuming paths exist without checks."
        ],
        bestPractices: [
            "Prefer with blocks for all file I/O.",
            "Set encoding explicitly for text files.",
            "Use pathlib for safe path operations.",
            "Handle FileNotFoundError and PermissionError clearly.",
            "Use atomic or staged writes for critical files."
        ],
        easyExercise: "Write your learning goal to a text file and read it back.",
        mediumExercise: "Count the number of lines in a text file using a context manager.",
        hardExercise: "Build a report exporter that creates folders, writes UTF-8 summaries, and validates successful output.",
        quizQuestions: [
            "Why is with preferred for file operations?",
            "What does mode 'a' do?",
            "Why specify encoding explicitly?",
            "When should you stream instead of full-read?",
            "How does pathlib improve file handling?"
        ],
        interviewQuestions: [
            "How do you design robust file read/write pipelines?",
            "How do you avoid partial-write corruption risks?",
            "What exceptions are common in file I/O?",
            "How do you process very large files efficiently?",
            "How does encoding impact cross-platform reliability?",
            "Why is pathlib preferred over manual path concatenation?",
            "How do you test file workflow edge cases?",
            "How do you secure file paths against invalid input?",
            "When should writes be append vs overwrite?",
            "How do file operations integrate with AI data pipelines?"
        ],
        aiMentorTips: [
            "Treat file paths and encoding as part of your API contract.",
            "Use context managers and explicit error handling together.",
            "Keep read/write utilities small and reusable.",
            "Test with missing and malformed files early."
        ],
        summaryNotes: [
            "File handling is fundamental for persistence.",
            "Use with and UTF-8 by default.",
            "Pathlib improves safety and clarity.",
            "I/O failures should be handled explicitly."
        ],
        miniProject: "Create a learning report writer that stores progress snapshots to disk and safely reloads them for display.",
        expectedOutput: "NexusAI learning log\nPython\nSQL"
    },
    {
        title: "Modules",
        overview: "Modules organize Python code into reusable files and packages for scalable architecture.",
        beginnerExplanation: "A module is a Python file you can import to reuse functions and variables in other files.",
        whyItMatters: "Modular design keeps code maintainable, testable, and ready for team collaboration.",
        useCases: [
            "Separate utilities from business logic.",
            "Organize API, data, and model layers.",
            "Reuse shared validation functions across services.",
            "Package project features into structured folders."
        ],
        detailedTheory: modulesTheory,
        beginnerCode: "# math_utils.py\ndef add(a, b):\n    return a + b",
        intermediateCode: "import math_utils\nprint(math_utils.add(2, 3))",
        advancedCode: "from pathlib import Path\n\nif __name__ == '__main__':\n    print('Running module directly')\n    print(Path('.').resolve())",
        lineByLine: [
            "Module files encapsulate related reusable logic.",
            "import module keeps namespace origin explicit.",
            "Dot access clarifies symbol ownership.",
            "__name__ guard separates direct-run from import usage.",
            "Package structure communicates architectural boundaries.",
            "Clear module APIs simplify testing and reuse."
        ],
        commonMistakes: [
            "Using wildcard imports that hide dependencies.",
            "Creating circular imports between modules.",
            "Packing too many responsibilities into one file.",
            "Mixing script-only logic with reusable APIs.",
            "Unclear package boundaries in growing projects."
        ],
        bestPractices: [
            "Group modules by responsibility and domain.",
            "Prefer explicit imports over wildcard imports.",
            "Use __name__ guard for executable module checks.",
            "Keep module interfaces narrow and well-named.",
            "Refactor shared logic into common utility modules."
        ],
        easyExercise: "Create a helper module with one function and import it in another file.",
        mediumExercise: "Split a script into two modules: validation and processing.",
        hardExercise: "Refactor a monolithic script into a package with clear module boundaries and no circular imports.",
        quizQuestions: [
            "What is a Python module?",
            "Why avoid wildcard imports?",
            "What does __name__ == '__main__' do?",
            "What is a package in Python?",
            "How do modules improve maintainability?"
        ],
        interviewQuestions: [
            "How do you design module boundaries in large projects?",
            "How do you diagnose circular import issues?",
            "When do you use from x import y vs import x?",
            "How do packages support team-scale development?",
            "How do modules improve test isolation?",
            "What are signs a module is overloaded?",
            "How do you structure AI application modules?",
            "How do import choices impact readability?",
            "How do you migrate from script to package architecture?",
            "How do you enforce dependency direction across modules?"
        ],
        aiMentorTips: [
            "Design modules around ownership and responsibility.",
            "Keep imports explicit for maintainable dependency graphs.",
            "Separate executable entrypoints from reusable logic.",
            "Refactor early when module complexity starts to grow."
        ],
        summaryNotes: [
            "Modules are the core of scalable Python organization.",
            "Explicit imports improve clarity.",
            "Packages communicate architecture and ownership.",
            "Clean module boundaries accelerate testing and change."
        ],
        miniProject: "Build a mini package with modules for validation, scoring, and reporting, then wire a main entry script that composes them.",
        expectedOutput: "5\nRunning module directly"
    },
    {
        title: "Packages",
        overview: "Packages group related modules into reusable, scalable architecture units.",
        beginnerExplanation: "A package is a folder of Python modules that helps keep projects organized.",
        whyItMatters: "Package structure is essential for clean imports, maintainability, and teamwork at scale.",
        useCases: [
            "Organize app code into domain folders.",
            "Expose stable APIs for shared utilities.",
            "Separate data, service, and UI logic layers.",
            "Prepare projects for testing and deployment workflows."
        ],
        detailedTheory: packagesTheory,
        beginnerCode: "# project/utils/math_tools.py\ndef add(a, b):\n    return a + b",
        intermediateCode: "# project/main.py\nfrom utils.math_tools import add\nprint(add(2, 3))",
        advancedCode: "# project/content/__init__.py\nfrom .loader import load_lessons\n\n# project/app.py\nfrom content import load_lessons\nprint(load_lessons())",
        lineByLine: [
            "Package folders collect related modules by responsibility.",
            "__init__.py can expose package public API.",
            "Absolute imports improve readability across the codebase.",
            "Public package interfaces hide internal implementation details.",
            "Layered package design reduces cross-module coupling.",
            "Consistent import strategy avoids runtime surprises."
        ],
        commonMistakes: [
            "Creating unclear package boundaries.",
            "Mixing absolute and relative imports inconsistently.",
            "Leaking internal modules as public API.",
            "Introducing circular imports across packages.",
            "Over-fragmenting into too many tiny packages."
        ],
        bestPractices: [
            "Design packages around real domain responsibilities.",
            "Keep package APIs explicit and stable.",
            "Use consistent import conventions.",
            "Prevent circular dependencies via clear layering.",
            "Document package structure for contributors."
        ],
        easyExercise: "Create a package with one module and import one function from it.",
        mediumExercise: "Split utility and business logic into two packages and wire imports cleanly.",
        hardExercise: "Refactor a flat script project into a layered package structure with public interfaces.",
        quizQuestions: [
            "What is a Python package?",
            "Why is __init__.py useful?",
            "When should you use absolute imports?",
            "How do packages improve maintainability?",
            "What causes circular import issues?"
        ],
        interviewQuestions: [
            "How do you design package boundaries in a growing codebase?",
            "How do you expose package public APIs safely?",
            "When do you use relative imports over absolute imports?",
            "How do packages support testability?",
            "How do you avoid circular dependencies between packages?",
            "How would you migrate a monolithic script into packages?",
            "How does package design affect onboarding speed?",
            "How do you enforce dependency direction across packages?",
            "How do you version internal package APIs?",
            "How do you detect package-level architecture drift?"
        ],
        aiMentorTips: [
            "Treat package layout as architecture, not folder cosmetics.",
            "Expose only what callers need from each package.",
            "Keep import paths predictable and consistent.",
            "Refactor package boundaries early as complexity grows."
        ],
        summaryNotes: [
            "Packages scale Python projects safely.",
            "Clear boundaries reduce coupling and confusion.",
            "Public package APIs protect internals.",
            "Consistent imports improve reliability."
        ],
        miniProject: "Build a small learning_app package with subpackages for content, progress, and reporting, then expose a clean top-level API.",
        expectedOutput: "5\n['lesson-1', 'lesson-2']"
    },
    {
        title: "OOP",
        overview: "Object-oriented programming models systems with classes and objects that combine state with behavior.",
        beginnerExplanation: "OOP means creating classes and using objects to represent real things in your application.",
        whyItMatters: "OOP helps organize complex software into reusable, testable components.",
        useCases: [
            "Model learners, courses, and enrollments.",
            "Encapsulate service adapters with configuration.",
            "Build workflow objects for processing tasks.",
            "Represent domain entities with lifecycle behavior."
        ],
        detailedTheory: oopTheory,
        beginnerCode: "class Learner:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f'Hi, I am {self.name}'\n\nprint(Learner('Lahari').greet())",
        intermediateCode: "class ProgressTracker:\n    def __init__(self):\n        self.completed = 0\n\n    def mark_complete(self):\n        self.completed += 1\n\ntracker = ProgressTracker()\ntracker.mark_complete()\nprint(tracker.completed)",
        advancedCode: "class ModelClient:\n    def __init__(self, provider, timeout):\n        self.provider = provider\n        self.timeout = timeout\n\n    def describe(self):\n        return f'{self.provider} client (timeout={self.timeout})'\n\nprint(ModelClient('OpenAI', 30).describe())",
        lineByLine: [
            "Class definitions capture shared behavior templates.",
            "__init__ initializes object state reliably.",
            "self references current object instance data.",
            "Methods define behavior tied to class state.",
            "Objects are created from classes as instances.",
            "Focused classes improve readability and testability."
        ],
        commonMistakes: [
            "Creating God classes with too many responsibilities.",
            "Mixing unrelated behavior in one class.",
            "Using classes where simple functions are better.",
            "Hiding side effects in methods unexpectedly.",
            "Weak constructor validation and invalid initial state."
        ],
        bestPractices: [
            "Design classes around single responsibility.",
            "Keep constructors explicit and validated.",
            "Prefer composition when it simplifies design.",
            "Name classes and methods by domain intent.",
            "Test public behavior, not internal implementation."
        ],
        easyExercise: "Create a Course class with title and duration, then print both fields.",
        mediumExercise: "Build a Student class with enroll and complete_lesson methods.",
        hardExercise: "Design a small object model for course, lesson, and progress relationships with clear responsibilities.",
        quizQuestions: [
            "What is a class in Python?",
            "What is an object instance?",
            "What does self represent?",
            "Why is __init__ important?",
            "When is OOP a good fit?"
        ],
        interviewQuestions: [
            "How do you decide between procedural and object-oriented design?",
            "What are signs a class has too many responsibilities?",
            "How does composition differ from inheritance?",
            "How do you design testable classes?",
            "How do constructor invariants improve reliability?",
            "How do you avoid hidden side effects in methods?",
            "How does OOP help with large team collaboration?",
            "How do you refactor a God class?",
            "How do you model domain entities with OOP?",
            "How do you enforce interface clarity in classes?"
        ],
        aiMentorTips: [
            "Use OOP when it clarifies domain modeling, not by default.",
            "Keep class APIs small and predictable.",
            "Model behavior where data lives.",
            "Refactor classes early when responsibilities drift."
        ],
        summaryNotes: [
            "OOP combines state and behavior effectively.",
            "Class design quality drives maintainability.",
            "Single responsibility keeps objects manageable.",
            "Good OOP improves extensibility and tests."
        ],
        miniProject: "Create an object-based learning domain with Learner, Course, and ProgressTracker classes that collaborate cleanly.",
        expectedOutput: "Hi, I am Lahari\n1\nOpenAI client (timeout=30)"
    },
    {
        title: "Inheritance",
        overview: "Inheritance enables class specialization by reusing and extending parent class behavior.",
        beginnerExplanation: "Inheritance lets one class use features of another class and add its own features.",
        whyItMatters: "It reduces duplication when several classes share a common base behavior.",
        useCases: [
            "Create shared base models for domain entities.",
            "Extend common service behavior with provider-specific logic.",
            "Build framework-style plugin hierarchies.",
            "Apply shared validation in parent classes."
        ],
        detailedTheory: inheritanceTheory,
        beginnerCode: "class Person:\n    def speak(self):\n        return 'Hello'\n\nclass Mentor(Person):\n    pass\n\nprint(Mentor().speak())",
        intermediateCode: "class Animal:\n    def sound(self):\n        return 'generic'\n\nclass Dog(Animal):\n    def sound(self):\n        return 'bark'\n\nprint(Dog().sound())",
        advancedCode: "class BaseClient:\n    def request(self):\n        return 'base-request'\n\nclass TimedClient(BaseClient):\n    def request(self):\n        parent = super().request()\n        return parent + ' with-timeout'\n\nprint(TimedClient().request())",
        lineByLine: [
            "Child classes declare parent in class definition.",
            "Inherited methods are available unless overridden.",
            "Overriding customizes behavior for child context.",
            "super() calls parent implementation safely.",
            "Shallow hierarchies are easier to maintain.",
            "Use inheritance for true subtype relationships."
        ],
        commonMistakes: [
            "Using inheritance where composition is better.",
            "Deep inheritance trees with unclear behavior.",
            "Overriding methods without preserving contracts.",
            "Skipping super() in child initialization.",
            "Coupling child classes to parent internals."
        ],
        bestPractices: [
            "Keep inheritance hierarchies shallow and intentional.",
            "Use super() when extending parent behavior.",
            "Document parent contracts clearly.",
            "Favor composition if subtype relation is weak.",
            "Test base and child behavior boundaries."
        ],
        easyExercise: "Create a Vehicle base class and a Car child class that inherits one method.",
        mediumExercise: "Override one parent method in a child class and compare outputs.",
        hardExercise: "Design a base notification class with child classes for email and SMS that extend behavior cleanly.",
        quizQuestions: [
            "What is inheritance in Python?",
            "What does super() do?",
            "When should a child override parent methods?",
            "What is method resolution order?",
            "When is composition preferable to inheritance?"
        ],
        interviewQuestions: [
            "How do you identify true is-a relationships?",
            "What are risks of deep inheritance hierarchies?",
            "How do you preserve parent contracts while overriding?",
            "How does Python MRO affect behavior lookup?",
            "How do you test inheritance-heavy code safely?",
            "When does inheritance become a maintenance burden?",
            "How does constructor chaining work with super()?",
            "How do you refactor from inheritance to composition?",
            "How do you avoid parent-child tight coupling?",
            "How do abstract base classes fit inheritance design?"
        ],
        aiMentorTips: [
            "Start with composition, use inheritance only when subtype semantics are clear.",
            "Keep parent interfaces stable and minimal.",
            "Override with intent and test contract behavior.",
            "Avoid deep trees unless architecture clearly needs them."
        ],
        summaryNotes: [
            "Inheritance supports reuse through specialization.",
            "super() is key for safe extension.",
            "Shallow, clear hierarchies are maintainable.",
            "Composition is often the safer alternative."
        ],
        miniProject: "Create a base ContentItem class and derived VideoLesson, QuizLesson, and ProjectLesson classes with shared and specialized methods.",
        expectedOutput: "Hello\nbark\nbase-request with-timeout"
    },
    {
        title: "Polymorphism",
        overview: "Polymorphism allows different classes to be used through the same interface with type-specific behavior.",
        beginnerExplanation: "Polymorphism means many object types can respond to the same method name in their own way.",
        whyItMatters: "It makes systems extensible without changing caller code for every new type.",
        useCases: [
            "Use multiple payment processors via one charge method.",
            "Support different model providers with one generate interface.",
            "Handle various notification channels uniformly.",
            "Process diverse content items through one render contract."
        ],
        detailedTheory: polymorphismTheory,
        beginnerCode: "class Cat:\n    def speak(self):\n        return 'meow'\n\nclass Dog:\n    def speak(self):\n        return 'bark'\n\nfor animal in [Cat(), Dog()]:\n    print(animal.speak())",
        intermediateCode: "class EmailSender:\n    def send(self, msg):\n        return f'email: {msg}'\n\nclass SmsSender:\n    def send(self, msg):\n        return f'sms: {msg}'\n\ndef notify(sender, msg):\n    return sender.send(msg)\n\nprint(notify(EmailSender(), 'hello'))",
        advancedCode: "class OpenAIClient:\n    def generate(self, prompt):\n        return f'openai::{prompt}'\n\nclass AzureClient:\n    def generate(self, prompt):\n        return f'azure::{prompt}'\n\ndef run(client):\n    return client.generate('summarize')\n\nprint(run(OpenAIClient()))\nprint(run(AzureClient()))",
        lineByLine: [
            "Different classes implement same method signature.",
            "Caller code relies on behavior contract, not concrete type.",
            "Duck typing enables flexible object substitution.",
            "Shared interfaces remove repetitive type branching.",
            "New implementations can be added with minimal caller changes.",
            "Contract consistency is required for safe polymorphism."
        ],
        commonMistakes: [
            "Inconsistent method signatures across implementations.",
            "Returning incompatible output formats.",
            "Reintroducing type checks in caller code.",
            "Hidden side effects varying by implementation.",
            "Weak interface contracts and documentation."
        ],
        bestPractices: [
            "Define and document interface contracts clearly.",
            "Keep method signatures consistent.",
            "Validate outputs in contract tests.",
            "Avoid type-based branching in polymorphic callers.",
            "Add new implementations without changing core orchestrators."
        ],
        easyExercise: "Create two classes with the same method and print each result in one loop.",
        mediumExercise: "Build one notifier function that accepts both EmailSender and SmsSender objects.",
        hardExercise: "Design a provider interface for three AI clients and a shared pipeline caller with contract tests.",
        quizQuestions: [
            "What is polymorphism?",
            "How does duck typing support polymorphism in Python?",
            "Why are shared interfaces important?",
            "How does polymorphism reduce conditionals?",
            "What can break polymorphic systems?"
        ],
        interviewQuestions: [
            "How do you design robust polymorphic interfaces?",
            "How do you enforce contract consistency across implementations?",
            "What role do abstract base classes play?",
            "How does polymorphism improve extensibility?",
            "How do you test polymorphic behavior effectively?",
            "When can polymorphism be overused?",
            "How do output contract mismatches cause incidents?",
            "How do you migrate from type-branching to polymorphism?",
            "How does duck typing differ from nominal typing?",
            "How do you add new implementations safely in production?"
        ],
        aiMentorTips: [
            "Design behavior contracts first, then implementations.",
            "Keep polymorphic methods predictable in inputs and outputs.",
            "Use contract tests for every implementation.",
            "Remove explicit type checks from orchestration code."
        ],
        summaryNotes: [
            "Polymorphism enables interchangeable behavior.",
            "Contracts are more important than concrete class names.",
            "It reduces branching and improves extension speed.",
            "Testing contracts is essential for safety."
        ],
        miniProject: "Build a multi-provider text generation pipeline where each provider class implements a shared generate interface.",
        expectedOutput: "meow\nbark\nemail: hello\nopenai::summarize\nazure::summarize"
    },
    {
        title: "Encapsulation",
        overview: "Encapsulation protects class state and exposes controlled behavior through stable public interfaces.",
        beginnerExplanation: "Encapsulation means keeping object data safe and changing it through methods instead of random direct access.",
        whyItMatters: "It prevents invalid state changes and makes refactoring safer in larger systems.",
        useCases: [
            "Validate score updates in one controlled method.",
            "Protect sensitive fields from accidental modification.",
            "Expose read-only derived values through properties.",
            "Enforce valid state transitions in workflows."
        ],
        detailedTheory: encapsulationTheory,
        beginnerCode: "class Account:\n    def __init__(self):\n        self._balance = 0\n\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount\n\n    def get_balance(self):\n        return self._balance\n\nacc = Account()\nacc.deposit(50)\nprint(acc.get_balance())",
        intermediateCode: "class Learner:\n    def __init__(self, name):\n        self._name = name\n\n    @property\n    def name(self):\n        return self._name\n\nprint(Learner('Lahari').name)",
        advancedCode: "class Score:\n    def __init__(self):\n        self.__value = 0\n\n    def set_value(self, v):\n        if 0 <= v <= 100:\n            self.__value = v\n\n    def get_value(self):\n        return self.__value\n\ns = Score()\ns.set_value(88)\nprint(s.get_value())",
        lineByLine: [
            "Protected attributes signal internal access by convention.",
            "Methods enforce validation before state mutation.",
            "Properties expose controlled read/write behavior.",
            "Name-mangled attributes reduce accidental direct access.",
            "Public APIs should express allowed operations clearly.",
            "Encapsulation preserves object invariants over time."
        ],
        commonMistakes: [
            "Directly mutating internal fields everywhere.",
            "Skipping validation in state-changing methods.",
            "Exposing mutable internals to callers.",
            "Overcomplicating APIs with unnecessary access restrictions.",
            "Testing private internals instead of public behavior."
        ],
        bestPractices: [
            "Expose clear public methods for state transitions.",
            "Centralize validation where data changes.",
            "Use properties for controlled attribute access.",
            "Hide implementation details behind stable APIs.",
            "Test behavior through public contracts."
        ],
        easyExercise: "Create a class with a private/protected field and a getter method.",
        mediumExercise: "Add validation to a setter so values stay within a valid range.",
        hardExercise: "Design a workflow class that permits only valid status transitions through dedicated methods.",
        quizQuestions: [
            "What is encapsulation?",
            "Why use protected/private-style attributes?",
            "How do properties help encapsulation?",
            "Why centralize validation in methods?",
            "What risks come from exposing internals directly?"
        ],
        interviewQuestions: [
            "How does encapsulation improve long-term maintainability?",
            "How do you balance encapsulation with usability?",
            "When should you use properties instead of plain fields?",
            "How do you prevent invalid state transitions?",
            "How do you test encapsulated objects properly?",
            "How does Python's visibility model differ from strict OOP languages?",
            "How do you avoid leaking mutable internals?",
            "How do you refactor code that bypasses encapsulation?",
            "How does encapsulation support security-sensitive data handling?",
            "How do stable public APIs reduce refactor risk?"
        ],
        aiMentorTips: [
            "Design object APIs around valid actions, not raw field mutation.",
            "Use validation at every state change boundary.",
            "Treat internals as replaceable implementation details.",
            "Keep external contracts stable while evolving internals."
        ],
        summaryNotes: [
            "Encapsulation protects data integrity.",
            "Public APIs should control state transitions.",
            "Properties and methods enable safe evolution.",
            "Behavior-focused tests make refactoring safer."
        ],
        miniProject: "Implement an Enrollment class with protected state and methods that validate enroll, complete, and cancel transitions.",
        expectedOutput: "50\nLahari\n88"
    },
    {
        title: "List Comprehensions",
        overview: "List comprehensions provide concise, expressive list transformations with optional filtering.",
        beginnerExplanation: "A list comprehension is a short way to build a new list from existing data.",
        whyItMatters: "They reduce repetitive loops and make data transformation code cleaner.",
        useCases: [
            "Transform API records into display-ready fields.",
            "Filter valid candidates from mixed inputs.",
            "Extract model scores from response lists.",
            "Normalize strings before storage."
        ],
        detailedTheory: listComprehensionsTheory,
        beginnerCode: "numbers = [1, 2, 3, 4, 5]\nsquares = [n * n for n in numbers]\nprint(squares)",
        intermediateCode: "words = [' AI ', ' Python ', ' APIs ']\nclean = [w.strip().lower() for w in words]\nprint(clean)",
        advancedCode: "records = [{'name': 'A', 'score': 82}, {'name': 'B', 'score': 64}, {'name': 'C', 'score': 91}]\npassed = [r['name'] for r in records if r['score'] >= 80]\nprint(passed)",
        lineByLine: [
            "Comprehension output expression defines transformed value.",
            "for clause defines iteration source.",
            "Optional if clause filters items.",
            "Result is a new list without mutating source.",
            "Comprehensions are ideal for simple transformations.",
            "Complex logic may be clearer with explicit loops."
        ],
        commonMistakes: [
            "Writing deeply nested comprehensions that hurt readability.",
            "Using comprehensions for side effects.",
            "Placing condition logic incorrectly.",
            "Shadowing variable names unintentionally.",
            "Ignoring memory impact on very large datasets."
        ],
        bestPractices: [
            "Use comprehensions for clear one-pass transforms.",
            "Keep expressions short and understandable.",
            "Switch to loops when logic becomes complex.",
            "Prefer meaningful variable names.",
            "Profile and optimize only when needed."
        ],
        easyExercise: "Create a list of even numbers from 1 to 20 using a comprehension.",
        mediumExercise: "From a list of names, produce uppercase names with length > 4.",
        hardExercise: "Transform a list of dictionaries into sorted tuples of (name, grade_band) using filtering and mapping.",
        quizQuestions: [
            "What is the basic syntax of a list comprehension?",
            "Where does the filter condition go?",
            "Does a list comprehension mutate the original list?",
            "When should loops be preferred over comprehensions?",
            "Why are comprehensions useful in data processing?"
        ],
        interviewQuestions: [
            "How do list comprehensions improve readability?",
            "When can comprehensions hurt maintainability?",
            "How do you convert nested loops to comprehensions safely?",
            "How do comprehensions compare to map/filter for clarity?",
            "What performance tradeoffs exist with comprehensions?",
            "How do you avoid variable shadowing in comprehensions?",
            "How do you test comprehension-heavy transformations?",
            "When should generator expressions be used instead?",
            "How do comprehensions fit ETL pipelines?",
            "What code review standards would you set for comprehension usage?"
        ],
        aiMentorTips: [
            "Aim for concise but readable transformations.",
            "Favor one responsibility per comprehension.",
            "Avoid clever one-liners that hide business rules.",
            "Use tests to lock expected transformation behavior."
        ],
        summaryNotes: [
            "List comprehensions simplify list creation.",
            "They combine mapping and filtering elegantly.",
            "Readability should guide usage.",
            "Use generators when memory efficiency is needed."
        ],
        miniProject: "Build a profile transformation utility that cleans, filters, and ranks learner records using comprehensions.",
        expectedOutput: "[1, 4, 9, 16, 25]\n['ai', 'python', 'apis']\n['A', 'C']"
    },
    {
        title: "Multithreading",
        overview: "Multithreading enables concurrent execution for I/O-bound Python tasks.",
        beginnerExplanation: "Multithreading lets your program run multiple tasks at the same time, especially while waiting on I/O.",
        whyItMatters: "It improves responsiveness and throughput for network and file-heavy workloads.",
        useCases: [
            "Parallel API fetch operations.",
            "Concurrent log/file writes.",
            "Background preprocessing while serving requests.",
            "Handling many I/O waits in one process."
        ],
        detailedTheory: multithreadingTheory,
        beginnerCode: "import threading\n\ndef task(name):\n    print(f'Start {name}')\n\nt1 = threading.Thread(target=task, args=('A',))\nt2 = threading.Thread(target=task, args=('B',))\nt1.start(); t2.start()\nt1.join(); t2.join()",
        intermediateCode: "from concurrent.futures import ThreadPoolExecutor\n\ndef fetch(i):\n    return f'result-{i}'\n\nwith ThreadPoolExecutor(max_workers=3) as ex:\n    print(list(ex.map(fetch, [1, 2, 3])))",
        advancedCode: "import threading\ncount = 0\nlock = threading.Lock()\n\ndef safe_inc():\n    global count\n    for _ in range(1000):\n        with lock:\n            count += 1\n\nthreads = [threading.Thread(target=safe_inc) for _ in range(3)]\n[t.start() for t in threads]\n[t.join() for t in threads]\nprint(count)",
        lineByLine: [
            "Threads run functions concurrently for I/O overlap.",
            "start launches thread execution.",
            "join waits for completion before continuing.",
            "ThreadPoolExecutor simplifies thread orchestration.",
            "Locks protect shared mutable state from race conditions.",
            "Deterministic outcomes require synchronization discipline."
        ],
        commonMistakes: [
            "Ignoring race conditions on shared data.",
            "Creating too many threads without limits.",
            "Forgetting join calls and exiting early.",
            "Using threads for heavy CPU-bound work under GIL.",
            "Missing timeout and cancellation strategy."
        ],
        bestPractices: [
            "Use threads mainly for I/O-bound tasks.",
            "Guard shared state with synchronization primitives.",
            "Prefer ThreadPoolExecutor for manageability.",
            "Log thread context for diagnostics.",
            "Test concurrency scenarios under load."
        ],
        easyExercise: "Create two threads that print different messages and wait for both to finish.",
        mediumExercise: "Use ThreadPoolExecutor to process five mock network tasks concurrently.",
        hardExercise: "Implement a thread-safe counter and verify deterministic output with concurrent increments.",
        quizQuestions: [
            "What is multithreading used for in Python?",
            "What does join do?",
            "Why is a lock needed?",
            "How does GIL affect CPU-bound threads?",
            "When should ThreadPoolExecutor be preferred?"
        ],
        interviewQuestions: [
            "How does Python threading differ from multiprocessing?",
            "What is a race condition and how do you prevent it?",
            "How do you choose max worker thread count?",
            "How does GIL impact architecture decisions?",
            "What are thread-safe design patterns in Python?",
            "How do you debug intermittent concurrency bugs?",
            "How do you add timeouts to threaded workflows?",
            "When should async IO be preferred over threads?",
            "How do you monitor thread-heavy production services?",
            "How do you test thread behavior reliably in CI?"
        ],
        aiMentorTips: [
            "Use threading where wait time dominates compute time.",
            "Protect shared data explicitly.",
            "Keep concurrent tasks small and well-defined.",
            "Instrument concurrency code with clear logs."
        ],
        summaryNotes: [
            "Multithreading helps I/O-bound performance.",
            "Synchronization prevents race conditions.",
            "GIL limits CPU-bound parallel speedup.",
            "Thread pools simplify concurrency management."
        ],
        miniProject: "Build a concurrent profile fetcher that pulls data from multiple mock endpoints and aggregates results safely.",
        expectedOutput: "Start A\nStart B\n['result-1', 'result-2', 'result-3']\n3000"
    },
    {
        title: "API Development",
        overview: "API development in Python creates reliable HTTP interfaces for applications and services.",
        beginnerExplanation: "An API lets apps communicate using endpoints that send and receive data.",
        whyItMatters: "APIs are the backbone of modern web, mobile, and AI-integrated systems.",
        useCases: [
            "Serve learner progress to dashboards.",
            "Expose model inference endpoints.",
            "Integrate external services through REST calls.",
            "Power microservices communication."
        ],
        detailedTheory: apiDevelopmentTheory,
        beginnerCode: "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/health')\ndef health():\n    return {'status': 'ok'}\n\n# app.run()",
        intermediateCode: "from flask import Flask, request\napp = Flask(__name__)\n\n@app.post('/sum')\ndef sum_api():\n    data = request.get_json()\n    return {'total': data['a'] + data['b']}\n\n# app.run()",
        advancedCode: "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Payload(BaseModel):\n    text: str\n\n@app.post('/analyze')\ndef analyze(payload: Payload):\n    return {'chars': len(payload.text), 'normalized': payload.text.lower()}",
        lineByLine: [
            "Routes map URLs and methods to handlers.",
            "Request parsing extracts client-provided data.",
            "Validation enforces payload contracts.",
            "Handlers return structured JSON responses.",
            "Status and error formats should be predictable.",
            "Framework choice should fit project constraints."
        ],
        commonMistakes: [
            "Skipping request validation.",
            "Returning inconsistent response schemas.",
            "Ignoring authentication/authorization requirements.",
            "Leaking internal errors to clients.",
            "Mixing business logic directly in route handlers."
        ],
        bestPractices: [
            "Define clear API contracts and version strategy.",
            "Validate all input at boundaries.",
            "Use consistent error response structure.",
            "Separate handlers from business services.",
            "Add logging, metrics, and rate controls."
        ],
        easyExercise: "Create a /hello endpoint returning JSON with a greeting.",
        mediumExercise: "Build a POST endpoint that accepts two numbers and returns their sum.",
        hardExercise: "Implement CRUD endpoints for learner records with validation and structured error handling.",
        quizQuestions: [
            "What is an API endpoint?",
            "Why is request validation important?",
            "What HTTP method is commonly used to create data?",
            "Why should response formats stay consistent?",
            "What is API versioning used for?"
        ],
        interviewQuestions: [
            "How do you design a stable REST API contract?",
            "How do you handle backward compatibility?",
            "How do you structure API error responses?",
            "Where should business logic live in API architecture?",
            "How do you secure API endpoints?",
            "How do you test APIs end-to-end?",
            "How do you monitor API latency and failures?",
            "How do you handle idempotency in APIs?",
            "How do you choose between Flask and FastAPI?",
            "How do AI inference APIs differ from standard CRUD APIs?"
        ],
        aiMentorTips: [
            "Treat API contracts as product interfaces.",
            "Validate input aggressively and fail predictably.",
            "Keep handlers thin and services reusable.",
            "Instrument APIs before production rollout."
        ],
        summaryNotes: [
            "APIs expose system capabilities to clients.",
            "Contract and validation quality drive reliability.",
            "Consistent error handling improves developer experience.",
            "Observability is essential for production APIs."
        ],
        miniProject: "Build a learner-service API with health, create, list, and analyze endpoints plus validation and error middleware.",
        expectedOutput: "{'status': 'ok'}\n{'total': 7}\n{'chars': 5, 'normalized': 'hello'}"
    },
    {
        title: "Database Integration",
        overview: "Database integration connects Python applications to persistent storage with safe queries and transactions.",
        beginnerExplanation: "Database integration means storing and retrieving application data from databases.",
        whyItMatters: "Persistent data is required for real-world apps, analytics, and user workflows.",
        useCases: [
            "Store learner profiles and progress.",
            "Save project submissions and status history.",
            "Query analytics summaries for dashboards.",
            "Maintain durable records for audits."
        ],
        detailedTheory: databaseIntegrationTheory,
        beginnerCode: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE users (id INTEGER, name TEXT)')\ncur.execute('INSERT INTO users VALUES (?, ?)', (1, 'Lahari'))\nconn.commit()\nprint(cur.execute('SELECT name FROM users').fetchone()[0])",
        intermediateCode: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE scores (name TEXT, score INTEGER)')\ncur.executemany('INSERT INTO scores VALUES (?, ?)', [('A', 90), ('B', 70)])\nrows = cur.execute('SELECT name FROM scores WHERE score >= ?', (80,)).fetchall()\nprint(rows)",
        advancedCode: "import sqlite3\nconn = sqlite3.connect(':memory:')\ncur = conn.cursor()\ncur.execute('CREATE TABLE tx (id INTEGER, amount INTEGER)')\ntry:\n    cur.execute('BEGIN')\n    cur.execute('INSERT INTO tx VALUES (?, ?)', (1, 100))\n    cur.execute('INSERT INTO tx VALUES (?, ?)', (2, 200))\n    conn.commit()\nexcept Exception:\n    conn.rollback()\nprint(cur.execute('SELECT COUNT(*) FROM tx').fetchone()[0])",
        lineByLine: [
            "Connection opens access to database engine.",
            "Cursor executes SQL statements.",
            "Parameterized queries prevent injection risks.",
            "Commit persists successful writes.",
            "Rollback protects consistency on failure.",
            "Query results should be validated and handled safely."
        ],
        commonMistakes: [
            "Building SQL with string concatenation.",
            "Ignoring transaction boundaries.",
            "Leaking open connections.",
            "Missing indexes on high-traffic query fields.",
            "Skipping migration/version control for schema changes."
        ],
        bestPractices: [
            "Use parameterized queries everywhere.",
            "Wrap multi-step writes in transactions.",
            "Manage connection lifecycle explicitly.",
            "Use migrations for schema evolution.",
            "Profile and optimize slow queries with indexes."
        ],
        easyExercise: "Create a table, insert one row, and read it back using sqlite3.",
        mediumExercise: "Write a query that filters records by score threshold with parameter binding.",
        hardExercise: "Implement transactional insert/update operations with rollback and error logging.",
        quizQuestions: [
            "Why are parameterized queries important?",
            "What does commit do?",
            "When should rollback be used?",
            "What is a migration?",
            "Why is connection management critical?"
        ],
        interviewQuestions: [
            "How do you choose between ORM and raw SQL?",
            "How do you prevent SQL injection in Python apps?",
            "How do you design safe transaction boundaries?",
            "How do you handle schema evolution across environments?",
            "How do you debug and optimize slow queries?",
            "What are common database integration failure modes?",
            "How do connection pools improve performance?",
            "How do you test database integration reliably in CI?",
            "How do you avoid N+1 query issues?",
            "How does persistence design affect AI pipeline reliability?"
        ],
        aiMentorTips: [
            "Treat persistence logic as critical infrastructure.",
            "Make transactions explicit for multi-step writes.",
            "Guard all SQL with parameterization.",
            "Monitor query performance from the start."
        ],
        summaryNotes: [
            "Database integration enables durable application state.",
            "Safe queries and transactions are non-negotiable.",
            "Schema evolution needs disciplined migration workflow.",
            "Performance and consistency must be tested continuously."
        ],
        miniProject: "Build a learner progress repository layer with safe CRUD operations, transactional updates, and query-based leaderboard retrieval.",
        expectedOutput: "Lahari\n[('A',)]\n2"
    },
    {
        title: "Python Projects",
        overview: "Python projects combine language skills, architecture, testing, and deployment into complete deliverables.",
        beginnerExplanation: "A Python project is a real application built from idea to working deployment.",
        whyItMatters: "Projects prove practical engineering ability beyond isolated code snippets.",
        useCases: [
            "Portfolio-ready backend services.",
            "Automation and data processing tools.",
            "AI-powered APIs and assistants.",
            "Analytics and reporting platforms."
        ],
        detailedTheory: pythonProjectsTheory,
        beginnerCode: "def run():\n    print('Project started')\n\nif __name__ == '__main__':\n    run()",
        intermediateCode: "def validate_config(cfg):\n    required = ['app_name', 'env']\n    return all(k in cfg for k in required)\n\nprint(validate_config({'app_name': 'nexus', 'env': 'dev'}))",
        advancedCode: "def healthcheck(deps):\n    return {'ok': all(deps.values()), 'deps': deps}\n\nprint(healthcheck({'db': True, 'api': True, 'cache': True}))",
        lineByLine: [
            "Project entrypoint should be explicit and testable.",
            "Configuration validation reduces runtime surprises.",
            "Health checks verify dependency readiness.",
            "Small composable functions simplify project wiring.",
            "Environment-aware design improves deployment reliability.",
            "Observability should be built into project baseline."
        ],
        commonMistakes: [
            "Starting implementation without clear scope.",
            "Mixing all logic in one file.",
            "Ignoring tests and deployment constraints until late.",
            "Unpinned dependencies causing environment drift.",
            "Missing logs/metrics for production diagnosis."
        ],
        bestPractices: [
            "Define scope, success criteria, and milestones early.",
            "Adopt a clean folder structure from the beginning.",
            "Automate tests, linting, and formatting.",
            "Use environment variables and reproducible configs.",
            "Plan deployment and monitoring as part of implementation."
        ],
        easyExercise: "Create a small CLI project with one command and one unit test.",
        mediumExercise: "Build a mini REST API project with config validation and health endpoint.",
        hardExercise: "Design and implement an end-to-end Python service with tests, logging, and deployment checklist.",
        quizQuestions: [
            "Why is project structure important?",
            "What belongs in requirements/dependency files?",
            "Why are health checks useful in deployment?",
            "How do tests improve project reliability?",
            "What is the role of environment configuration?"
        ],
        interviewQuestions: [
            "How do you plan a Python project from idea to delivery?",
            "What folder structure conventions do you follow and why?",
            "How do you ensure reproducible development environments?",
            "How do you define and measure project success criteria?",
            "How do you manage technical debt during project execution?",
            "How do you approach deployment readiness?",
            "How do you instrument observability in new projects?",
            "How do you prioritize features vs reliability work?",
            "How do you document architecture decisions effectively?",
            "How do you present project outcomes in a portfolio context?"
        ],
        aiMentorTips: [
            "Think in delivery phases: plan, build, test, deploy, observe.",
            "Keep architecture simple but extensible.",
            "Automate repetitive quality checks early.",
            "Show measurable outcomes in every project."
        ],
        summaryNotes: [
            "Projects demonstrate end-to-end engineering capability.",
            "Structure, testing, and deployment are core requirements.",
            "Observability and reproducibility increase reliability.",
            "Strong projects balance features with maintainability."
        ],
        miniProject: "<strong>Mini Project 1:</strong> Build a Learner Progress API with authentication, progress updates, and analytics endpoint.<br><strong>Mini Project 2:</strong> Build a Resume Skill Matcher that parses profile input and returns ranked job-fit results.<br><strong>Mini Project 3:</strong> Build an AI Study Planner that creates weekly schedules from goals and available hours.<br><strong>Folder Structure:</strong><br>project-root/<br>  app/<br>    api/<br>    services/<br>    models/<br>    db/<br>  tests/<br>  scripts/<br>  requirements.txt<br>  README.md<br><strong>Implementation Steps:</strong><br>1) Define requirements and success metrics.<br>2) Create package/module structure.<br>3) Implement core features with unit tests.<br>4) Add API/database integration and validation.<br>5) Add logging, health checks, and error handling.<br>6) Run integration tests and prepare release artifacts.<br><strong>Deployment Notes:</strong><br>Use environment variables for secrets, run migrations before startup, expose /health endpoint, enable structured logs, monitor latency/error rates, and deploy via container or managed platform with rollback strategy.",
        expectedOutput: "Project started\nTrue\n{'ok': True, 'deps': {'db': True, 'api': True, 'cache': True}}"
    },
    {
        title: "Java Basics",
        overview: "Java Basics introduces syntax, type safety, JVM execution, and core building blocks for backend development.",
        beginnerExplanation: "Java is a strongly typed language where you write classes and methods to build reliable programs.",
        whyItMatters: "Java fundamentals are required for enterprise backend APIs and full stack service development.",
        useCases: [
            "Build backend service logic for web applications.",
            "Create utility tools and data processors.",
            "Implement API handlers in Spring Boot projects.",
            "Develop reliable business workflows with strong typing."
        ],
        detailedTheory: javaBasicsTheory,
        beginnerCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java\");\n    }\n}",
        intermediateCode: "int age = 24;\nString name = \"Lahari\";\nboolean active = true;\nSystem.out.println(name + \" - \" + age + \" - \" + active);",
        advancedCode: "class Calculator {\n    int add(int a, int b) { return a + b; }\n}\nCalculator c = new Calculator();\nSystem.out.println(c.add(10, 5));",
        lineByLine: [
            "main is the entry point for Java applications.",
            "Type declarations enforce compile-time safety.",
            "System.out.println prints to standard output.",
            "Classes define reusable behavior containers.",
            "Methods encapsulate callable logic units.",
            "Object instantiation uses the new keyword."
        ],
        commonMistakes: [
            "Ignoring type mismatches and relying on implicit assumptions.",
            "Putting too much logic in main method.",
            "Using weak naming and inconsistent formatting.",
            "Not understanding primitive vs reference types.",
            "Skipping package organization early."
        ],
        bestPractices: [
            "Keep methods focused and small.",
            "Follow Java naming conventions consistently.",
            "Use packages to structure codebase by domain.",
            "Leverage IDE/compiler feedback early.",
            "Write clear and type-safe APIs."
        ],
        easyExercise: "Create a Java program that prints your name and role.",
        mediumExercise: "Build a class with two methods for sum and subtraction.",
        hardExercise: "Create a small CLI-style Java app with multiple classes and package structure.",
        quizQuestions: [
            "What is JVM?",
            "What is the purpose of main method?",
            "Why is Java called statically typed?",
            "What is the difference between class and object?",
            "Why are packages used?"
        ],
        interviewQuestions: [
            "How does Java compile and run code on different platforms?",
            "Why is type safety important in enterprise systems?",
            "What are primitive and reference types in Java?",
            "How do you structure Java projects for maintainability?",
            "What role does JVM play in memory and execution?",
            "How do constructors differ from methods?",
            "How do access modifiers affect class design?",
            "What are common beginner mistakes in Java codebases?",
            "How do packages and imports improve architecture?",
            "How do you debug compile-time vs runtime errors in Java?"
        ],
        aiMentorTips: [
            "Use compiler errors as learning feedback.",
            "Prioritize readable class and method names.",
            "Understand type system deeply before advanced frameworks.",
            "Practice with small multi-class examples regularly."
        ],
        summaryNotes: [
            "Java basics are the foundation for full stack backend work.",
            "Type safety improves long-term maintainability.",
            "Class/method structure drives code quality.",
            "Good fundamentals accelerate Spring and microservices learning."
        ],
        miniProject: "Build a Java console app for learner profile management with class-based design, input validation, and summary output.",
        expectedOutput: "Hello Java\nLahari - 24 - true\n15"
    },
    {
        title: "Java OOP",
        overview: "Java OOP covers class design, interfaces, encapsulation, and polymorphic architecture patterns.",
        beginnerExplanation: "OOP in Java means modeling real concepts as classes with data and methods.",
        whyItMatters: "Strong OOP design is essential for scalable backend and enterprise Java systems.",
        useCases: [
            "Model users, orders, and workflows in services.",
            "Define service contracts via interfaces.",
            "Implement dependency-injected components in Spring.",
            "Keep business logic modular and testable."
        ],
        detailedTheory: javaOopTheory,
        beginnerCode: "class User {\n    String name;\n    User(String name) { this.name = name; }\n    String greet() { return \"Hi \" + name; }\n}",
        intermediateCode: "interface Notifier {\n    void send(String msg);\n}\nclass EmailNotifier implements Notifier {\n    public void send(String msg) { System.out.println(\"Email: \" + msg); }\n}",
        advancedCode: "class ProgressService {\n    private int completed;\n    void completeLesson() { completed++; }\n    int getCompleted() { return completed; }\n}",
        lineByLine: [
            "Classes group related state and behavior.",
            "Constructors initialize object state.",
            "Interfaces define reusable contracts.",
            "Implementations provide concrete behavior.",
            "Private fields support encapsulation.",
            "Public methods expose controlled interactions."
        ],
        commonMistakes: [
            "Creating oversized God classes.",
            "Skipping interface abstraction for interchangeable components.",
            "Exposing internal mutable state directly.",
            "Overusing inheritance when composition is clearer.",
            "Weak constructor validation."
        ],
        bestPractices: [
            "Design classes around single responsibility.",
            "Use interfaces for extensibility and testing.",
            "Prefer composition for flexible design.",
            "Encapsulate fields with meaningful methods.",
            "Keep method contracts explicit and stable."
        ],
        easyExercise: "Create a Student class with name field and display method.",
        mediumExercise: "Define an interface and two implementing classes with different outputs.",
        hardExercise: "Design a small service layer with interfaces, implementations, and encapsulated state.",
        quizQuestions: [
            "What is encapsulation in Java?",
            "Why are interfaces useful?",
            "What is constructor overloading?",
            "When should composition be preferred?",
            "How does polymorphism help extensibility?"
        ],
        interviewQuestions: [
            "How do you design maintainable OOP architecture in Java?",
            "What are tradeoffs of inheritance vs composition?",
            "How do interfaces improve unit testing?",
            "What makes a class cohesive?",
            "How do access modifiers enforce boundaries?",
            "How do you refactor a God class safely?",
            "What role do constructors play in object validity?",
            "How do you design stable class contracts?",
            "How does OOP integrate with Spring dependency injection?",
            "What OOP anti-patterns are common in enterprise projects?"
        ],
        aiMentorTips: [
            "Design contracts first, implementations second.",
            "Keep classes focused and behavior-driven.",
            "Use private state with explicit business methods.",
            "Review class responsibilities frequently during growth."
        ],
        summaryNotes: [
            "Java OOP is central to enterprise maintainability.",
            "Interfaces and encapsulation improve flexibility.",
            "Composition often beats deep inheritance.",
            "Good class design reduces long-term technical debt."
        ],
        miniProject: "Build a notification module with interface-based design, multiple implementations, and unit-testable service orchestration.",
        expectedOutput: "Hi Lahari\nEmail: welcome\n1"
    },
    {
        title: "Collections",
        overview: "Java Collections framework provides typed, optimized data structures for enterprise applications.",
        beginnerExplanation: "Collections are classes that store multiple objects like lists, sets, and maps.",
        whyItMatters: "Choosing correct collection types improves performance and correctness.",
        useCases: [
            "Store ordered response items with List.",
            "Enforce uniqueness with Set.",
            "Map IDs to objects with Map.",
            "Aggregate analytics values in memory."
        ],
        detailedTheory: javaCollectionsTheory,
        beginnerCode: "List<String> skills = new ArrayList<>();\nskills.add(\"Java\");\nskills.add(\"Spring\");\nSystem.out.println(skills);",
        intermediateCode: "Set<Integer> ids = new HashSet<>();\nids.add(1); ids.add(1); ids.add(2);\nSystem.out.println(ids);",
        advancedCode: "Map<String, Integer> scores = new HashMap<>();\nscores.put(\"A\", 90);\nscores.put(\"B\", 80);\nSystem.out.println(scores.get(\"A\"));",
        lineByLine: [
            "List maintains insertion order and allows duplicates.",
            "Set enforces uniqueness of elements.",
            "Map stores key-value associations.",
            "Generics provide compile-time type safety.",
            "Collection choice should match access patterns.",
            "Operations have different complexity tradeoffs."
        ],
        commonMistakes: [
            "Using wrong structure for required behavior.",
            "Ignoring generic types and using raw collections.",
            "Modifying collections unsafely during iteration.",
            "Assuming all maps preserve insertion order.",
            "Neglecting performance implications in hot paths."
        ],
        bestPractices: [
            "Select collection by semantics and complexity needs.",
            "Use generics consistently.",
            "Prefer immutable views where appropriate.",
            "Handle concurrent access with proper structures.",
            "Measure and optimize collection-heavy paths."
        ],
        easyExercise: "Create an ArrayList of three technologies and print them.",
        mediumExercise: "Use HashSet to remove duplicates from a list of IDs.",
        hardExercise: "Build a Map-based score registry with update and lookup operations plus validation.",
        quizQuestions: [
            "What is difference between List and Set?",
            "Why use Map in Java?",
            "What are generics used for?",
            "Which collection enforces uniqueness?",
            "Why might LinkedHashMap be chosen over HashMap?"
        ],
        interviewQuestions: [
            "How do you choose between ArrayList and LinkedList?",
            "What are complexity tradeoffs in major collections?",
            "How do generics improve safety and readability?",
            "How do you safely modify collections while iterating?",
            "When would you use TreeSet or TreeMap?",
            "How do concurrent collections differ from standard ones?",
            "What are common collection-related memory issues?",
            "How do you optimize map lookup heavy workloads?",
            "How does collection choice impact API response shaping?",
            "How do you test collection transformation correctness?"
        ],
        aiMentorTips: [
            "Choose structure by behavior, not habit.",
            "Use generics to eliminate avoidable runtime type bugs.",
            "Favor clear mutation patterns for maintainability.",
            "Profile collection-heavy logic before optimization."
        ],
        summaryNotes: [
            "Collections are core to Java data modeling.",
            "Correct structure choice improves quality and speed.",
            "Generics provide strong compile-time guarantees.",
            "Iteration and concurrency require discipline."
        ],
        miniProject: "Build a learner leaderboard module using List, Set, and Map with deduplication, ranking, and lookup features.",
        expectedOutput: "[Java, Spring]\n[1, 2]\n90"
    },
    {
        title: "Streams",
        overview: "Java Streams enable declarative data processing pipelines for transformation and aggregation.",
        beginnerExplanation: "Streams let you process collections with operations like filter, map, and collect.",
        whyItMatters: "They reduce boilerplate loops and improve readability for transformation workflows.",
        useCases: [
            "Filter active users in service responses.",
            "Map entities to DTOs.",
            "Aggregate scores and analytics metrics.",
            "Group and summarize records by category."
        ],
        detailedTheory: javaStreamsTheory,
        beginnerCode: "List<Integer> nums = Arrays.asList(1,2,3,4,5);\nList<Integer> evens = nums.stream().filter(n -> n % 2 == 0).collect(Collectors.toList());\nSystem.out.println(evens);",
        intermediateCode: "List<String> names = Arrays.asList(\"alice\",\"bob\");\nList<String> upper = names.stream().map(String::toUpperCase).collect(Collectors.toList());\nSystem.out.println(upper);",
        advancedCode: "List<Integer> marks = Arrays.asList(80, 90, 70, 95);\nint total = marks.stream().mapToInt(Integer::intValue).sum();\ndouble avg = marks.stream().mapToInt(Integer::intValue).average().orElse(0);\nSystem.out.println(total + \" / \" + avg);",
        lineByLine: [
            "stream() creates a processing pipeline from collection.",
            "filter keeps only matching elements.",
            "map transforms each element.",
            "collect materializes results.",
            "mapToInt supports numeric aggregations.",
            "Terminal operations trigger pipeline execution."
        ],
        commonMistakes: [
            "Using streams with hidden side effects.",
            "Overcomplicating simple logic with long pipelines.",
            "Ignoring null handling in stream sources.",
            "Assuming parallel streams always improve performance.",
            "Mixing mutable shared state inside operations."
        ],
        bestPractices: [
            "Use streams for clear transformation workflows.",
            "Keep pipeline stages focused and readable.",
            "Avoid side effects inside map/filter.",
            "Benchmark before using parallel streams.",
            "Prefer collector utilities for common patterns."
        ],
        easyExercise: "Filter numbers greater than 10 from a list using streams.",
        mediumExercise: "Transform a list of names to lowercase sorted output.",
        hardExercise: "Group order records by status and compute count/average metrics with collectors.",
        quizQuestions: [
            "What is a stream pipeline in Java?",
            "What is difference between intermediate and terminal operations?",
            "What does collect do?",
            "Why avoid side effects in stream operations?",
            "When might parallel streams be risky?"
        ],
        interviewQuestions: [
            "How do Java Streams improve service-layer readability?",
            "How do you decide between loop and stream implementation?",
            "What are common stream performance pitfalls?",
            "How do collectors like groupingBy work?",
            "How do you handle checked exceptions in streams?",
            "What are dangers of shared mutable state in stream pipelines?",
            "How do map and flatMap differ in practice?",
            "When should parallelStream be avoided?",
            "How do you test stream transformation correctness?",
            "How do streams support DTO mapping in API development?"
        ],
        aiMentorTips: [
            "Prefer readable pipelines over clever one-liners.",
            "Keep transformations pure and side-effect free.",
            "Use collectors to express intent clearly.",
            "Profile performance-sensitive stream code paths."
        ],
        summaryNotes: [
            "Streams simplify transformation and aggregation.",
            "Pipeline clarity is the key quality metric.",
            "Terminal operations execute lazy intermediate stages.",
            "Side-effect free streams are safer and easier to test."
        ],
        miniProject: "Build a report generator that uses streams to filter, transform, group, and summarize learner progress data.",
        expectedOutput: "[2, 4]\n[ALICE, BOB]\n335 / 83.75"
    },
    {
        title: "Java Exception Handling",
        overview: "Java exception handling manages runtime failures with explicit contracts and recovery paths.",
        beginnerExplanation: "Exception handling lets Java programs detect errors and respond safely instead of crashing abruptly.",
        whyItMatters: "Reliable error handling is critical for stable APIs, services, and integrations.",
        useCases: [
            "Validate API input and return safe error responses.",
            "Handle file/database failures gracefully.",
            "Ensure cleanup with try-with-resources.",
            "Translate internal errors into domain-specific exceptions."
        ],
        detailedTheory: javaExceptionHandlingTheory,
        beginnerCode: "try {\n    int x = 10 / 0;\n} catch (ArithmeticException ex) {\n    System.out.println(\"Cannot divide by zero\");\n}",
        intermediateCode: "try (BufferedReader br = new BufferedReader(new StringReader(\"hello\"))) {\n    System.out.println(br.readLine());\n} catch (IOException ex) {\n    System.out.println(\"IO error\");\n}",
        advancedCode: "class InvalidScoreException extends RuntimeException {\n    InvalidScoreException(String msg) { super(msg); }\n}\n\nint score = 120;\nif (score > 100) {\n    throw new InvalidScoreException(\"Score out of range\");\n}",
        lineByLine: [
            "try wraps code that may throw exceptions.",
            "catch handles specific exception categories.",
            "try-with-resources auto-closes closeable resources.",
            "Custom exceptions encode domain semantics.",
            "throw explicitly signals invalid conditions.",
            "Structured handling improves reliability and diagnostics."
        ],
        commonMistakes: [
            "Catching broad Exception without strategy.",
            "Swallowing exceptions silently.",
            "Leaking resources by skipping try-with-resources.",
            "Returning generic errors without context.",
            "Using exceptions for normal control flow."
        ],
        bestPractices: [
            "Catch narrow, meaningful exception types.",
            "Preserve context when rethrowing.",
            "Use custom exceptions for domain errors.",
            "Centralize API exception mapping.",
            "Always clean up external resources safely."
        ],
        easyExercise: "Handle ArithmeticException for division by zero in a small program.",
        mediumExercise: "Read a text input with try-with-resources and handle IO exceptions.",
        hardExercise: "Implement a service method that validates input, throws custom exceptions, and maps them to error codes.",
        quizQuestions: [
            "What is the difference between checked and unchecked exceptions?",
            "Why use try-with-resources?",
            "What does finally guarantee?",
            "When should custom exceptions be created?",
            "Why is catching Exception blindly risky?"
        ],
        interviewQuestions: [
            "How do checked exceptions influence API design in Java?",
            "When should RuntimeException be preferred?",
            "How do you preserve stack trace context effectively?",
            "How do you design domain-specific exception hierarchies?",
            "How do you map backend exceptions to HTTP responses?",
            "What anti-patterns are common in Java exception handling?",
            "How does try-with-resources improve reliability?",
            "How do you test exception paths comprehensively?",
            "How do you avoid exception swallowing in large codebases?",
            "How do exception strategies differ across service and repository layers?"
        ],
        aiMentorTips: [
            "Design exception strategy before coding complex workflows.",
            "Use explicit types to clarify recovery behavior.",
            "Log with context, not noise.",
            "Treat failure paths as first-class test scenarios."
        ],
        summaryNotes: [
            "Java exceptions make failure handling explicit.",
            "Checked vs unchecked impacts method contracts.",
            "Try-with-resources prevents common leaks.",
            "Structured handling improves service reliability."
        ],
        miniProject: "Build a validation and exception-mapping layer for a learner API that converts domain errors into structured responses.",
        expectedOutput: "Cannot divide by zero\nhello\nScore out of range"
    },
    {
        title: "Java Multithreading",
        overview: "Java multithreading enables concurrent execution and scalable backend processing.",
        beginnerExplanation: "Multithreading means running multiple tasks at the same time using separate threads.",
        whyItMatters: "It improves responsiveness and throughput for modern backend services.",
        useCases: [
            "Process requests concurrently in web servers.",
            "Run background jobs without blocking main flow.",
            "Parallelize data processing tasks.",
            "Handle async notifications and integrations."
        ],
        detailedTheory: javaMultithreadingTheory,
        beginnerCode: "class Worker extends Thread {\n    public void run() {\n        System.out.println(\"Worker running\");\n    }\n}\nnew Worker().start();",
        intermediateCode: "Runnable task = () -> System.out.println(Thread.currentThread().getName());\nThread t1 = new Thread(task);\nThread t2 = new Thread(task);\nt1.start();\nt2.start();",
        advancedCode: "ExecutorService pool = Executors.newFixedThreadPool(2);\nFuture<Integer> result = pool.submit(() -> 40 + 2);\nSystem.out.println(result.get());\npool.shutdown();",
        lineByLine: [
            "Thread start triggers asynchronous execution of run.",
            "Runnable separates task logic from thread mechanics.",
            "Multiple threads can run concurrently.",
            "ExecutorService manages thread reuse efficiently.",
            "Future retrieves async computation results.",
            "shutdown releases pool resources safely."
        ],
        commonMistakes: [
            "Sharing mutable state without synchronization.",
            "Creating too many raw threads under load.",
            "Ignoring deadlock risks with nested locks.",
            "Blocking critical threads unnecessarily.",
            "Forgetting to shut down executors."
        ],
        bestPractices: [
            "Prefer ExecutorService over manual thread creation.",
            "Use immutable data and thread-safe structures.",
            "Keep lock scope minimal and explicit.",
            "Use timeouts for blocking operations.",
            "Measure concurrency behavior in realistic tests."
        ],
        easyExercise: "Create two threads that print different messages.",
        mediumExercise: "Use ExecutorService to run three tasks and collect results.",
        hardExercise: "Build a concurrent task scheduler with graceful shutdown and timeout handling.",
        quizQuestions: [
            "What is a thread in Java?",
            "Why prefer ExecutorService over raw Thread?",
            "What does synchronized protect against?",
            "What is a race condition?",
            "Why is executor shutdown important?"
        ],
        interviewQuestions: [
            "How do you design thread-safe service logic in Java?",
            "What is the difference between Runnable and Callable?",
            "How do Future and CompletableFuture differ?",
            "How do you prevent deadlocks?",
            "When should synchronized be avoided in favor of other primitives?",
            "How do thread pools improve performance characteristics?",
            "How do you debug concurrency bugs effectively?",
            "What are visibility guarantees of volatile?",
            "How do you test multithreaded behavior deterministically?",
            "How does servlet container threading impact application design?"
        ],
        aiMentorTips: [
            "Start with correctness, then tune for performance.",
            "Minimize shared mutable state whenever possible.",
            "Use executors and futures for structured async flows.",
            "Always close concurrency resources cleanly."
        ],
        summaryNotes: [
            "Multithreading enables concurrency and better throughput.",
            "Thread safety is mandatory for correctness.",
            "Executors provide scalable thread management.",
            "Testing and observability are key for concurrent systems."
        ],
        miniProject: "Build a concurrent report processor that executes tasks via thread pool and aggregates results safely.",
        expectedOutput: "Worker running\npool-1-thread-1\n42"
    },
    {
        title: "JDBC",
        overview: "JDBC provides the standard Java API for relational database connectivity.",
        beginnerExplanation: "JDBC lets Java programs run SQL queries and read database results.",
        whyItMatters: "Database access is core to most backend systems and business workflows.",
        useCases: [
            "Execute CRUD operations from service layer.",
            "Run transaction-safe multi-step database updates.",
            "Fetch data for reporting and analytics.",
            "Integrate with legacy relational systems."
        ],
        detailedTheory: javaJdbcTheory,
        beginnerCode: "try (Connection con = DriverManager.getConnection(url, user, pass);\n     Statement st = con.createStatement();\n     ResultSet rs = st.executeQuery(\"SELECT 1\")) {\n    while (rs.next()) System.out.println(rs.getInt(1));\n}",
        intermediateCode: "String sql = \"SELECT name FROM learners WHERE id = ?\";\ntry (Connection con = ds.getConnection();\n     PreparedStatement ps = con.prepareStatement(sql)) {\n    ps.setInt(1, 101);\n    try (ResultSet rs = ps.executeQuery()) {\n        if (rs.next()) System.out.println(rs.getString(\"name\"));\n    }\n}",
        advancedCode: "try (Connection con = ds.getConnection()) {\n    con.setAutoCommit(false);\n    try (PreparedStatement debit = con.prepareStatement(\"UPDATE acct SET bal=bal-? WHERE id=?\");\n         PreparedStatement credit = con.prepareStatement(\"UPDATE acct SET bal=bal+? WHERE id=?\")) {\n        debit.setInt(1, 100); debit.setInt(2, 1); debit.executeUpdate();\n        credit.setInt(1, 100); credit.setInt(2, 2); credit.executeUpdate();\n        con.commit();\n    } catch (SQLException ex) {\n        con.rollback();\n        throw ex;\n    }\n}",
        lineByLine: [
            "Connection opens a session with the database.",
            "PreparedStatement binds parameters safely.",
            "ResultSet iterates query output rows.",
            "try-with-resources prevents connection leaks.",
            "Transactions group related SQL operations.",
            "Rollback restores consistency on failure."
        ],
        commonMistakes: [
            "Using string concatenation instead of prepared statements.",
            "Not closing JDBC resources properly.",
            "Ignoring transaction boundaries.",
            "Running chatty queries in loops.",
            "Swallowing SQL exceptions without context."
        ],
        bestPractices: [
            "Use PreparedStatement for all dynamic inputs.",
            "Adopt DataSource with connection pooling.",
            "Use explicit commit/rollback for multi-step writes.",
            "Log SQL errors with actionable metadata.",
            "Profile slow queries and add proper indexes."
        ],
        easyExercise: "Run a SELECT query using Statement and print first column.",
        mediumExercise: "Fetch one learner by id using PreparedStatement.",
        hardExercise: "Implement transfer logic with transaction commit/rollback handling.",
        quizQuestions: [
            "What is JDBC used for?",
            "Why use PreparedStatement?",
            "What does ResultSet represent?",
            "When should rollback be called?",
            "Why is try-with-resources important in JDBC?"
        ],
        interviewQuestions: [
            "How does JDBC differ from ORM abstraction layers?",
            "How do you prevent SQL injection in Java code?",
            "How do you manage transaction boundaries effectively?",
            "What is connection pooling and why does it matter?",
            "How do you diagnose slow JDBC operations?",
            "How do you handle batch updates in JDBC?",
            "How do you map relational rows to domain models safely?",
            "How do you design retry logic around transient DB failures?",
            "How do you test JDBC integration in CI?",
            "How do you propagate SQL errors to API layers responsibly?"
        ],
        aiMentorTips: [
            "Treat SQL safety as non-negotiable.",
            "Always manage transactions intentionally.",
            "Prefer pooled connections for real workloads.",
            "Understand JDBC even when using ORM frameworks."
        ],
        summaryNotes: [
            "JDBC is the low-level foundation of Java DB integration.",
            "PreparedStatement improves security and performance.",
            "Transactions protect data consistency.",
            "Resource management is critical in production systems."
        ],
        miniProject: "Build a JDBC-based learner repository with CRUD operations, parameterized SQL, and transactional update flow.",
        expectedOutput: "1\nLahari\nTRANSFER_OK"
    },
    {
        title: "Servlets",
        overview: "Servlets handle HTTP requests and responses in Java web containers.",
        beginnerExplanation: "A servlet is Java code that runs on a server to process web requests.",
        whyItMatters: "Servlet fundamentals are required to understand Java web frameworks and request lifecycle.",
        useCases: [
            "Handle GET/POST endpoints in Java web apps.",
            "Implement login/session workflows.",
            "Apply request filters for auth/logging.",
            "Return HTML or JSON responses from server."
        ],
        detailedTheory: javaServletsTheory,
        beginnerCode: "public class HelloServlet extends HttpServlet {\n    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {\n        res.getWriter().println(\"Hello Servlet\");\n    }\n}",
        intermediateCode: "@WebServlet(\"/login\")\npublic class LoginServlet extends HttpServlet {\n    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {\n        String user = req.getParameter(\"user\");\n        res.getWriter().println(\"Welcome \" + user);\n    }\n}",
        advancedCode: "public class AuthFilter implements Filter {\n    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {\n        HttpServletRequest r = (HttpServletRequest) req;\n        if (r.getSession().getAttribute(\"uid\") == null) {\n            ((HttpServletResponse) res).sendError(401);\n            return;\n        }\n        chain.doFilter(req, res);\n    }\n}",
        lineByLine: [
            "HttpServlet provides HTTP method handlers.",
            "doGet and doPost process specific request types.",
            "Request object contains params and session context.",
            "Response object writes status and body output.",
            "Filters apply reusable cross-cutting logic.",
            "Container invokes servlet components per request lifecycle."
        ],
        commonMistakes: [
            "Storing mutable shared state in servlet fields.",
            "Not validating request parameters.",
            "Writing business logic directly in servlet handlers.",
            "Forgetting status code handling.",
            "Ignoring thread-safety in filter/servlet code."
        ],
        bestPractices: [
            "Keep handlers thin and delegate business logic to services.",
            "Validate all request input explicitly.",
            "Return consistent status codes and response formats.",
            "Use filters for auth, logging, and tracing.",
            "Assume every servlet request is concurrent."
        ],
        easyExercise: "Create a servlet that returns plain text for GET request.",
        mediumExercise: "Handle POST form input and return a personalized response.",
        hardExercise: "Build servlet + filter flow with session check and standardized error responses.",
        quizQuestions: [
            "What is a servlet container?",
            "What is difference between doGet and doPost?",
            "What does HttpServletRequest provide?",
            "Why are servlet fields risky for mutable state?",
            "What problem do filters solve?"
        ],
        interviewQuestions: [
            "Explain servlet lifecycle from init to destroy.",
            "How does servlet threading affect code design?",
            "How do filters and listeners differ?",
            "How do you secure servlet endpoints effectively?",
            "How do you handle content negotiation in servlets?",
            "How do sessions work in servlet-based apps?",
            "How do you structure exception handling in servlet layers?",
            "How does Spring MVC build on servlet APIs?",
            "How do you test servlet endpoints?",
            "How do you migrate servlet-heavy monoliths incrementally?"
        ],
        aiMentorTips: [
            "Understand HTTP flow deeply before adding framework abstractions.",
            "Design servlet code as stateless request handlers.",
            "Use filters to centralize repeated web concerns.",
            "Keep controller-like logic separate from domain logic."
        ],
        summaryNotes: [
            "Servlets are foundational Java web components.",
            "Lifecycle and thread-safety understanding is essential.",
            "Request/response handling defines API behavior quality.",
            "Frameworks still rely on servlet concepts under the hood."
        ],
        miniProject: "Build a mini servlet web app with login endpoint, protected route filter, and structured error handling.",
        expectedOutput: "Hello Servlet\nWelcome Lahari\n401"
    },
    {
        title: "JSP",
        overview: "JSP renders dynamic server-side views in Java web applications.",
        beginnerExplanation: "JSP lets you show dynamic HTML pages using server data.",
        whyItMatters: "It is important for maintaining and modernizing legacy Java web systems.",
        useCases: [
            "Render server-side HTML dashboards.",
            "Display form validation messages.",
            "Iterate over model lists in views.",
            "Support legacy enterprise UI layers."
        ],
        detailedTheory: javaJspTheory,
        beginnerCode: "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<html><body><h1>Hello JSP</h1></body></html>",
        intermediateCode: "<c:forEach var=\"item\" items=\"${skills}\">\n  <li>${item}</li>\n</c:forEach>",
        advancedCode: "<c:choose>\n  <c:when test=\"${not empty user}\">Welcome, ${user.name}</c:when>\n  <c:otherwise>Please login</c:otherwise>\n</c:choose>",
        lineByLine: [
            "JSP pages are compiled to servlets by container.",
            "EL expressions read model data cleanly.",
            "JSTL tags handle loops and conditions.",
            "Controllers prepare data before forwarding to JSP.",
            "View templates should avoid business logic.",
            "Escaping and safe rendering reduce security risks."
        ],
        commonMistakes: [
            "Embedding heavy Java scriptlets in JSP.",
            "Mixing business logic into view templates.",
            "Not escaping user-provided content.",
            "Duplicating layout markup across pages.",
            "Tight coupling between servlet and JSP internals."
        ],
        bestPractices: [
            "Use JSTL and EL instead of scriptlets.",
            "Keep JSP focused on presentation-only concerns.",
            "Use includes/tag files for reusable UI fragments.",
            "Escape output where necessary.",
            "Maintain clear MVC boundaries between controller and view."
        ],
        easyExercise: "Create a JSP page that renders a welcome header.",
        mediumExercise: "Render a list of course names from request attributes using JSTL.",
        hardExercise: "Build MVC flow where servlet prepares model and JSP renders conditional dashboard sections.",
        quizQuestions: [
            "What is JSP used for?",
            "Why avoid scriptlets in modern JSP?",
            "What does EL provide?",
            "How does JSTL help template readability?",
            "Why keep MVC boundaries in JSP apps?"
        ],
        interviewQuestions: [
            "How is a JSP page executed by a servlet container?",
            "What are advantages of JSTL over scriptlets?",
            "How do you structure reusable JSP layouts?",
            "How do you secure output rendering in JSP views?",
            "How do you pass model data from servlet to JSP?",
            "What are common JSP anti-patterns in legacy codebases?",
            "How do you migrate JSP apps toward modern stacks?",
            "How do you test server-rendered JSP pages?",
            "How do internationalization concerns appear in JSP?",
            "How does JSP compare with Thymeleaf in modern projects?"
        ],
        aiMentorTips: [
            "Use JSP as a presentation layer, not business engine.",
            "Prefer tag libraries for cleaner templates.",
            "Keep rendering logic simple and testable.",
            "Plan migration paths if maintaining legacy JSP systems."
        ],
        summaryNotes: [
            "JSP is a server-side Java view technology.",
            "EL/JSTL improve readability and maintainability.",
            "Avoid scriptlet-heavy pages in production systems.",
            "Strong MVC separation keeps JSP applications cleaner."
        ],
        miniProject: "Create a JSP-based learner dashboard with servlet-backed model data, list rendering, and conditional sections.",
        expectedOutput: "Hello JSP\nJava\nSpring\nWelcome, Lahari"
    },
    {
        title: "Spring Core",
        overview: "Spring Core introduces IoC and dependency injection for scalable Java architecture.",
        beginnerExplanation: "Spring Core helps your app create and connect objects automatically.",
        whyItMatters: "It is the foundation for modern Spring-based enterprise development.",
        useCases: [
            "Wire service/repository dependencies cleanly.",
            "Centralize application configuration.",
            "Enable testable and loosely coupled modules.",
            "Prepare for Spring Boot and microservices architecture."
        ],
        detailedTheory: javaSpringCoreTheory,
        beginnerCode: "@Component\nclass GreetingService {\n    String message() { return \"Hello Spring\"; }\n}",
        intermediateCode: "@Component\nclass UserController {\n    private final GreetingService greetingService;\n    UserController(GreetingService greetingService) {\n        this.greetingService = greetingService;\n    }\n}",
        advancedCode: "@Configuration\nclass AppConfig {\n    @Bean\n    public Clock clock() {\n        return Clock.systemUTC();\n    }\n}",
        lineByLine: [
            "Component annotation registers class as bean candidate.",
            "IoC container manages bean lifecycle and wiring.",
            "Constructor injection declares required dependencies.",
            "Configuration classes define explicit bean creation.",
            "Beans can be swapped for testing and environments.",
            "DI reduces coupling and improves maintainability."
        ],
        commonMistakes: [
            "Using field injection everywhere.",
            "Creating overly coupled components.",
            "Hiding business dependencies implicitly.",
            "Mixing configuration concerns across modules.",
            "Not understanding bean scope and lifecycle."
        ],
        bestPractices: [
            "Prefer constructor injection for mandatory deps.",
            "Keep bean responsibilities focused and cohesive.",
            "Use interfaces at architecture boundaries.",
            "Externalize configuration by environment.",
            "Write tests with dependency substitution in mind."
        ],
        easyExercise: "Create a Spring component that returns a fixed message.",
        mediumExercise: "Inject one service into another using constructor injection.",
        hardExercise: "Design a small Spring Core module with interfaces, configuration class, and testable service wiring.",
        quizQuestions: [
            "What is IoC in Spring?",
            "Why is dependency injection useful?",
            "What is a Spring bean?",
            "Why prefer constructor injection?",
            "What does @Configuration do?"
        ],
        interviewQuestions: [
            "How does Spring IoC container manage dependencies?",
            "Field injection vs constructor injection tradeoffs?",
            "How do bean scopes affect behavior?",
            "How do you structure Spring modules for testability?",
            "When do you use @Bean instead of @Component?",
            "How does component scanning work?",
            "How do profiles support environment-specific configuration?",
            "How do you avoid circular dependencies in Spring?",
            "How does Spring Core relate to Spring Boot auto-configuration?",
            "How do you debug bean creation and wiring failures?"
        ],
        aiMentorTips: [
            "Master Spring Core concepts before relying on auto-configuration.",
            "Keep dependencies explicit via constructors.",
            "Design components around clear contracts.",
            "Use container features to simplify testing and modularity."
        ],
        summaryNotes: [
            "Spring Core is the architectural base of Spring ecosystem.",
            "IoC and DI enable clean, testable designs.",
            "Constructor injection clarifies dependency contracts.",
            "Strong Spring Core understanding accelerates framework depth."
        ],
        miniProject: "Build a Spring Core learner-service module with interface-driven components, constructor injection, and configurable beans.",
        expectedOutput: "Hello Spring\nUserController initialized\nUTC"
    },
];

const lessons = lessonDefinitions.map(buildLesson);
let currentIndex = 0;

function getCompletedLessons() {
    return JSON.parse(localStorage.getItem("learningCompletedLessons") || "[]");
}

function saveCompletedLessons(indices) {
    localStorage.setItem("learningCompletedLessons", JSON.stringify(indices));
}

function updateProgressUI() {
    const completed = getCompletedLessons();
    const progress = Math.round((completed.length / lessons.length) * 100);
    localStorage.setItem("learningProgress", progress);
    document.getElementById("progressValue").innerText = `${progress}%`;
}

function renderSidebar() {
    const chapterList = document.getElementById("chapterList");
    chapterList.innerHTML = "";

    lessons.forEach((lesson, index) => {
        chapterList.innerHTML += `
        <div class="chapter" onclick="loadLesson(${index})">
            ${lesson.title}
        </div>
        `;
    });
}

function loadLesson(index) {
    currentIndex = index;
    document.getElementById("lessonTitle").innerText = lessons[index].title;
    document.getElementById("lessonContent").innerHTML = lessons[index].content;
}

function nextLesson() {
    if (currentIndex < lessons.length - 1) {
        loadLesson(currentIndex + 1);
    }
}

function previousLesson() {
    if (currentIndex > 0) {
        loadLesson(currentIndex - 1);
    }
}

function markComplete() {
    const completed = getCompletedLessons();
    if (!completed.includes(currentIndex)) {
        completed.push(currentIndex);
        saveCompletedLessons(completed);
    }
    updateProgressUI();
}

window.loadLesson = loadLesson;
window.nextLesson = nextLesson;
window.previousLesson = previousLesson;
window.markComplete = markComplete;

renderSidebar();
loadLesson(0);
updateProgressUI();
