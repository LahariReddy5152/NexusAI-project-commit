export const lessons = [
    {
        "id": 7,
        "title": "Lists",
        "description": "Store and manipulate ordered collections with Python lists",
        "difficulty": "Beginner",
        "duration": "20 min",
        "explanation": "Lists are ordered, mutable collections. They store multiple items in a single variable. Lists support indexing, slicing, appending, inserting, removing, sorting, and comprehension-based transformations.",
        "realWorldExample": "Shopping carts, user lists, product inventories, log entries, batch processing, API response data, todo items.",
        "syntax": "# Create list\nfruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Access elements\nfirst = fruits[0]      # \"apple\"\nlast = fruits[-1]      # \"cherry\"\n\n# Modify list\nfruits.append(\"orange\")  # Add to end\nfruits.insert(1, \"mango\")  # Insert at index\nfruits.remove(\"banana\")  # Remove item\npopped = fruits.pop()  # Remove and return last\n\n# List operations\nlength = len(fruits)  # Get length\nsorted_fruits = sorted(fruits)  # Sort\nreversed_fruits = fruits[::-1]  # Reverse",
        "practicalExample": "# Task management system\ntasks = [\"Complete assignment\", \"Review code\", \"Send email\"]\ncompleted_tasks = []\n\n# Add new tasks\ntasks.append(\"Prepare presentation\")\ntasks.extend([\"Update docs\", \"Team meeting\"])\n\nprint(f\"Total tasks: {len(tasks)}\")\n\n# Complete tasks\nwhile tasks:\n    task = tasks.pop(0)\n    print(f\"Working on: {task}\")\n    completed_tasks.append(task)\n\nprint(f\"\\nCompleted: {completed_tasks}\")\nprint(f\"Remaining: {tasks}\")",
        "bestPractices": [
            "Use list comprehensions for simple transformations",
            "Use .append() to add single items, .extend() for multiple",
            "Use enumerate() when you need index and value",
            "Copy lists with [:] or list() to avoid aliasing",
            "Use list for ordered data, set for unique items"
        ],
        "commonMistakes": [
            "Index out of range errors",
            "Modifying list while iterating",
            "Confusing .append() (single item) with .extend() (list)",
            "Using 'del' incorrectly",
            "Not copying lists when needed (aliasing issues)"
        ],
        "quizQuestions": [
            {
                "question": "How do you access the first element?",
                "options": [
                    "list[1]",
                    "list[0]",
                    "list.first()",
                    "list.get(0)"
                ],
                "correct": 1
            },
            {
                "question": "Which method adds an item to the end?",
                "options": [
                    "add()",
                    "insert()",
                    "append()",
                    "push()"
                ],
                "correct": 2
            },
            {
                "question": "What does len(list) return?",
                "options": [
                    "Last index",
                    "Number of items",
                    "First item",
                    "List size in bytes"
                ],
                "correct": 1
            },
            {
                "question": "How do you remove last item?",
                "options": [
                    "list.remove()",
                    "list.delete()",
                    "list.pop()",
                    "list.del()"
                ],
                "correct": 2
            },
            {
                "question": "What is a list comprehension?",
                "options": [
                    "A loop",
                    "Concise way to create lists",
                    "A function",
                    "A method"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a grade analyzer. Given a list of student scores [85, 92, 78, 96, 88, 72, 91, 85, 89, 95], calculate: highest score, lowest score, average, and list of students who scored above 90. Use list comprehension for the last task."
    },
    {
        "id": 8,
        "title": "Tuples",
        "description": "Use immutable ordered collections with tuples for fixed data",
        "difficulty": "Beginner",
        "duration": "15 min",
        "explanation": "Tuples are ordered, immutable collections. Once created, elements cannot be changed. They're faster than lists and can be used as dictionary keys (if elements are hashable). Use parentheses () to create.",
        "realWorldExample": "Geographic coordinates (lat, lon), RGB color values (r, g, b), database records, function return values, configuration constants.",
        "syntax": "# Create tuple\npoint = (10, 20)\nname = \"John\",  # Single element (comma required!)\n\n# Access elements\nx = point[0]  # 10\ny = point[1]  # 20\n\n# Tuple unpacking\nx, y = point\n\n# Multiple return values\ndef get_user():\n    return \"John\", 25, \"admin\"\n\nname, age, role = get_user()",
        "practicalExample": "# RGB color system\nRED = (255, 0, 0)\nGREEN = (0, 255, 0)\nBLUE = (0, 0, 255)\n\n# Color mixing function\ndef mix_colors(color1, color2):\n    r = (color1[0] + color2[0]) // 2\n    g = (color1[1] + color2[1]) // 2\n    b = (color1[2] + color2[2]) // 2\n    return (r, g, b)\n\n# Mix red and blue to get purple\npurple = mix_colors(RED, BLUE)\nprint(f\"Purple RGB: {purple}\")\n\n# Unpack and use\nr, g, b = purple\nprint(f\"Red: {r}, Green: {g}, Blue: {b}\")",
        "bestPractices": [
            "Use tuples for fixed-size, immutable data",
            "Use tuple unpacking for multiple assignments",
            "Use tuples as dictionary keys (when hashable)",
            "Prefer tuples over lists for read-only data",
            "Remember single-element tuple needs comma: (x,)"
        ],
        "commonMistakes": [
            "Forgetting comma in single-element tuple",
            "Trying to modify tuple elements (TypeError)",
            "Confusing tuple with list syntax",
            "Putting mutable objects (lists) in tuples used as keys",
            "Not using tuple unpacking when beneficial"
        ],
        "quizQuestions": [
            {
                "question": "How do you create a single-element tuple?",
                "options": [
                    "(5)",
                    "[5]",
                    "(5,)",
                    "{5}"
                ],
                "correct": 2
            },
            {
                "question": "Are tuples mutable or immutable?",
                "options": [
                    "Mutable",
                    "Immutable",
                    "Both",
                    "Depends"
                ],
                "correct": 1
            },
            {
                "question": "What is tuple unpacking?",
                "options": [
                    "Deleting tuples",
                    "Assigning tuple elements to variables",
                    "Merging tuples",
                    "Converting to list"
                ],
                "correct": 1
            },
            {
                "question": "Can tuples be dictionary keys?",
                "options": [
                    "Never",
                    "Yes, if hashable",
                    "Only strings",
                    "Only integers"
                ],
                "correct": 1
            },
            {
                "question": "Which is faster for read-only data?",
                "options": [
                    "List",
                    "Tuple",
                    "Both equal",
                    "Dictionary"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a coordinate system for a game. Define 3 enemy positions as tuples (x, y). Write functions to: calculate distance between two points, check if two points are the same, and move a point by (dx, dy). Test with actual coordinates."
    },
    {
        "id": 9,
        "title": "Dictionaries",
        "description": "Store key-value pairs efficiently with Python dictionaries",
        "difficulty": "Beginner",
        "duration": "20 min",
        "explanation": "Dictionaries store data as key-value pairs. Keys must be unique and hashable. Values can be any type. Dictionaries provide fast O(1) lookup by key. Created with curly braces {} or dict() constructor.",
        "realWorldExample": "User profiles, API responses, configuration settings, database records, caching, counting occurrences, JSON data structures.",
        "syntax": "# Create dictionary\nuser = {\n    \"name\": \"John\",\n    \"age\": 25,\n    \"email\": \"john@example.com\"\n}\n\n# Access values\nname = user[\"name\"]  # \"John\"\nemail = user.get(\"email\")  # \"john@example.com\"\n\n# Modify\nuser[\"age\"] = 26  # Update\nuser[\"city\"] = \"NYC\"  # Add new key\n\n# Check existence\nif \"name\" in user:\n    print(\"Name exists\")\n\n# Iterate\nfor key, value in user.items():\n    print(f\"{key}: {value}\")",
        "practicalExample": "# Shopping cart system\ncart = {\n    \"laptop\": {\"price\": 999.99, \"qty\": 1},\n    \"mouse\": {\"price\": 25.50, \"qty\": 2},\n    \"keyboard\": {\"price\": 75.00, \"qty\": 1}\n}\n\n# Calculate total\ntotal = 0\nfor item, details in cart.items():\n    subtotal = details[\"price\"] * details[\"qty\"]\n    total += subtotal\n    print(f\"{item}: ${subtotal:.2f}\")\n\nprint(f\"\\nCart Total: ${total:.2f}\")\n\n# Add item\ncart[\"monitor\"] = {\"price\": 299.99, \"qty\": 1}\nprint(f\"\\nUpdated cart items: {len(cart)}\")",
        "bestPractices": [
            "Use .get(key, default) for safe access",
            "Use meaningful, consistent key names",
            "Use dict.items() to iterate key-value pairs",
            "Use dict comprehension for transformations",
            "Check key existence with 'in' before accessing"
        ],
        "commonMistakes": [
            "KeyError from direct access without checking",
            "Using mutable objects as keys",
            "Forgetting that keys must be unique",
            "Confusing .keys(), .values(), .items()",
            "Modifying dict while iterating"
        ],
        "quizQuestions": [
            {
                "question": "How do you access a dictionary value?",
                "options": [
                    "dict(key)",
                    "dict[key]",
                    "dict.get(key)",
                    "Both b and c"
                ],
                "correct": 3
            },
            {
                "question": "What does .get() return if key not found?",
                "options": [
                    "Error",
                    "None",
                    "Empty string",
                    "False"
                ],
                "correct": 1
            },
            {
                "question": "Can dictionary keys be duplicated?",
                "options": [
                    "Yes",
                    "No",
                    "Sometimes",
                    "Depends on type"
                ],
                "correct": 1
            },
            {
                "question": "Which method returns key-value pairs?",
                "options": [
                    ".keys()",
                    ".values()",
                    ".items()",
                    ".pairs()"
                ],
                "correct": 2
            },
            {
                "question": "What is the time complexity of dict lookup?",
                "options": [
                    "O(n)",
                    "O(log n)",
                    "O(1)",
                    "O(n²)"
                ],
                "correct": 2
            }
        ],
        "exercise": "Create a student gradebook. Store 3 students with their scores in 3 subjects. Calculate and display: each student's average, highest scoring student, subject-wise averages, and a list of students who scored above 85 in all subjects."
    }
];
