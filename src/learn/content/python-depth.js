import { buildLesson, mergeLesson } from "./lesson-builder.js";

const depth = (title, extra) => mergeLesson({ title }, extra);

const PYTHON_DEPTH = {
  Variables: depth("Variables", {
    overview: "Variables are named references to objects in memory. Python uses dynamic typing and assignment-based binding—master declaration, naming rules, and how references work before collections and functions.",
    theory: "Variable declaration in Python is assignment: the name binds to an object on the heap. Names are labels, not boxes; multiple names can reference the same object. Naming rules (PEP 8): snake_case, start with letter or underscore, no keywords. Memory: integers and small strings may be interned; reassigning redirects the name; mutating a shared object affects all references.",
    explanation: "Declaration: use = to bind a value (name = 42). No type keyword—types live on objects. Naming rules: user_age not userAge; _internal for module-private convention; ALL_CAPS for constants. Memory concepts: x = [1,2]; y = x means both names reference one list; x = [1,2] again creates a new list for x only. Use id() and is to explore identity vs equality.",
    architectureDiagram: `name ──► PyObject (type, value)\n         ▲\n    integer 42 / str "hi"\n\nx = 42  →  int object\ny = x   →  same object (reference)`,
    flowDiagram: `Assign literal → Create/reuse object → Bind name in namespace → Reassign redirects name → GC collects unreferenced objects`,
    objectives: ["Declare and reassign variables", "Apply PEP 8 naming rules", "Explain reference vs copy semantics", "Avoid shadowing builtins"],
    assignment: "Implement a variable inspector: after each assignment line in a snippet, print name, type(), and id().",
    miniProject: "Build a CLI profile manager storing name, age, city, and skills in variables with interactive updates.",
    interviewQuestions: ["Are Python variables pointers?", "Difference between mutable reassignment and in-place mutation?", "What is name binding?"],
    summary: "Variables are references—use clear snake_case names, understand reassignment vs mutation, and never shadow builtins.",
    resources: ["PEP 8 naming", "Python tutorial — variables", "Real Python: names and values"]
  }),
  "Data Types": depth("Data Types", {
    overview: "Built-in types—int, float, str, bool, list, tuple, dict, set—define valid operations. Choosing the right type prevents bugs and improves performance.",
    theory: "Scalars are immutable (int, float, str, bool); containers may be mutable (list, dict, set) or immutable (tuple). type() and isinstance() inspect runtime types. Prefer explicit conversion at system boundaries.",
    architectureDiagram: `Built-ins\n├── Numeric: int, float, complex\n├── Text: str\n├── Boolean: bool\n└── Collections: list, tuple, dict, set`,
    flowDiagram: `Choose type for domain → Create literal → Operate with type methods → Convert explicitly when crossing boundaries`,
    objectives: ["Classify values by type family", "Choose mutable vs immutable structures", "Use isinstance for safe checks"],
    assignment: "Write audit_type(value) returning numeric, text, sequence, mapping, set, or other.",
    miniProject: "Product catalog using dicts for products and lists for tags with search by field type.",
    interviewQuestions: ["Mutable vs immutable types?", "When is tuple better than list?", "How does Python handle int overflow?"],
    summary: "Pick types intentionally—mutability matters when sharing data across functions and threads.",
    resources: ["Python docs — stdtypes", "Real Python — data structures"]
  }),
  Strings: depth("Strings", {
    overview: "Strings are immutable Unicode sequences. Master indexing, slicing, formatting, and methods for parsing logs, APIs, and user input.",
    theory: "str objects are immutable; operations return new strings. f-strings (Python 3.6+) are preferred for formatting. Encoding (utf-8) matters at I/O boundaries.",
    architectureDiagram: `str (immutable)\n ├── indexing / slicing\n ├── methods: split, join, strip\n └── formatting: f"{var}"`,
    flowDiagram: `Raw text → normalize (strip, case) → parse/split → transform → encode for output`,
    objectives: ["Slice and index strings", "Format with f-strings", "Use split/join for parsing"],
    assignment: "Parse a CSV line handling quoted commas without the csv module.",
    miniProject: "Log parser extracting timestamps, levels, and messages from multiline entries.",
    interviewQuestions: ["Why are strings immutable?", "f-string vs .format()?", "How to handle Unicode normalization?"],
    summary: "Treat strings as immutable pipelines—normalize early, format with f-strings, encode explicitly on I/O.",
    resources: ["Python str methods", "Unicode HOWTO"]
  }),
  Operators: depth("Operators", {
    overview: "Operators express arithmetic, comparison, logic, and assignment. Precedence and truthiness drive control flow and bug patterns.",
    theory: "Arithmetic (+, -, *, /, //, %, **), comparisons (==, !=, <), logical (and, or, not), membership (in), identity (is). Short-circuit evaluation skips right operands when possible.",
    architectureDiagram: `Expression\n ├── unary: not, -\n ├── arithmetic\n ├── comparison chains\n └── logical short-circuit`,
    flowDiagram: `Evaluate operands → Apply precedence rules → Produce result object → Use in conditions`,
    objectives: ["Apply operator precedence", "Use is vs == correctly", "Leverage short-circuit logic"],
    assignment: "Implement safe_div(a, b) using operators and guard zero division.",
    miniProject: "Calculator REPL supporting +, -, *, / with precedence and history.",
    interviewQuestions: ["== vs is?", "What is truthiness?", "How does // differ from /?"],
    summary: "Know precedence tables; never use is for value equality; exploit short-circuit for guards.",
    resources: ["Python operator docs", "PEP 8 — comparisons"]
  }),
  Conditions: depth("Conditions", {
    overview: "if/elif/else and conditional expressions branch execution. Clear conditions make business rules readable and testable.",
    theory: "Boolean context uses truthiness. elif chains evaluate top-down. Ternary x if cond else y for simple assignments. Match/case (3.10+) handles structural patterns.",
    architectureDiagram: `if condition → block A\nelif condition → block B\nelse → default`,
    flowDiagram: `Evaluate condition → Enter branch → Execute block → Continue after suite`,
    objectives: ["Write readable if/elif chains", "Use ternary for simple cases", "Avoid deeply nested conditions"],
    assignment: "Refactor nested ifs into guard clauses for an order validation function.",
    miniProject: "Shipping cost rules engine: weight, region, and express flag determine price tiers.",
    interviewQuestions: ["Truthy values in Python?", "When to use match/case?", "Guard clauses vs nesting?"],
    summary: "Prefer flat guard clauses; name complex conditions; test all branches.",
    resources: ["Python control flow", "Refactoring Guru — guard clauses"]
  }),
  Loops: depth("Loops", {
    overview: "for and while iterate sequences and conditions. Loops power ETL, batch processing, and UI event polling patterns.",
    theory: "for iterates any iterable via iterator protocol. while repeats while condition is true. break exits, continue skips iteration. enumerate pairs index with value; zip aligns iterables.",
    architectureDiagram: `for item in iterable:\n    process(item)\n\nwhile cond:\n    step()`,
    flowDiagram: `Obtain iterator → next() → process → repeat until StopIteration or false condition`,
    objectives: ["Iterate with for and while", "Use enumerate and zip", "Control flow with break/continue"],
    assignment: "Find duplicate emails in a list without sets (then optimize with set).",
    miniProject: "Batch invoice processor reading records and applying tiered discounts.",
    interviewQuestions: ["for vs while use cases?", "What does enumerate return?", "Infinite loop pitfalls?"],
    summary: "Prefer for over while when iterating collections; use enumerate for indices.",
    resources: ["Python tutorial — loops", "itertools module"]
  }),
  Functions: depth("Functions", {
    overview: "Functions encapsulate reusable logic with parameters, return values, and scope rules. They are the primary unit of composition in Python.",
    theory: "def creates a function object. Arguments: positional, keyword, *args, **kwargs. Default args must be immutable to avoid shared state bugs. return sends a value back; None if omitted.",
    architectureDiagram: `Caller → stack frame → locals/globals\n         ↓\n    return value to caller`,
    flowDiagram: `Define function → Call with arguments → Bind parameters → Execute body → Return`,
    objectives: ["Define functions with clear signatures", "Use *args/**kwargs safely", "Document with docstrings"],
    assignment: "Write a retry(fn, attempts=3) higher-order function with exponential backoff.",
    miniProject: "CLI todo app with add/list/complete commands implemented as functions.",
    interviewQuestions: ["Default mutable argument trap?", "Scope: LEGB rule?", "First-class functions meaning?"],
    summary: "Small, pure functions with docstrings beat monolithic scripts—watch default mutable args.",
    resources: ["Real Python — functions", "PEP 257 docstrings"]
  }),
  Lists: depth("Lists", {
    overview: "Lists are ordered, mutable sequences. They back queues, buffers, and most dynamic collections in Python scripts.",
    theory: "Lists are arrays of references; append is amortized O(1). Slicing creates shallow copies. list comprehensions build lists declaratively.",
    architectureDiagram: `list → [ref0, ref1, ref2, ...]\n        mutable, ordered`,
    flowDiagram: `Create → append/extend → index/slice → sort/filter → consume`,
    objectives: ["Manipulate lists efficiently", "Use comprehensions", "Understand shallow copy"],
    assignment: "Implement rotate(lst, k) in O(n) time without extra modules.",
    miniProject: "Playlist manager with add, shuffle, and top-N by play count.",
    interviewQuestions: ["List vs tuple?", "Shallow vs deep copy?", "Comprehension vs map/filter?"],
    summary: "Lists are workhorses—use comprehensions for transforms, avoid repeated insert(0) on large lists.",
    resources: ["Python list docs", "Big-O cheat sheet for list ops"]
  }),
  Tuples: depth("Tuples", {
    overview: "Tuples are immutable ordered sequences, ideal for fixed records and dictionary keys.",
    theory: "Tuple literals use commas; single-element tuples need a trailing comma. Packing/unpacking assigns multiple names. Immutability is shallow—mutable elements can still change.",
    architectureDiagram: `tuple (immutable sequence)\n used for records & dict keys`,
    flowDiagram: `Pack values → pass as group → unpack in receiver`,
    objectives: ["Create and unpack tuples", "Use tuples as dict keys", "Know when immutability helps"],
    assignment: "Model RGB pixels as tuples; implement average_color(image_rows).",
    miniProject: "Coordinate tracker using tuples for points and computing bounding box.",
    interviewQuestions: ["Why tuple as dict key?", "Shallow immutability example?", "Namedtuple vs dataclass?"],
    summary: "Tuples signal fixed-shape records—prefer dataclasses/namedtuple for named fields.",
    resources: ["collections.namedtuple", "dataclasses module"]
  }),
  Dictionaries: depth("Dictionaries", {
    overview: "Dicts map hashable keys to values with average O(1) lookup—core to JSON APIs, caches, and configs.",
    theory: "Insertion order preserved (3.7+). Keys must be hashable. get() avoids KeyError. dict comprehensions build mappings; | merge operator combines dicts (3.9+).",
    architectureDiagram: `hash(key) → bucket → key:value pairs`,
    flowDiagram: `Hash key → lookup bucket → return value or insert`,
    objectives: ["CRUD on dicts", "Use get/setdefault", "Merge and iterate items"],
    assignment: "Word frequency counter for a text file using dict.get.",
    miniProject: "In-memory session store with TTL eviction using dict + timestamps.",
    interviewQuestions: ["How dict hashing works?", "Key must be?", "dict vs defaultdict?"],
    summary: "Dicts are Python's map type—use get for safe access, items() for iteration.",
    resources: ["Python dict docs", "JSON module interplay"]
  }),
  Sets: depth("Sets", {
    overview: "Sets store unique hashable elements with union/intersection operations—perfect for deduplication and membership tests.",
    theory: "Unordered collection; O(1) average membership. frozenset is immutable variant. Set ops: | union, & intersection, - difference.",
    architectureDiagram: `{a, b, c}  unique hash table`,
    flowDiagram: `Add elements → auto-dedupe → set algebra ops`,
    objectives: ["Deduplicate collections", "Apply set algebra", "Choose set vs list"],
    assignment: "Find mutual friends between two users given friend lists.",
    miniProject: "Tag intersection recommender: suggest posts sharing 2+ tags with user interests.",
    interviewQuestions: ["Set vs list membership speed?", "When frozenset?", "Hashable requirements?"],
    summary: "Sets excel at uniqueness and fast membership—use for dedupe and tag logic.",
    resources: ["Python set docs"]
  }),
  OOP: depth("OOP", {
    overview: "Classes model data and behavior with inheritance and polymorphism. OOP structures larger Python codebases and frameworks like Django and FastAPI.",
    theory: "class defines attributes and methods. self refers to instance. __init__ initializes. Inheritance shares behavior; composition often preferred. dunder methods customize protocol ( __str__, __eq__).",
    architectureDiagram: `class Animal\n    △\n class Dog  class Cat\n    │\n override speak()`,
    flowDiagram: `Define class → instantiate → call methods → optional override in subclass`,
    objectives: ["Define classes and methods", "Use inheritance responsibly", "Implement dunder methods"],
    assignment: "Model a bank account with deposit/withdraw and overdraft rules in a class.",
    miniProject: "Library system with Book, Member, Loan classes and overdue fine calculation.",
    interviewQuestions: ["Composition vs inheritance?", "__new__ vs __init__?", "MRO in multiple inheritance?"],
    summary: "Keep classes focused; favor composition; use dataclasses for data-heavy models.",
    resources: ["Python classes tutorial", "dataclasses module"]
  }),
  "File Handling": depth("File Handling", {
    overview: "Reading and writing files connects Python to configs, logs, CSV exports, and ML datasets on disk.",
    theory: "open() returns file object; use with for automatic close. Text vs binary mode. pathlib.Path is modern path API. csv and json modules parse structured files.",
    architectureDiagram: `App → open/pathlib → OS file system\n      → json/csv parsers`,
    flowDiagram: `Open with context manager → read/write chunks → flush/close automatically`,
    objectives: ["Use with open()", "Navigate paths with pathlib", "Parse JSON and CSV safely"],
    assignment: "Merge two JSON config files with deep override for nested keys.",
    miniProject: "ETL script: read CSV sales, aggregate by region, write summary JSON.",
    interviewQuestions: ["with statement benefits?", "Text vs binary mode?", "pathlib vs os.path?"],
    summary: "Always use context managers; pathlib for paths; validate external file input.",
    resources: ["pathlib docs", "csv module"]
  }),
  "Exception Handling": depth("Exception Handling", {
    overview: "try/except/finally manages errors without crashing production services. Good handling preserves context and user-safe messages.",
    theory: "Exceptions propagate up the stack until caught. except SpecificError as e captures instance. else runs if no error; finally always runs. raise reraises or creates new exceptions. Custom exceptions subclass Exception.",
    architectureDiagram: `try → operation\nexcept → handle\nelse → success path\nfinally → cleanup`,
    flowDiagram: `Try block → exception? → match handler → else/finally → continue`,
    objectives: ["Catch specific exceptions", "Use finally for cleanup", "Define domain exceptions"],
    assignment: "Wrap API client with retries only on transient HTTP errors.",
    miniProject: "Config loader that validates schema and raises ConfigError with line numbers.",
    interviewQuestions: ["except Exception pitfalls?", "When bare raise?", "EAFP vs LBYL?"],
    summary: "Catch specific errors; never swallow silently; chain exceptions with raise from.",
    resources: ["Python errors tutorial", "requests exceptions"]
  }),
  Decorators: depth("Decorators", {
    overview: "Decorators wrap functions to add logging, timing, auth, and caching without changing call sites.",
    theory: "Decorators are callables taking a function and returning a replacement. @syntax applies at definition time. functools.wraps preserves metadata. Class decorators exist but are less common.",
    architectureDiagram: `@decorator\n def fn  →  wrapper(fn) → registered callable`,
    flowDiagram: `Define function → apply decorator → replace name with wrapper → calls go through wrapper`,
    objectives: ["Write function decorators", "Use functools.wraps", "Apply decorators in web routes"],
    assignment: "Create @require_role('admin') checking a user dict argument.",
    miniProject: "API route registry using decorators to attach HTTP method metadata.",
    interviewQuestions: ["Decorator execution order?", "Parameterized decorators?", "wraps purpose?"],
    summary: "Decorators are syntactic sugar for higher-order functions—always use wraps.",
    resources: ["Real Python decorators", "functools.wraps"]
  }),
  Generators: depth("Generators", {
    overview: "Generators yield items lazily, enabling memory-efficient streaming over large files and datasets.",
    theory: "yield pauses function preserving state. Generator objects implement iterator protocol. Generator expressions are like list comps but lazy. send/throw advanced but rare.",
    architectureDiagram: `def gen(): yield x\n\ncaller ← next() ← suspended frame`,
    flowDiagram: `Call gen() → get generator → next() until StopIteration`,
    objectives: ["Write generator functions", "Use yield from", "Prefer generators for large data"],
    assignment: "Stream-parse a 1GB log file for ERROR lines without loading whole file.",
    miniProject: "Pipeline: read CSV rows → filter → map → write JSON lines incrementally.",
    interviewQuestions: ["Generator vs iterator?", "Memory profile of list vs gen?", "yield from use?"],
    summary: "Generators trade lazy evaluation for memory—ideal for ETL and pagination.",
    resources: ["Python yield docs", "itertools"]
  }),
  "Async Python": depth("Async Python", {
    overview: "async/await enables concurrent I/O-bound workloads on a single thread via cooperative multitasking.",
    theory: "async def creates coroutine. await yields control during I/O. asyncio event loop schedules tasks. gather/wait run concurrent coroutines. Do not block loop with CPU or sync I/O.",
    architectureDiagram: `Event Loop\n ├── coroutine A (await I/O)\n ├── coroutine B\n └── resumes on I/O complete`,
    flowDiagram: `async main → create tasks → await gather → loop schedules I/O → complete`,
    objectives: ["Define async functions", "Use asyncio.gather", "Avoid blocking the loop"],
    assignment: "Fetch 10 URLs concurrently with timeout and error collection.",
    miniProject: "Async news aggregator pulling RSS feeds with aiohttp and merging headlines.",
    interviewQuestions: ["Async vs threading?", "When not to use asyncio?", "How gather handles exceptions?"],
    summary: "Async shines for I/O concurrency—never block the event loop; use timeouts.",
    resources: ["asyncio docs", "aiohttp"]
  }),
  FastAPI: depth("FastAPI", {
    overview: "FastAPI builds high-performance APIs with type hints, automatic validation, and OpenAPI docs.",
    theory: "Built on Starlette (ASGI) and Pydantic. Route decorators map HTTP verbs. Dependency injection via Depends(). Automatic JSON serialization and 422 validation errors.",
    architectureDiagram: `Client → Uvicorn → FastAPI router → Pydantic validate → handler → JSON`,
    flowDiagram: `HTTP request → route match → validate body → business logic → response model`,
    objectives: ["Create routes with type hints", "Use Pydantic models", "Expose OpenAPI docs"],
    assignment: "Add JWT auth dependency protecting POST routes only.",
    miniProject: "Bookstore API: CRUD, search, pagination, and /health with tests via TestClient.",
    interviewQuestions: ["FastAPI vs Flask?", "How validation works?", "Sync route in async app?"],
    summary: "Leverage types and Pydantic at boundaries; keep routes thin; version your API.",
    resources: ["fastapi.tiangolo.com", "Pydantic docs"]
  })
};

