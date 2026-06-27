export const lessons = [
    {
        "id": 0,
        "title": "Variables",
        "description": "Learn how to store and manage data using variables in Python",
        "difficulty": "Beginner",
        "duration": "15 min",
        "explanation": "Variables are named containers that store data values. In Python, you don't need to declare the type of a variable - it's dynamically typed. Simply assign a value using the = operator.",
        "realWorldExample": "In a web application, variables store user information like name, age, and email. In data analysis, variables hold datasets and statistical results.",
        "syntax": "name = \"Lahari\"\\nage = 24\\nis_student = True\\n\\nx, y, z = 1, 2, 3\\n\\nage = \"twenty-four\"  # Valid in Python",
        "practicalExample": "# Practical example: User profile\nuser_name = \"Lahari Reddy\"\nuser_age = 28\nuser_email = \"laharireddy5152@gmail.com\"\naccount_balance = 1500.50\n\n# Update variables\nuser_age = 29  # Birthday passed\naccount_balance += 500  # Deposit\n\nprint(f\"User: {user_name}, Age: {user_age}\")",
        "bestPractices": [
            "Use descriptive names (user_age instead of x)",
            "Follow snake_case naming convention",
            "Avoid using Python keywords as variable names",
            "Initialize variables before use",
            "Use meaningful names that indicate purpose"
        ],
        "commonMistakes": [
            "Using single letter names like x, y, z for important data",
            "Forgetting that variables are case-sensitive (Name ≠ name)",
            "Using reserved keywords like 'if', 'for', 'class'",
            "Not initializing variables before using them",
            "Reusing variable names for different data types confusingly"
        ],
        "quizQuestions": [
            {
                "question": "What is the correct way to assign a string to a variable?",
                "options": [
                    "name = 'John'",
                    "name: 'John'",
                    "'John' = name",
                    "var name = 'John'"
                ],
                "correct": 0
            },
            {
                "question": "Which naming convention is recommended in Python?",
                "options": [
                    "camelCase",
                    "snake_case",
                    "PascalCase",
                    "kebab-case"
                ],
                "correct": 1
            },
            {
                "question": "What happens when you reassign a variable?",
                "options": [
                    "Error occurs",
                    "Old value is lost",
                    "Both values stored",
                    "Variable becomes constant"
                ],
                "correct": 1
            },
            {
                "question": "Which is a valid variable name?",
                "options": [
                    "2name",
                    "my-var",
                    "_private",
                    "class"
                ],
                "correct": 2
            },
            {
                "question": "What is the output of: x = 5; print(x)?",
                "options": [
                    "x",
                    "5",
                    "Error",
                    "None"
                ],
                "correct": 1
            }
        ],
        "exercise": "Create variables for your name, age, city, and profession. Then print them in a formatted sentence: 'My name is [name], I'm [age] years old, living in [city], working as a [profession].'"
    },
    {
        "id": 1,
        "title": "Data Types",
        "description": "Master Python's built-in data types: int, float, str, bool, list, tuple, dict, set",
        "difficulty": "Beginner",
        "duration": "20 min",
        "explanation": "Python has several built-in data types. Numbers (int, float, complex), Text (str), Boolean (bool), and Collections (list, tuple, set, dict). Each type has specific methods and use cases.",
        "realWorldExample": "E-commerce sites use integers for product IDs, floats for prices, strings for product names, booleans for availability status, and lists/dicts for shopping carts.",
        "syntax": "# Numeric types\ninteger = 42\nfloating = 3.14\ncomplex_num = 2 + 3j\n\n# Text type\ntext = \"Hello World\"\n\n# Boolean\nis_active = True\n\n# Check type\nprint(type(integer))  # <class 'int'>\nprint(type(text))     # <class 'str'>",
        "practicalExample": "# Product catalog\nproduct_id = 101  # int\nproduct_name = \"Laptop\"  # str\nprice = 999.99  # float\nin_stock = True  # bool\ntags = [\"electronics\", \"computers\"]  # list\nspecs = {\"ram\": \"16GB\", \"storage\": \"512GB\"}  # dict\n\nprint(f\"Product {product_id}: {product_name}\")\nprint(f\"Price: ${price}\")\nprint(f\"In stock: {in_stock}\")",
        "bestPractices": [
            "Use int for whole numbers, float for decimals",
            "Use descriptive variable names that hint at type",
            "Convert types explicitly when needed (int(), str())",
            "Use type() function to debug type issues",
            "Prefer specific types over generic ones"
        ],
        "commonMistakes": [
            "Confusing integer division (//) with float division (/)",
            "Using '==' to compare types instead of type()",
            "Forgetting that bool is subclass of int (True = 1)",
            "Using mutable types (list) as dictionary keys",
            "Not handling type conversion errors"
        ],
        "quizQuestions": [
            {
                "question": "What type is the value 3.14?",
                "options": [
                    "int",
                    "float",
                    "double",
                    "decimal"
                ],
                "correct": 1
            },
            {
                "question": "Which function returns the type of a variable?",
                "options": [
                    "typeof()",
                    "type()",
                    "getType()",
                    "class()"
                ],
                "correct": 1
            },
            {
                "question": "What is the result of type(True)?",
                "options": [
                    "<class 'bool'>",
                    "<class 'int'>",
                    "True",
                    "Error"
                ],
                "correct": 0
            },
            {
                "question": "Which is NOT a built-in Python type?",
                "options": [
                    "list",
                    "array",
                    "tuple",
                    "dict"
                ],
                "correct": 1
            },
            {
                "question": "How do you convert string '42' to integer?",
                "options": [
                    "int('42')",
                    "42.int()",
                    "convert('42')",
                    "toInt('42')"
                ],
                "correct": 0
            }
        ],
        "exercise": "Create a student record with: name (string), age (int), gpa (float), is_enrolled (bool), courses (list of 3 subjects), and grades (dictionary mapping course to grade). Print all information clearly."
    },
    {
        "id": 2,
        "title": "Strings",
        "description": "Work with text data using Python's powerful string methods and formatting",
        "difficulty": "Beginner",
        "duration": "18 min",
        "explanation": "Strings are sequences of characters enclosed in quotes. Python provides extensive string methods for manipulation, formatting, searching, and validation. Strings are immutable - operations create new strings.",
        "realWorldExample": "Processing user input, generating reports, formatting emails, validating passwords, extracting data from logs, building API responses.",
        "syntax": "# String creation\nsingle = 'Hello'\ndouble = \"World\"\nmultiline = \"\"\"Multiple\nlines\"\"\"\n\n# Common methods\ntext = \"Python Programming\"\nprint(text.upper())      # PYTHON PROGRAMMING\nprint(text.lower())      # python programming\nprint(text.replace(\"Python\", \"Java\"))\nprint(text.split())      # ['Python', 'Programming']\nprint(len(text))         # 18",
        "practicalExample": "# Email validation and formatting\nemail = \"  USER@EXAMPLE.COM  \"\n\n# Clean and validate\nclean_email = email.strip().lower()\nprint(f\"Clean email: {clean_email}\")\n\n# Check domain\nif \"@example.com\" in clean_email:\n    print(\"Valid company email\")\n\n# Extract username\nusername = clean_email.split(\"@\")[0]\nprint(f\"Username: {username}\")\n\n# Format message\nmessage = f\"Welcome {username.title()}!\"\nprint(message)",
        "bestPractices": [
            "Use f-strings for string interpolation (Python 3.6+)",
            "Use .strip() to clean user input",
            "Use .lower() or .casefold() for case-insensitive comparison",
            "Prefer .join() over + for concatenating many strings",
            "Use raw strings (r'...') for regex patterns"
        ],
        "commonMistakes": [
            "Forgetting strings are immutable (methods return new strings)",
            "Using + to concatenate in loops (performance issue)",
            "Not handling None before calling string methods",
            "Confusing 'is' with '==' for string comparison",
            "Forgetting to strip whitespace from user input"
        ],
        "quizQuestions": [
            {
                "question": "Which method converts string to uppercase?",
                "options": [
                    "toUpperCase()",
                    "upper()",
                    "toupper()",
                    "capitalize()"
                ],
                "correct": 1
            },
            {
                "question": "What does 'hello'.strip() do?",
                "options": [
                    "Removes 'hello'",
                    "Removes whitespace",
                    "Splits string",
                    "Converts to list"
                ],
                "correct": 1
            },
            {
                "question": "How do you check if 'Python' is in a string?",
                "options": [
                    "string.has('Python')",
                    "'Python' in string",
                    "string.contains('Python')",
                    "string.indexOf('Python')"
                ],
                "correct": 1
            },
            {
                "question": "What is an f-string?",
                "options": [
                    "Fast string",
                    "Formatted string literal",
                    "File string",
                    "Function string"
                ],
                "correct": 1
            },
            {
                "question": "Which joins list ['a','b','c'] into 'a-b-c'?",
                "options": [
                    "'-'.join(['a','b','c'])",
                    "['a','b','c'].join('-')",
                    "join('-', ['a','b','c'])",
                    "concat('-', ['a','b','c'])"
                ],
                "correct": 0
            }
        ],
        "exercise": "Create a name formatter that takes a full name (first and last), converts it to title case, extracts initials, and creates a username by combining first initial + last name in lowercase. Example: 'john doe' → 'John Doe', 'JD', 'jdoe'."
    },
    {
        "id": 3,
        "title": "Operators",
        "description": "Perform operations using arithmetic, comparison, logical, and assignment operators",
        "difficulty": "Beginner",
        "duration": "15 min",
        "explanation": "Operators perform operations on variables and values. Python supports arithmetic (+, -, *, /), comparison (==, !=, <, >), logical (and, or, not), assignment (=, +=, -=), and more.",
        "realWorldExample": "Calculating totals in shopping carts, checking eligibility criteria, validating user input, implementing game logic, processing financial transactions.",
        "syntax": "# Arithmetic operators\na = 10 + 5    # Addition: 15\nb = 10 - 3    # Subtraction: 7\nc = 4 * 2     # Multiplication: 8\nd = 10 / 3    # Division: 3.333...\ne = 10 // 3   # Floor division: 3\nf = 10 % 3    # Modulus: 1\ng = 2 ** 3    # Exponentiation: 8\n\n# Comparison operators\nprint(5 == 5)   # True\nprint(5 != 3)   # True\nprint(5 > 3)    # True\nprint(5 < 3)    # False\n\n# Logical operators\nage = 25\nhas_id = True\ncan_enter = age >= 18 and has_id  # True",
        "practicalExample": "# Shopping cart calculation\nitem_price = 49.99\nquantity = 3\ndiscount = 0.15  # 15% off\nis_member = True\n\n# Calculate total\nsubtotal = item_price * quantity\nmember_discount = subtotal * discount if is_member else 0\ntotal = subtotal - member_discount\n\n# Apply tax\ntax = total * 0.08\nfinal_total = total + tax\n\nprint(f\"Subtotal: ${subtotal:.2f}\")\nprint(f\"Discount: -${member_discount:.2f}\")\nprint(f\"Tax: ${tax:.2f}\")\nprint(f\"Total: ${final_total:.2f}\")",
        "bestPractices": [
            "Use parentheses to clarify complex expressions",
            "Be careful with integer division (//) vs float division (/)",
            "Use 'and'/'or' instead of '&&'/'||' (Java/C style)",
            "Use '==' for value comparison, 'is' for identity",
            "Break complex conditions into named booleans"
        ],
        "commonMistakes": [
            "Using '=' instead of '==' in conditions",
            "Confusing 'is' with '==' for value comparison",
            "Forgetting operator precedence (use parentheses)",
            "Using 'and'/'or' with non-boolean values unexpectedly",
            "Integer division truncation surprises (10/3 = 3.33, 10//3 = 3)"
        ],
        "quizQuestions": [
            {
                "question": "What is the result of 10 // 3?",
                "options": [
                    "3.33",
                    "3",
                    "1",
                    "Error"
                ],
                "correct": 1
            },
            {
                "question": "Which operator checks equality?",
                "options": [
                    "=",
                    "==",
                    "===",
                    "equals()"
                ],
                "correct": 1
            },
            {
                "question": "What does 'and' do?",
                "options": [
                    "Adds values",
                    "Returns True if both are True",
                    "Compares values",
                    "Multiplies values"
                ],
                "correct": 1
            },
            {
                "question": "What is 2 ** 3?",
                "options": [
                    "6",
                    "8",
                    "9",
                    "5"
                ],
                "correct": 1
            },
            {
                "question": "Which operator adds AND assigns?",
                "options": [
                    "=",
                    "+=",
                    "==",
                    "&&="
                ],
                "correct": 1
            }
        ],
        "exercise": "Create a loan eligibility checker. A person is eligible if: age >= 18 AND income >= 30000 AND credit_score >= 650. Test with different scenarios and print clear eligibility messages."
    }
];
