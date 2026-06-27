export const lessons = [
  {
    title: "Decorators",
    description: "Wrap functions to add logging, timing, and auth behavior",
    difficulty: "Advanced",
    duration: "25 min",
    explanation: "Decorators are functions that take another function and extend its behavior without modifying its source. They use @syntax and are essential for middleware, caching, and validation in Python web frameworks.",
    realWorldExample: "Flask and FastAPI use decorators for route registration (@app.get) and dependency injection.",
    syntax: "def decorator(fn):\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper\n\n@decorator\ndef greet():\n    return 'hi'",
    practicalExample: "import time\ndef timer(fn):\n    def wrapper(*a, **k):\n        start = time.time()\n        result = fn(*a, **k)\n        print(f'{fn.__name__}: {time.time()-start:.3f}s')\n        return result\n    return wrapper\n\n@timer\ndef work():\n    sum(range(100000))",
    bestPractices: ["Use functools.wraps to preserve metadata", "Keep decorators focused", "Document side effects"],
    commonMistakes: ["Forgetting to return wrapper", "Over-nesting decorators", "Mutating closed-over state incorrectly"],
    exercise: "Write a @retry decorator that attempts a function up to 3 times on failure.",
    quizQuestions: [
      { question: "What does @decorator do?", options: ["Deletes function", "Wraps function", "Imports module", "Creates class"], correct: 1 },
      { question: "Why use functools.wraps?", options: ["Speed", "Preserve __name__", "Security", "Typing"], correct: 1 }
    ]
  },
  {
    title: "Generators",
    description: "Lazy iteration with yield for memory-efficient pipelines",
    difficulty: "Advanced",
    duration: "22 min",
    explanation: "Generators produce values on demand using yield instead of building full lists in memory. They power streaming ETL, large file processing, and infinite sequences.",
    realWorldExample: "Reading multi-GB log files line-by-line without loading entire file into RAM.",
    syntax: "def gen():\n    yield 1\n    yield 2",
    practicalExample: "def read_chunks(path, size=1024):\n    with open(path) as f:\n        while chunk := f.read(size):\n            yield chunk",
    bestPractices: ["Use generators for large datasets", "Combine with itertools", "Close resources in finally"],
    commonMistakes: ["Exhausting generator twice", "Confusing return vs yield", "Not handling StopIteration"],
    exercise: "Build a generator that yields Fibonacci numbers up to a limit.",
    quizQuestions: [
      { question: "Generators save memory by:", options: ["Lazy evaluation", "Copying lists", "Using threads", "Caching all"], correct: 0 },
      { question: "yield returns control until:", options: ["next() is called", "Process exits", "GC runs", "Import completes"], correct: 0 }
    ]
  },
  {
    title: "Async Python",
    description: "async/await for concurrent I/O-bound workloads",
    difficulty: "Advanced",
    duration: "28 min",
    explanation: "asyncio enables cooperative multitasking for I/O-bound tasks. async def defines coroutines; await yields control while waiting on network or disk.",
    realWorldExample: "Fetching hundreds of API endpoints concurrently in a data ingestion pipeline.",
    syntax: "async def fetch():\n    await asyncio.sleep(1)\n    return 'done'",
    practicalExample: "import asyncio\nasync def main():\n    results = await asyncio.gather(fetch_a(), fetch_b())\n    print(results)\nasyncio.run(main())",
    bestPractices: ["Use async for I/O not CPU", "Prefer asyncio.gather for parallel tasks", "Set timeouts"],
    commonMistakes: ["Blocking the event loop", "Mixing sync and async incorrectly", "CPU work in async handlers"],
    exercise: "Write async functions that fetch 3 URLs concurrently with asyncio.gather.",
    quizQuestions: [
      { question: "asyncio is best for:", options: ["CPU-bound math", "I/O-bound tasks", "GUI rendering", "Memory allocation"], correct: 1 },
      { question: "await pauses a coroutine until:", options: ["I/O completes", "All threads finish", "GC completes", "Import ends"], correct: 0 }
    ]
  },
  {
    title: "FastAPI",
    description: "Build high-performance REST APIs with type hints",
    difficulty: "Advanced",
    duration: "30 min",
    explanation: "FastAPI is a modern Python web framework built on Starlette and Pydantic. It provides automatic OpenAPI docs, validation, and async support.",
    realWorldExample: "AI microservices exposing /predict and /embed endpoints with automatic Swagger UI.",
    syntax: "from fastapi import FastAPI\napp = FastAPI()\n@app.get('/')\ndef root():\n    return {'ok': True}",
    practicalExample: "from fastapi import FastAPI\nfrom pydantic import BaseModel\napp = FastAPI()\nclass Item(BaseModel):\n    name: str\n@app.post('/items')\ndef create(item: Item):\n    return item",
    bestPractices: ["Use Pydantic models", "Version APIs", "Add health checks", "Use dependency injection"],
    commonMistakes: ["Skipping input validation", "Blocking calls in async routes", "No error handlers"],
    exercise: "Create a FastAPI app with GET /health and POST /echo that returns the request body.",
    quizQuestions: [
      { question: "FastAPI uses which for validation?", options: ["Pydantic", "Django ORM", "SQLAlchemy", "Jinja"], correct: 0 },
      { question: "Automatic API docs are served via:", options: ["OpenAPI/Swagger", "FTP", "SMTP", "DNS"], correct: 0 }
    ]
  }
];
