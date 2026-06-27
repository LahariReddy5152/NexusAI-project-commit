export const lessons = [
    {
        "id": 10,
        "title": "Sets",
        "description": "Use sets for unique collections and fast membership testing",
        "difficulty": "Beginner",
        "duration": "15 min",
        "explanation": "Sets are unordered collections of unique elements. They're perfect for deduplication and fast membership testing (O(1) average). Sets support mathematical operations: union (|), intersection (&), difference (-).",
        "realWorldExample": "Removing duplicates from data, checking if user has permission (in set), finding common elements between datasets, tag systems, unique visitor tracking.",
        "syntax": "# Create set\nfruits = {\"apple\", \"banana\", \"cherry\"}\nnumbers = set([1, 2, 3, 2, 1])  # {1, 2, 3}\n\n# Add/remove\nfruits.add(\"orange\")\nfruits.remove(\"banana\")\n\n# Set operations\na = {1, 2, 3}\nb = {2, 3, 4}\n\nunion = a | b        # {1, 2, 3, 4}\nintersection = a & b  # {2, 3}\ndifference = a - b   # {1}\n\n# Membership test\nif \"apple\" in fruits:\n    print(\"Found!\")",
        "practicalExample": "# Skill matching system\nrequired_skills = {\"Python\", \"SQL\", \"API\", \"Git\", \"Docker\"}\ncandidate_skills = {\"Python\", \"Java\", \"SQL\", \"AWS\", \"Docker\", \"React\"}\n\n# Find matching skills\nmatching = required_skills & candidate_skills\nprint(f\"Matching skills: {matching}\")\n\n# Find skill gaps\nmissing = required_skills - candidate_skills\nprint(f\"Need to learn: {missing}\")\n\n# Additional skills\nextra = candidate_skills - required_skills\nprint(f\"Extra skills: {extra}\")\n\n# Match percentage\nmatch_percent = len(matching) / len(required_skills) * 100\nprint(f\"Match: {match_percent:.1f}%\")",
        "bestPractices": [
            "Use sets for uniqueness requirements",
            "Use set operations instead of loops for comparisons",
            "Convert to sorted list for ordered display",
            "Use frozenset for immutable set keys",
            "Use sets for fast membership testing"
        ],
        "commonMistakes": [
            "Expecting ordered output from sets",
            "Using {} for empty set (creates dict instead)",
            "Trying to add unhashable types (lists, dicts)",
            "Confusing set operations with list methods",
            "Using set when order matters"
        ],
        "quizQuestions": [
            {
                "question": "How do you create an empty set?",
                "options": [
                    "{}",
                    "set()",
                    "[]",
                    "Set()"
                ],
                "correct": 1
            },
            {
                "question": "What is special about set elements?",
                "options": [
                    "They're ordered",
                    "They're unique",
                    "They're mutable",
                    "They're indexed"
                ],
                "correct": 1
            },
            {
                "question": "Which operator finds common elements?",
                "options": [
                    "|",
                    "&",
                    "-",
                    "^"
                ],
                "correct": 1
            },
            {
                "question": "What is the time complexity of 'in' for sets?",
                "options": [
                    "O(n)",
                    "O(log n)",
                    "O(1)",
                    "O(n²)"
                ],
                "correct": 2
            },
            {
                "question": "Can sets contain duplicate values?",
                "options": [
                    "Yes",
                    "No",
                    "Sometimes",
                    "Depends"
                ],
                "correct": 1
            }
        ],
        "exercise": "Given two lists of customer IDs: list1 = [1,2,3,4,5,6,7,8,9,10] and list2 = [5,6,7,8,9,10,11,12,13,14]. Use sets to find: common customers, customers only in list1, customers only in list2, and total unique customers."
    },
    {
        "id": 11,
        "title": "OOP",
        "description": "Master object-oriented programming with classes, objects, and methods",
        "difficulty": "Intermediate",
        "duration": "25 min",
        "explanation": "OOP organizes code into objects combining data (attributes) and behavior (methods). Classes are blueprints for objects. Key concepts: classes, objects, __init__ constructor, self parameter, methods, and instance variables.",
        "realWorldExample": "Modeling real-world entities (User, Product, Order), GUI components, game characters, API clients, database models, service layers in applications.",
        "syntax": "# Define class\nclass Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    \n    def bark(self):\n        return f\"{self.name} says Woof!\"\n    \n    def get_info(self):\n        return f\"{self.name} is a {self.breed}\"\n\n# Create object (instance)\nmy_dog = Dog(\"Rex\", \"German Shepherd\")\nprint(my_dog.bark())  # \"Rex says Woof!\"\nprint(my_dog.name)    # \"Rex\"",
        "practicalExample": "# Bank account system\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        self.transactions = []\n    \n    def deposit(self, amount):\n        if amount > 0:\n            self.balance += amount\n            self.transactions.append(f\"Deposit: +${amount}\")\n            return f\"Deposited ${amount}\"\n        return \"Invalid amount\"\n    \n    def withdraw(self, amount):\n        if 0 < amount <= self.balance:\n            self.balance -= amount\n            self.transactions.append(f\"Withdraw: -${amount}\")\n            return f\"Withdrew ${amount}\"\n        return \"Insufficient funds\"\n    \n    def get_balance(self):\n        return f\"Balance: ${self.balance}\"\n\n# Use the class\naccount = BankAccount(\"John\", 1000)\nprint(account.deposit(500))\nprint(account.withdraw(200))\nprint(account.get_balance())\nprint(f\"Transactions: {account.transactions}\")",
        "bestPractices": [
            "Use PascalCase for class names",
            "Keep classes focused on single responsibility",
            "Use __init__ for initialization",
            "Always use self as first parameter",
            "Add docstrings to classes and methods"
        ],
        "commonMistakes": [
            "Forgetting self parameter in methods",
            "Not calling super().__init__() in child classes",
            "Creating God classes with too many responsibilities",
            "Using class variables instead of instance variables",
            "Not validating input in __init__"
        ],
        "quizQuestions": [
            {
                "question": "What keyword defines a class?",
                "options": [
                    "class",
                    "Class",
                    "object",
                    "struct"
                ],
                "correct": 0
            },
            {
                "question": "What is __init__?",
                "options": [
                    "Initializer",
                    "Constructor method",
                    "Destructor",
                    "Main method"
                ],
                "correct": 1
            },
            {
                "question": "What does 'self' refer to?",
                "options": [
                    "The class",
                    "The instance",
                    "The method",
                    "The parameter"
                ],
                "correct": 1
            },
            {
                "question": "How do you create an object?",
                "options": [
                    "ClassName.new()",
                    "ClassName()",
                    "new ClassName()",
                    "create ClassName()"
                ],
                "correct": 1
            },
            {
                "question": "Instance variables are defined in:",
                "options": [
                    "Class body only",
                    "__init__ method",
                    "Any method",
                    "Outside class"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a Student class with: name, age, grade (list of scores). Methods: add_score(score), calculate_average(), get_grade_letter(). Create 2 students, add 3 scores each, and display their averages and letter grades (A: 90+, B: 80+, C: 70+, D: 60+, F: <60)."
    },
    {
        "id": 12,
        "title": "File Handling",
        "description": "Read from and write to files safely with context managers",
        "difficulty": "Intermediate",
        "duration": "20 min",
        "explanation": "File handling allows programs to persist data. Use with statement (context manager) for safe file operations. Modes: 'r' (read), 'w' (write), 'a' (append), 'r+' (read/write). Always specify encoding='utf-8'.",
        "realWorldExample": "Reading configuration files, writing logs, processing CSV data, saving user preferences, generating reports, importing/exporting data.",
        "syntax": "# Read file\nwith open('file.txt', 'r', encoding='utf-8') as f:\n    content = f.read()\n    print(content)\n\n# Write file\nwith open('output.txt', 'w', encoding='utf-8') as f:\n    f.write(\"Hello World\")\n\n# Append to file\nwith open('log.txt', 'a', encoding='utf-8') as f:\n    f.write(\"New log entry\\n\")\n\n# Read line by line\nwith open('data.txt', 'r') as f:\n    for line in f:\n        print(line.strip())",
        "practicalExample": "# Task manager with file persistence\ndef save_tasks(tasks, filename=\"tasks.txt\"):\n    with open(filename, 'w', encoding='utf-8') as f:\n        for task in tasks:\n            f.write(f\"{task}\\n\")\n\ndef load_tasks(filename=\"tasks.txt\"):\n    try:\n        with open(filename, 'r', encoding='utf-8') as f:\n            return [line.strip() for line in f]\n    except FileNotFoundError:\n        return []\n\n# Use the functions\nmy_tasks = [\"Learn Python\", \"Build project\", \"Review code\"]\nsave_tasks(my_tasks)\n\nloaded_tasks = load_tasks()\nprint(f\"Loaded tasks: {loaded_tasks}\")",
        "bestPractices": [
            "Always use 'with' statement for file operations",
            "Specify encoding='utf-8' explicitly",
            "Handle FileNotFoundError exceptions",
            "Use 'a' mode for logs, 'w' for new files",
            "Close files properly (with does this automatically)"
        ],
        "commonMistakes": [
            "Forgetting to close files (use with statement)",
            "Using wrong mode ('w' overwrites, 'a' appends)",
            "Not handling file not found errors",
            "Ignoring encoding issues across platforms",
            "Reading entire large files into memory"
        ],
        "quizQuestions": [
            {
                "question": "What does 'with' statement do?",
                "options": [
                    "Creates file",
                    "Auto-closes file",
                    "Deletes file",
                    "Renames file"
                ],
                "correct": 1
            },
            {
                "question": "Which mode overwrites existing file?",
                "options": [
                    "'r'",
                    "'w'",
                    "'a'",
                    "'x'"
                ],
                "correct": 1
            },
            {
                "question": "Which mode appends to file?",
                "options": [
                    "'r'",
                    "'w'",
                    "'a'",
                    "'x'"
                ],
                "correct": 2
            },
            {
                "question": "Why specify encoding='utf-8'?",
                "options": [
                    "Required",
                    "Cross-platform compatibility",
                    "Faster I/O",
                    "Smaller files"
                ],
                "correct": 1
            },
            {
                "question": "What exception for missing file?",
                "options": [
                    "IOError",
                    "FileNotFoundError",
                    "FileError",
                    "OSError"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a simple note-taking app. Functions: add_note(title, content) appends to notes.txt, view_notes() reads and displays all notes, delete_note(title) removes a note by title. Handle file not found gracefully. Test by adding 3 notes and viewing them."
    },
    {
        "id": 13,
        "title": "Exception Handling",
        "description": "Handle errors gracefully with try, except, finally blocks",
        "difficulty": "Intermediate",
        "duration": "22 min",
        "explanation": "Exception handling manages runtime errors. try block contains risky code, except catches specific exceptions, finally always executes (cleanup). Common exceptions: ValueError, TypeError, FileNotFoundError, KeyError.",
        "realWorldExample": "Validating user input, handling network failures, managing file operations, API error handling, database connection failures, preventing app crashes.",
        "syntax": "# Basic try-except\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\n\n# Multiple exceptions\ntry:\n    value = int(input(\"Enter number: \"))\n    result = 100 / value\nexcept ValueError:\n    print(\"Invalid input - not a number\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\nexcept Exception as e:\n    print(f\"Unexpected error: {e}\")\nfinally:\n    print(\"Cleanup code here\")",
        "practicalExample": "# Safe user input handler\ndef get_user_age():\n    while True:\n        try:\n            age_input = input(\"Enter your age: \")\n            age = int(age_input)\n            \n            if age < 0 or age > 120:\n                raise ValueError(\"Age must be 0-120\")\n            \n            return age\n            \n        except ValueError as e:\n            print(f\"Invalid input: {e}\")\n        except KeyboardInterrupt:\n            print(\"\\nInput cancelled\")\n            return None\n\n# Test the function\nage = get_user_age()\nif age:\n    print(f\"Your age is {age}\")\n    if age >= 18:\n        print(\"You are an adult\")\n    else:\n        print(\"You are a minor\")",
        "bestPractices": [
            "Catch specific exceptions, not bare 'except:'",
            "Use finally for cleanup operations",
            "Don't silence exceptions without logging",
            "Create custom exceptions for domain errors",
            "Use try-except around risky operations only"
        ],
        "commonMistakes": [
            "Catching Exception without need",
            "Swallowing exceptions silently",
            "Using exceptions for normal control flow",
            "Not cleaning up resources in finally",
            "Catching too broadly, hiding real bugs"
        ],
        "quizQuestions": [
            {
                "question": "Which block always executes?",
                "options": [
                    "try",
                    "except",
                    "finally",
                    "else"
                ],
                "correct": 2
            },
            {
                "question": "What does 'except' do?",
                "options": [
                    "Raises error",
                    "Catches exception",
                    "Creates exception",
                    "Ignores error"
                ],
                "correct": 1
            },
            {
                "question": "Which is a specific exception?",
                "options": [
                    "Exception",
                    "Error",
                    "ValueError",
                    "All are specific"
                ],
                "correct": 2
            },
            {
                "question": "What is bad practice?",
                "options": [
                    "Catching ValueError",
                    "Using bare except:",
                    "Using finally",
                    "Raising custom errors"
                ],
                "correct": 1
            },
            {
                "question": "When to use custom exceptions?",
                "options": [
                    "Never",
                    "For domain-specific errors",
                    "Always",
                    "Only in classes"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a safe division calculator. Function safe_divide(a, b) should: handle ZeroDivisionError, handle TypeError (non-numeric inputs), handle ValueError, return result or error message. Test with: (10, 2), (10, 0), ('10', 2), (10, '2')."
    }
];
