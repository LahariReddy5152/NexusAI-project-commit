import { buildLesson } from "../lesson-builder.js";

function javaLesson(title, extra) {
  return buildLesson({
    title,
    codeLang: "java",
    difficulty: extra.difficulty || "Beginner",
    duration: extra.duration || "25 min",
    description: extra.description,
    overview: extra.overview,
    theory: extra.theory,
    explanation: extra.explanation,
    realWorldExample: extra.realWorldExample,
    architectureDiagram: extra.architectureDiagram,
    flowDiagram: extra.flowDiagram,
    objectives: extra.objectives,
    syntax: extra.syntax,
    practicalExample: extra.practicalExample,
    bestPractices: extra.bestPractices,
    commonMistakes: extra.commonMistakes,
    exercise: extra.exercise,
    assignment: extra.assignment,
    miniProject: extra.miniProject,
    quizQuestions: extra.quizQuestions,
    interviewQuestions: extra.interviewQuestions,
    summary: extra.summary,
    resources: extra.resources
  });
}

export const JAVA_CURRICULUM = [
  javaLesson("Core Java", {
    description: "JVM, syntax, types, control flow, and methods",
    overview: "Core Java covers the language fundamentals: compilation to bytecode, JVM execution, primitives vs references, classes, methods, and packagesâ€”the base for Spring, Android, and enterprise backends.",
    theory: "Java is statically typed and compiled to bytecode run on the JVM. Every value is either a primitive (int, double, booleanâ€¦) or a reference to an object on the heap. Methods live on classes; entry point is public static void main. Packages organize namespaces; access modifiers control visibility.",
    explanation: "Variables must be declared with types. Control flow uses if/else, switch, for, while. Methods encapsulate behavior; overloading allows same name with different parameters. Java 17+ adds records, pattern matching, and text blocks for modern syntax.",
    realWorldExample: "Payment services use Core Java for transaction validation, id generation, and logging before handing off to Spring controllers. Android apps use the same language fundamentals on ART runtime.",
    architectureDiagram: `â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    compile     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    JVM     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  .java src  â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º â”‚  .class     â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â–º â”‚  Heap/Stack â”‚
â”‚  javac      â”‚                â”‚  bytecode   â”‚           â”‚  Execution  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜`,
    flowDiagram: `Write source â†’ javac compile â†’ ClassLoader loads bytecode â†’ JIT optimize hot methods â†’ Execute on JVM`,
    syntax: `public class Hello {\n  public static void main(String[] args) {\n    int count = 3;\n    System.out.println("Count: " + count);\n  }\n}`,
    practicalExample: `public class OrderValidator {\n  public static boolean isValidAmount(double amount) {\n    return amount > 0 && amount < 1_000_000;\n  }\n  public static void main(String[] args) {\n    System.out.println(isValidAmount(49.99));\n  }\n}`,
    bestPractices: ["Follow Java naming conventions", "Prefer immutability where possible", "Use try-with-resources for I/O", "Enable static analysis (SpotBugs, Checkstyle)"],
    commonMistakes: ["Comparing strings with == instead of equals()", "NullPointerException from unguarded references", "Mutable static state in web apps"],
    exercise: "Write a method isPalindrome(String s) ignoring case and non-alphanumeric characters.",
    assignment: "Implement a CLI grade calculator: read 5 scores, compute average, letter grade, and print a formatted report.",
    miniProject: "Build a console expense tracker: add/list/delete expenses with categories, persist to a CSV file.",
    quizQuestions: [
      { question: "Java source compiles to:", options: ["Machine code directly", "Bytecode", "Python bytecode", "Assembly only"], correct: 1 },
      { question: "main method signature is:", options: ["public void main()", "public static void main(String[] args)", "static main()", "void main(String)"], correct: 1 },
      { question: "Primitives are stored:", options: ["Only on heap", "By value for locals", "As references always", "In SQL"], correct: 1 }
    ],
    interviewQuestions: ["JDK vs JRE vs JVM?", "Explain pass-by-value in Java.", "What is autoboxing?"],
    summary: "Core Java is the foundation: types, control flow, methods, and JVM basics. Master equals/hashCode and null-safety early.",
    resources: ["Oracle Java Tutorials", "Effective Java (Joshua Bloch)", "JEP index for new features"]
  }),
  javaLesson("OOP", {
    description: "Classes, inheritance, polymorphism, interfaces, and encapsulation",
    difficulty: "Intermediate",
    overview: "Object-oriented programming models software as objects combining state (fields) and behavior (methods). Java OOP uses classes, interfaces, inheritance, and polymorphism to build maintainable systems.",
    theory: "Encapsulation hides internal state behind methods. Inheritance shares behavior via extends; composition is often preferred over deep hierarchies. Polymorphism lets a superclass reference invoke subclass overrides. Interfaces define contracts without implementation.",
    explanation: "Use private fields with getters/setters or records for data carriers. Override equals/hashCode when comparing by value. Abstract classes partial implementation; interfaces for capabilities (Comparable, Runnable).",
    realWorldExample: "Payment gateways model PaymentMethod interface with CreditCard, UPI, and Wallet implementationsâ€”new methods plug in without changing checkout flow.",
    architectureDiagram: `        <<interface>>\n        PaymentMethod\n              â–³\n      â”Œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”\n CreditCard  UPI   Wallet\n      â”‚\n CheckoutService uses PaymentMethod`,
    flowDiagram: `Define interface â†’ Implement classes â†’ Inject dependency â†’ Call polymorphic method â†’ Runtime dispatches to concrete type`,
    syntax: `public interface Shape { double area(); }\npublic class Circle implements Shape {\n  private final double r;\n  public Circle(double r) { this.r = r; }\n  public double area() { return Math.PI * r * r; }\n}`,
    practicalExample: `public abstract class Employee {\n  protected final String id;\n  public Employee(String id) { this.id = id; }\n  public abstract double pay();\n}\npublic class SalariedEmployee extends Employee {\n  private final double salary;\n  public SalariedEmployee(String id, double salary) { super(id); this.salary = salary; }\n  public double pay() { return salary / 12; }\n}`,
    exercise: "Design a Shape hierarchy (Circle, Rectangle) with area() and a printAreas(List<Shape>) method.",
    assignment: "Refactor a procedural order script into Order, LineItem, and DiscountPolicy classes with unit tests.",
    miniProject: "Library system: Book, Member, Loan classes with borrow/return rules and overdue fines.",
    bestPractices: ["Favor composition over deep inheritance", "Program to interfaces", "Keep classes cohesive", "Override equals/hashCode for value types"],
    commonMistakes: ["God classes with dozens of methods", "Leaky abstraction in subclasses", "Public fields breaking encapsulation"],
    quizQuestions: [
      { question: "Java supports multiple inheritance of:", options: ["Classes", "Interfaces", "Both classes", "Neither"], correct: 1 },
      { question: "@Override ensures:", options: ["Faster code", "Method matches superclass signature", "Private access", "Static binding"], correct: 1 }
    ],
    interviewQuestions: ["Composition vs inheritance?", "Explain dynamic dispatch.", "When to use abstract class vs interface?"],
    summary: "OOP in Java emphasizes encapsulation, interfaces, and shallow hierarchies. Favor composition and clear contracts.",
    resources: ["Oracle OOP trail", "Effective Java Item 18 (favor composition)"]
  }),
  javaLesson("Collections", {
    description: "List, Set, Map interfaces, implementations, internals, and time complexity",
    difficulty: "Intermediate",
    duration: "35 min",
    overview: "The Java Collections Framework provides List, Set, and Map abstractions for storing and querying in-memory data. Choosing the right implementation (ArrayList vs LinkedList, HashMap vs TreeMap) affects performance, ordering, and thread safety.",
    theory: "List: ordered sequence, allows duplicates. ArrayList backs with dynamic array (amortized O(1) append, O(n) middle insert). LinkedList is doubly-linked nodes (O(1) head/tail, O(n) random access). Set: no duplicates. HashSet uses hash table (O(1) average add/contains). TreeSet is red-black tree (O(log n), sorted). Map: key-value pairs. HashMap: array of buckets + linked/tree nodes; hashCode determines bucket; equals resolves collisions. LinkedHashMap maintains insertion order; TreeMap sorts by key.",
    explanation: "Program to interfaces: List<String> items = new ArrayList<>(). List API: add, get, remove, size, subList. Set API: add returns false if duplicate. Map API: put, get, getOrDefault, computeIfAbsent. Internal working: HashMap resizes when load factor exceeded (default 0.75); poor hashCode causes long buckets. Time complexity: ArrayList get O(1), insert at index O(n); HashMap get/put O(1) average; TreeMap O(log n). Use Collections.unmodifiableList for defensive copies.",
    realWorldExample: "Order service caches productIdâ†’Price in HashMap for cart totals; unique tag sets dedupe product labels; LinkedHashMap implements LRU cache with access-order mode.",
    architectureDiagram: `        Iterable\n            â”‚\n        Collection\n       â•±    â”‚    â•²\n   List   Set    Queue\n    â”‚      â”‚\nArrayList HashSet\nLinkedList TreeSet\n\nMap (separate hierarchy)\n â”œâ”€â”€ HashMap\n â”œâ”€â”€ LinkedHashMap\n â””â”€â”€ TreeMap`,
    flowDiagram: `Choose interface â†’ Pick implementation by access pattern â†’ Mutate via API â†’ Iterate (enhanced for / Iterator) â†’ Convert if needed`,
    objectives: [
      "Use List, Set, and Map interfaces idiomatically",
      "Compare ArrayList, LinkedList, HashSet, HashMap internals",
      "State time complexity for common operations",
      "Select implementation based on ordering and concurrency needs"
    ],
    syntax: `List<String> names = new ArrayList<>();\nSet<Integer> ids = new HashSet<>();\nMap<String, Integer> freq = new HashMap<>();\n\nnames.add("Ada");\nfreq.merge("sql", 1, Integer::sum);`,
    practicalExample: `// Word frequency with HashMap\nMap<String, Integer> freq = new HashMap<>();\nfor (String word : text.split("\\\\s+")) {\n  freq.merge(word.toLowerCase(), 1, Integer::sum);\n}\n\n// Unique + stable order with LinkedHashSet\nSet<String> seen = new LinkedHashSet<>();\nfor (String id : rawIds) seen.add(id);`,
    bestPractices: [
      "Declare interface types (List, Map) not concrete classes in APIs",
      "Override hashCode and equals together for custom Map keys",
      "Specify initial capacity for large HashMaps to reduce rehashing",
      "Use EnumSet/EnumMap for enum keys",
      "Prefer immutable copies (List.copyOf) when exposing internal state"
    ],
    commonMistakes: [
      "Using raw types without generics",
      "Mutating a collection while iterating (ConcurrentModificationException)",
      "Using HashMap key without stable hashCode/equals",
      "Choosing LinkedList for random-access heavy workloads",
      "Ignoring null key/value rules (HashMap allows one null key)"
    ],
    exercise: "Implement top-K frequent words from a paragraph using HashMap and a sorting or heap approach.",
    assignment: "Benchmark ArrayList vs LinkedList for 100k random get operations; document timings and explain results.",
    miniProject: "In-memory inventory: Map<SKU, Item>, Set<String> categories, List<RestockEvent> audit log with add/remove/search APIs.",
    quizQuestions: [
      { question: "ArrayList random access get(i) is:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 0 },
      { question: "HashSet guarantees:", options: ["Sorted order", "No duplicate elements", "Thread safety", "Null prohibition"], correct: 1 },
      { question: "HashMap average get/put complexity is:", options: ["O(1)", "O(n)", "O(log n)", "O(nÂ²)"], correct: 0 },
      { question: "Which preserves insertion order?", options: ["HashSet", "TreeSet", "LinkedHashMap", "PriorityQueue"], correct: 2 },
      { question: "ConcurrentModificationException often caused by:", options: ["Mutating during iteration", "Using generics", "Small capacity", "Using Map"], correct: 0 }
    ],
    interviewQuestions: [
      "How does HashMap resolve collisions in Java 8+?",
      "ArrayList vs LinkedListâ€”when to use each?",
      "Why must hashCode and equals be consistent for Map keys?",
      "Difference between HashMap, LinkedHashMap, and TreeMap?"
    ],
    summary: "Collections are daily toolsâ€”know List/Set/Map contracts, implementation internals, and Big-O for interviews and production tuning.",
    resources: ["Oracle Collections trail", "Effective Java Ch. 10â€“12", "Big-O cheat sheet for Java collections"]
  }),
  javaLesson("Streams", {
    description: "Functional-style pipelines: map, filter, reduce, collectors",
    difficulty: "Intermediate",
    duration: "28 min",
    overview: "The Streams API (Java 8+) processes sequences of elements declarativelyâ€”filtering, mapping, and aggregating without manual index loops.",
    theory: "Stream sources: Collection.stream(), Arrays.stream(), Stream.of(). Intermediate ops (filter, map) are lazy; terminal ops (collect, reduce, forEach) trigger execution. Primitive streams (IntStream) avoid boxing.",
    explanation: "Chain operations: list.stream().filter(x -> x > 0).map(String::valueOf).collect(Collectors.toList()). Parallel streams use ForkJoinPoolâ€”only when workload is CPU-heavy and data is large.",
    realWorldExample: "Invoice service sums line totals with stream().mapToDouble(Line::amount).sum() and groups by region via Collectors.groupingBy.",
    architectureDiagram: `Source â†’ stream() â†’ intermediate ops (lazy) â†’ terminal op â†’ result`,
    flowDiagram: `Create stream â†’ pipeline stages â†’ terminal triggers evaluation â†’ close`,
    syntax: `List<Integer> nums = List.of(1,2,3,4,5);\nint sum = nums.stream().filter(n -> n % 2 == 0).mapToInt(Integer::intValue).sum();`,
    practicalExample: `Map<String, Long> countByDept = employees.stream()\n  .collect(Collectors.groupingBy(Employee::dept, Collectors.counting()));`,
    bestPractices: ["Keep lambdas short and side-effect free", "Use method references when clearer", "Avoid parallel streams on small data", "Prefer collectors over manual mutable accumulators"],
    commonMistakes: ["Reusing a closed stream", "Modifying external state inside forEach", "Parallel streams on ordered IO tasks", "Boxing in tight loops with map instead of mapToInt"],
    exercise: "From a list of transactions, compute total amount per customer using groupingBy.",
    assignment: "Rewrite an imperative loop-based report as a single stream pipeline with tests.",
    miniProject: "Analytics dashboard module: filter active users, map to DTOs, sort by revenue, limit top 10.",
    quizQuestions: [
      { question: "Terminal operation example:", options: ["filter", "map", "collect", "distinct"], correct: 2 },
      { question: "Streams are:", options: ["Always parallel", "Lazy until terminal op", "Mutable collections", "SQL only"], correct: 1 }
    ],
    interviewQuestions: ["Intermediate vs terminal operations?", "When are parallel streams harmful?", "collect vs reduce?"],
    summary: "Streams express data transforms clearlyâ€”master collectors and know when imperative code is simpler.",
    resources: ["Oracle Streams tutorial", "Baeldung Java Streams"]
  }),
  javaLesson("Multithreading", {
    description: "Threads, executors, synchronization, and concurrent collections",
    difficulty: "Advanced",
    duration: "32 min",
    overview: "Multithreading enables concurrent execution for throughput and responsive I/O. Java provides threads, ExecutorService, locks, and java.util.concurrent utilities.",
    theory: "Each thread has its own stack; shared heap requires synchronization. synchronized and ReentrantLock protect critical sections. volatile ensures visibility. ExecutorService manages thread pools; Callable returns values via Future.",
    explanation: "Prefer executors over raw Thread. Use ConcurrentHashMap for shared maps. Avoid holding locks during I/O. CompletableFuture composes async pipelines.",
    realWorldExample: "Payment processor uses fixed thread pool to validate cards in parallel while main thread aggregates results with CompletableFuture.allOf.",
    architectureDiagram: `Main thread\n    â”‚\n    â–¼\nExecutorService pool\n â”œâ”€â”€ worker 1\n â”œâ”€â”€ worker 2\n â””â”€â”€ worker N`,
    flowDiagram: `Submit tasks â†’ queue â†’ worker executes â†’ Future completes â†’ shutdown`,
    syntax: `ExecutorService pool = Executors.newFixedThreadPool(4);\nFuture<Integer> f = pool.submit(() -> 42);\npool.shutdown();`,
    practicalExample: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {\n  var futures = urls.stream().map(url -> pool.submit(() -> fetch(url))).toList();\n}`,
    bestPractices: ["Use executors and bounded pools", "Minimize lock scope", "Prefer immutable messages between threads", "Name threads for debugging"],
    commonMistakes: ["Deadlock from lock ordering", "Shared mutable static fields", "Unbounded thread creation", "Ignoring InterruptedException"],
    exercise: "Download 5 URLs concurrently with ExecutorService and collect results in insertion order.",
    assignment: "Demonstrate a deadlock with two locks and fix with consistent lock ordering.",
    miniProject: "Producer-consumer queue with BlockingQueue and graceful shutdown.",
    quizQuestions: [
      { question: "volatile ensures:", options: ["Atomicity of compound ops", "Visibility across threads", "SQL isolation", "Heap allocation"], correct: 1 },
      { question: "ExecutorService helps:", options: ["Compile bytecode", "Manage thread pools", "Parse JSON", "Style CSS"], correct: 1 }
    ],
    interviewQuestions: ["synchronized vs ReentrantLock?", "What is happens-before?", "Virtual threads vs platform threads?"],
    summary: "Concurrency trades complexity for speedâ€”use high-level utilities and design for immutability.",
    resources: ["Java Concurrency in Practice", "Oracle concurrency tutorial"]
  }),
  javaLesson("JDBC", {
    description: "Connect Java applications to relational databases",
    difficulty: "Intermediate",
    duration: "30 min",
    overview: "JDBC is the standard API for SQL from Javaâ€”connections, prepared statements, result sets, and transaction control.",
    theory: "DriverManager or DataSource provides Connection. PreparedStatement binds parameters preventing SQL injection. ResultSet iterates rows. Auto-commit false + commit/rollback for transactions.",
    explanation: "Always use try-with-resources on Connection, Statement, ResultSet. Pool connections (HikariCP) in production. Map rows to objects manually or with JPA later.",
    realWorldExample: "Reporting job runs nightly JDBC batch inserts into warehouse tables with chunked commits.",
    architectureDiagram: `Java App â†’ DataSource â†’ JDBC Driver â†’ PostgreSQL`,
    flowDiagram: `getConnection â†’ prepareStatement â†’ set params â†’ executeQuery â†’ map ResultSet â†’ close`,
    syntax: `try (Connection c = dataSource.getConnection();\n     PreparedStatement ps = c.prepareStatement("SELECT id FROM users WHERE email = ?")) {\n  ps.setString(1, email);\n  try (ResultSet rs = ps.executeQuery()) { /* map rows */ }\n}`,
    practicalExample: `try (Connection c = DriverManager.getConnection(url, user, pass)) {\n  c.setAutoCommit(false);\n  try (PreparedStatement ps = c.prepareStatement("UPDATE accounts SET balance = balance - ? WHERE id = ?")) {\n    ps.setBigDecimal(1, amount); ps.setLong(2, fromId); ps.executeUpdate();\n    c.commit();\n  } catch (SQLException e) { c.rollback(); throw e; }\n}`,
    bestPractices: ["Parameterized queries only", "Pool connections", "Set query timeouts", "Close resources in try-with-resources"],
    commonMistakes: ["String concatenation in SQL", "Leaking connections", "Holding connections during slow business logic", "Ignoring SQLException cause chain"],
    exercise: "Write a UserRepository.findByEmail using JDBC and map to a simple User record.",
    assignment: "Implement batch insert of 1000 rows with addBatch/executeBatch and measure throughput.",
    miniProject: "CLI contact manager with H2 database: CRUD via JDBC and schema migration script.",
    quizQuestions: [
      { question: "PreparedStatement prevents:", options: ["SQL injection", "Deadlocks always", "Null pointers", "GC pauses"], correct: 0 },
      { question: "ResultSet iterates:", options: ["Query rows", "CSS rules", "HTTP headers", "Threads"], correct: 0 }
    ],
    interviewQuestions: ["Statement vs PreparedStatement?", "How do connection pools work?", "N+1 problem at JDBC layer?"],
    summary: "JDBC is the low-level DB bridgeâ€”use pools, parameters, and transactions correctly before ORMs.",
    resources: ["Oracle JDBC tutorial", "HikariCP documentation"]
  }),
  javaLesson("JVM", {
    description: "Memory model, garbage collection, class loading, and tuning",
    difficulty: "Advanced",
    duration: "30 min",
    overview: "The JVM executes bytecode, manages heap/stack memory, and garbage-collects objects. Understanding JVM behavior is key for performance and production incidents.",
    theory: "Heap: young (Eden, Survivor) and old generations. GC algorithms: G1 default on modern JDK. Metaspace holds class metadata. JIT compiles hot bytecode to native code. ClassLoader hierarchy loads classes.",
    explanation: "Monitor with jcmd, jstat, GC logs, and APM. Tune -Xms/-Xmx equally to avoid resize pauses. Avoid memory leaks (static caches holding references).",
    realWorldExample: "Microservice outage traced to full GC every 30s from oversized young generationâ€”fixed with heap dump analysis.",
    architectureDiagram: `JVM\n â”œâ”€â”€ Heap (objects)\n â”œâ”€â”€ Stacks (per thread)\n â”œâ”€â”€ Metaspace (classes)\n â””â”€â”€ GC / JIT`,
    flowDiagram: `new object â†’ Eden â†’ minor GC â†’ survivors â†’ tenured â†’ major GC â†’ reclaimed`,
    syntax: `// JVM flags example\n// java -Xms512m -Xmx512m -XX:+UseG1GC -Xlog:gc* -jar app.jar`,
    practicalExample: `// Capture heap dump on OOM\n// -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp\n// Analyze with Eclipse MAT or jhsdb`,
    bestPractices: ["Set explicit heap limits", "Log GC in production", "Profile before tuning flags", "Use JDK flight recorder for incidents"],
    commonMistakes: ["Max heap larger than physical RAM", "Ignoring metaspace leaks", "Tuning without metrics", "Creating excessive short-lived objects in hot loops"],
    exercise: "Generate a small heap dump from a sample app and identify the largest retained set.",
    assignment: "Write a one-page GC log interpretation guide for G1 young vs full collections.",
    miniProject: "Instrument a demo app with Micrometer JVM metrics and chart heap usage.",
    quizQuestions: [
      { question: "G1 GC is:", options: ["A CSS framework", "A garbage collector", "A JDBC driver", "A build tool"], correct: 1 },
      { question: "Stack stores:", options: ["All objects", "Per-thread frames and locals", "SQL indexes", "HTML DOM"], correct: 1 }
    ],
    interviewQuestions: ["Heap vs stack?", "How does G1 differ from Parallel GC?", "What is a classloader leak?"],
    summary: "JVM knowledge turns OOM mysteries into actionable tuningâ€”measure GC and heap before changing flags.",
    resources: ["Oracle GC tuning guide", "JDK Mission Control", "Eclipse MAT"]
  }),
  javaLesson("Exception Handling", {
    description: "try/catch/finally, custom exceptions, and error design",
    difficulty: "Beginner",
    duration: "22 min",
    overview: "Exceptions signal error conditions without crashing silently. Java checked vs unchecked exceptions shape API contracts and recovery strategies.",
    theory: "Throwable â†’ Error (don't catch) and Exception. Checked exceptions must be declared or caught (IOException). RuntimeException subclasses are unchecked. try-with-resources auto-closes AutoCloseable.",
    explanation: "Catch specific exceptions first. Wrap low-level errors in domain exceptions with context. Never swallow exceptions. Use Optional or Result types at boundaries where appropriate.",
    realWorldExample: "API layer maps DataAccessException to 503 with retry header while logging root SQLException.",
    architectureDiagram: `try â†’ success path\n   â†˜ Exception â†’ catch â†’ handle / wrap â†’ throw`,
    flowDiagram: `Throw â†’ unwind stack â†’ matching catch â†’ finally â†’ continue or propagate`,
    syntax: `try {\n  Files.readString(Path.of("config.json"));\n} catch (IOException e) {\n  logger.error("Config missing", e);\n  throw new IllegalStateException("startup failed", e);\n}`,
    practicalExample: `public class AccountNotFoundException extends RuntimeException {\n  public AccountNotFoundException(long id) { super("Account not found: " + id); }\n}`,
    bestPractices: ["Fail fast with clear messages", "Preserve cause with initCause/constructor", "Use try-with-resources", "Document thrown exceptions"],
    commonMistakes: ["catch (Exception e) everywhere", "Empty catch blocks", "Using exceptions for control flow", "Losing stack trace when rethrowing"],
    exercise: "Implement retry logic that catches only transient IOException subclasses.",
    assignment: "Design exception hierarchy for a payment service: PaymentException, InsufficientFunds, GatewayTimeout.",
    miniProject: "Config loader that validates JSON and throws ConfigException with field path in message.",
    quizQuestions: [
      { question: "Checked exceptions must be:", options: ["Ignored", "Handled or declared", "Always runtime", "Never thrown"], correct: 1 },
      { question: "try-with-resources requires:", options: ["AutoCloseable", "Serializable", "Runnable", "Cloneable"], correct: 0 }
    ],
    interviewQuestions: ["Checked vs uncheckedâ€”tradeoffs?", "When to create custom exceptions?", "finally vs try-with-resources?"],
    summary: "Exceptions are API signalsâ€”be specific, add context, and never hide failures.",
    resources: ["Oracle exceptions tutorial", "Effective Java Item 70â€“77"]
  }),
  javaLesson("File Handling", {
    description: "NIO.2 Path, Files API, and binary/text I/O",
    difficulty: "Beginner",
    duration: "22 min",
    overview: "Modern Java file I/O uses java.nio.file for paths, reading, writing, and walking directory treesâ€”replacing legacy File class patterns.",
    theory: "Path is immutable path representation. Files utility: readString, writeString, copy, move, delete, walk. Charset specifies text encoding. DirectoryStream lists entries.",
    explanation: "Prefer Path.of and Files methods over streams unless you need fine control. Handle IOException at boundaries. Use temp files with DELETE_ON_CLOSE for sensitive data.",
    realWorldExample: "ETL pipeline walks input directory, parses CSV files, and writes JSON lines to output folder nightly.",
    architectureDiagram: `App â†’ Path / Files API â†’ OS file system`,
    flowDiagram: `Resolve path â†’ open/read/write â†’ handle missing file â†’ close resources`,
    syntax: `Path path = Path.of("data", "output.txt");\nFiles.writeString(path, "hello", StandardCharsets.UTF_8);\nString content = Files.readString(path);`,
    practicalExample: `try (var lines = Files.lines(Path.of("orders.csv"))) {\n  long count = lines.skip(1).filter(l -> !l.isBlank()).count();\n}`,
    bestPractices: ["Specify StandardCharsets.UTF_8", "Validate paths against directory traversal", "Use try-with-resources for streams", "Check Files.exists/isReadable before read"],
    commonMistakes: ["Platform-dependent separators (use Path.of)", "Loading huge files entirely into memory", "Ignoring encoding", "Not atomic writes for critical files"],
    exercise: "Copy all .log files from one directory to an archive folder with date prefix.",
    assignment: "Implement safe path join that rejects paths escaping a base directory.",
    miniProject: "Folder sync utility: compare checksums and copy changed files only.",
    quizQuestions: [
      { question: "Path.of creates:", options: ["A file object on disk", "An immutable path", "A thread", "A socket"], correct: 1 },
      { question: "Files.readString reads:", options: ["Entire text file as String", "Only binary", "HTTP body", "JDBC row"], correct: 0 }
    ],
    interviewQuestions: ["Path vs legacy File?", "How to read large files line by line?", "Atomic file write pattern?"],
    summary: "NIO.2 Files API is the standard for path operationsâ€”always specify charset and handle IO errors.",
    resources: ["Oracle NIO file tutorial", "Baeldung Java NIO2"]
  })
];

export default JAVA_CURRICULUM;
