export const lessons = [
    {
        "id": 4,
        "title": "Conditions",
        "description": "Control program flow with if, elif, else statements and conditional logic",
        "difficulty": "Beginner",
        "duration": "18 min",
        "explanation": "Conditional statements execute different code blocks based on conditions. if checks a condition, elif checks additional conditions, else provides default behavior. Conditions use comparison and logical operators.",
        "realWorldExample": "Routing users based on roles, applying discounts based on purchase amount, validating form inputs, implementing game rules, determining shipping costs.",
        "syntax": "# Basic if statement\nage = 18\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Minor\")\n\n# if-elif-else\nscore = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'\nelse:\n    grade = 'F'\n\n# Nested conditions\nhas_ticket = True\nis_vip = False\nif has_ticket:\n    if is_vip:\n        print(\"VIP Lounge\")\n    else:\n        print(\"Regular seating\")\nelse:\n    print(\"No entry\")",
        "practicalExample": "# User role-based access\nuser_role = \"admin\"\nis_active = True\nlogin_attempts = 2\n\nif not is_active:\n    print(\"Account deactivated\")\nelif login_attempts >= 5:\n    print(\"Account locked - too many attempts\")\nelif user_role == \"admin\":\n    print(\"Welcome Admin - Full Access\")\n    print(\"Access: Dashboard, Users, Settings\")\nelif user_role == \"editor\":\n    print(\"Welcome Editor\")\n    print(\"Access: Content, Media\")\nelse:\n    print(\"Welcome User\")\n    print(\"Access: Read-only\")",
        "bestPractices": [
            "Order conditions from most specific to most general",
            "Use guard clauses to reduce nesting",
            "Avoid deep nesting (max 2-3 levels)",
            "Use elif instead of multiple if statements",
            "Consider dictionary dispatch for complex conditions"
        ],
        "commonMistakes": [
            "Using '=' instead of '==' in conditions",
            "Forgetting colon (:) after if/elif/else",
            "Incorrect indentation",
            "Ordering broad conditions before specific ones",
            "Not handling all possible cases (missing else)"
        ],
        "quizQuestions": [
            {
                "question": "What keyword checks additional conditions?",
                "options": [
                    "elseif",
                    "else if",
                    "elif",
                    "else"
                ],
                "correct": 2
            },
            {
                "question": "What is the output if age=17 and condition is age>=18?",
                "options": [
                    "True",
                    "False",
                    "Error",
                    "None"
                ],
                "correct": 1
            },
            {
                "question": "Which block runs if no conditions are met?",
                "options": [
                    "if",
                    "elif",
                    "else",
                    "finally"
                ],
                "correct": 2
            },
            {
                "question": "What is a guard clause?",
                "options": [
                    "A security feature",
                    "Early return to reduce nesting",
                    "A type of loop",
                    "An error handler"
                ],
                "correct": 1
            },
            {
                "question": "How many elif blocks can you have?",
                "options": [
                    "Only 1",
                    "Only 2",
                    "Unlimited",
                    "Maximum 10"
                ],
                "correct": 2
            }
        ],
        "exercise": "Create a grade calculator that takes a score (0-100) and returns: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60). Add special messages: 'Excellent!' for A, 'Good job!' for B, 'Pass' for C/D, 'Fail - study more' for F."
    },
    {
        "id": 5,
        "title": "Loops",
        "description": "Iterate efficiently with for and while loops for repeated operations",
        "difficulty": "Beginner",
        "duration": "20 min",
        "explanation": "Loops execute code repeatedly. for loops iterate over sequences (lists, strings, ranges). while loops repeat while a condition is true. Loop control: break (exit), continue (skip iteration).",
        "realWorldExample": "Processing CSV files row by row, retrying failed API calls, iterating through database results, generating reports, automating repetitive tasks.",
        "syntax": "# for loop\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# Iterate over list\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(fruit)\n\n# while loop\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\n# break and continue\nfor num in range(10):\n    if num == 3:\n        continue  # Skip 3\n    if num == 7:\n        break  # Stop at 7\n    print(num)",
        "practicalExample": "# Process user scores\nscores = [85, 92, 78, 96, 88, 72, 91]\npassed = []\nfailed = []\n\nfor score in scores:\n    if score < 80:\n        failed.append(score)\n        continue\n    passed.append(score)\n\nprint(f\"Passed: {passed}\")\nprint(f\"Failed: {failed}\")\nprint(f\"Pass rate: {len(passed)/len(scores)*100:.1f}%\")\n\n# Calculate total with while\ntotal = 0\ni = 0\nwhile i < len(scores):\n    total += scores[i]\n    i += 1\nprint(f\"Average: {total/len(scores):.2f}\")",
        "bestPractices": [
            "Use for loops for known iterations",
            "Use while loops for condition-based repetition",
            "Always ensure while loops have exit conditions",
            "Use enumerate() for index + value iteration",
            "Avoid modifying list while iterating over it"
        ],
        "commonMistakes": [
            "Infinite loops (missing increment in while)",
            "Off-by-one errors in range()",
            "Modifying list during iteration",
            "Using range(len(list)) instead of direct iteration",
            "Forgetting break conditions in while loops"
        ],
        "quizQuestions": [
            {
                "question": "What does range(5) produce?",
                "options": [
                    "1,2,3,4,5",
                    "0,1,2,3,4",
                    "0,1,2,3,4,5",
                    "Error"
                ],
                "correct": 1
            },
            {
                "question": "What does 'break' do?",
                "options": [
                    "Pauses loop",
                    "Exits loop",
                    "Skips iteration",
                    "Restarts loop"
                ],
                "correct": 1
            },
            {
                "question": "What does 'continue' do?",
                "options": [
                    "Exits loop",
                    "Pauses loop",
                    "Skips to next iteration",
                    "Restarts loop"
                ],
                "correct": 2
            },
            {
                "question": "Which loop is best for known iterations?",
                "options": [
                    "while",
                    "for",
                    "do-while",
                    "until"
                ],
                "correct": 1
            },
            {
                "question": "What is the output of: for i in range(3): print(i)?",
                "options": [
                    "1,2,3",
                    "0,1,2",
                    "0,1,2,3",
                    "1,2"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a number analyzer that iterates through numbers 1-50. For each number: print 'Even' or 'Odd', if divisible by 3 also print 'Fizz', if divisible by 5 also print 'Buzz', if divisible by both print 'FizzBuzz'. Skip numbers 13-17 entirely."
    },
    {
        "id": 6,
        "title": "Functions",
        "description": "Write reusable code blocks with functions, parameters, and return values",
        "difficulty": "Beginner",
        "duration": "22 min",
        "explanation": "Functions are reusable code blocks defined with def keyword. They accept parameters, perform operations, and return values. Functions promote code reuse, modularity, and easier testing.",
        "realWorldExample": "Validation functions, data transformation utilities, API call wrappers, calculation helpers, report generators - anywhere logic is reused.",
        "syntax": "# Basic function\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Call function\nmessage = greet(\"Lahari\")\nprint(message)\n\n# Multiple parameters\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)  # 8\n\n# Default parameters\ndef greet_with_title(name, title=\"User\"):\n    return f\"Hello, {title} {name}\"\n\nprint(greet_with_title(\"Doe\"))",
        "practicalExample": "# User validation functions\ndef validate_email(email):\n    if \"@\" not in email:\n        return False\n    if \".\" not in email.split(\"@\")[1]:\n        return False\n    return True\n\ndef validate_password(password):\n    if len(password) < 8:\n        return False, \"Password too short\"\n    if not any(char.isdigit() for char in password):\n        return False, \"Password needs a number\"\n    return True, \"Valid password\"\n\n# Test validations\nemail = \"user@example.com\"\nis_valid = validate_email(email)\nprint(f\"Email valid: {is_valid}\")\n\nvalid, msg = validate_password(\"pass1234\")\nprint(f\"Password: {msg}\")",
        "bestPractices": [
            "One function should do one thing well",
            "Use descriptive function names (verb_noun pattern)",
            "Keep functions short (under 20 lines ideal)",
            "Use return statements, not print, for results",
            "Add docstrings to explain purpose"
        ],
        "commonMistakes": [
            "Functions doing too many things",
            "Using print() instead of return",
            "Mutable default arguments (def f(x=[]))",
            "Not handling edge cases",
            "Forgetting to call the function"
        ],
        "quizQuestions": [
            {
                "question": "How do you define a function?",
                "options": [
                    "function myFunc():",
                    "def myFunc():",
                    "define myFunc():",
                    "func myFunc():"
                ],
                "correct": 1
            },
            {
                "question": "What keyword returns a value from a function?",
                "options": [
                    "give",
                    "return",
                    "yield",
                    "output"
                ],
                "correct": 1
            },
            {
                "question": "What is a parameter?",
                "options": [
                    "The function name",
                    "Input to a function",
                    "The return value",
                    "A variable"
                ],
                "correct": 1
            },
            {
                "question": "Default parameters are specified with:",
                "options": [
                    "=",
                    ":",
                    "=>",
                    "=="
                ],
                "correct": 0
            },
            {
                "question": "What does a docstring do?",
                "options": [
                    "Adds comments",
                    "Documents function purpose",
                    "Creates documentation",
                    "Prints help"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a calculator function that takes two numbers and an operation (add, subtract, multiply, divide). Return the result. Handle division by zero. Test with: add(10, 5), subtract(10, 5), multiply(10, 5), divide(10, 0)."
    }
];