export const MODULES_LESSON = buildLesson({
  title: "Modules",
  description: "Organize code with modules, packages, and imports",
  difficulty: "Intermediate",
  duration: "22 min",
  codeLang: "python",
  overview: "Modules and packages structure Python projects. Learn import mechanics, __name__ == '__main__', and package layout for reusable libraries.",
  theory: "A module is a .py file; a package is a directory with __init__.py. import loads once (cached in sys.modules). Relative imports work inside packages. __all__ controls public API.",
  explanation: "Split code by feature or layer. Use absolute imports in applications. Guard scripts with if __name__ == '__main__': for CLI entry points.",
  realWorldExample: "FastAPI apps split routers, models, and services into packages; pip-installable libraries expose clean __init__ exports.",
  architectureDiagram: `mypkg/\n ├── __init__.py\n ├── api.py\n └── utils.py\n\nimport mypkg.api`,
  flowDiagram: `import statement → find module → execute once → bind names in namespace`,
  objectives: ["Create modules and packages", "Use absolute vs relative imports", "Expose public API via __all__"],
  syntax: `# utils.py\nPI = 3.14\ndef area(r): return PI * r * r\n\n# main.py\nfrom utils import area`,
  practicalExample: `# package layout\n# ecommerce/\n#   __init__.py\n#   cart.py\n#   catalog.py\nfrom ecommerce.cart import add_item`,
  bestPractices: ["One responsibility per module", "Avoid circular imports", "Use python -m for CLI modules"],
  commonMistakes: ["from module import * polluting namespace", "Circular imports between siblings", "Running package modules without -m"],
  exercise: "Split a monolithic script into three modules: models, services, cli.",
  assignment: "Publish a mini package locally with pyproject.toml and import it from another folder.",
  miniProject: "Weather CLI package: api client module, formatter module, and __main__ entry.",
  quizQuestions: [
    { question: "sys.modules caches:", options: ["CSS files", "Imported modules", "HTTP sessions", "Threads"], correct: 1 },
    { question: "__name__ == '__main__' means:", options: ["Imported", "Run as script", "Error", "Package only"], correct: 1 }
  ],
  interviewQuestions: ["Absolute vs relative imports?", "How to avoid circular imports?", "What does python -m do?"],
  summary: "Modules scale codebases—design packages early, import explicitly, guard script entry points.",
  resources: ["Python modules tutorial", "PEP 8 imports", "packaging.python.org"]
});

export function applyPythonDepth(lesson) {
  const extra = PYTHON_DEPTH[lesson.title];
  return extra ? mergeLesson(lesson, extra) : lesson;
}

export default PYTHON_DEPTH;
