export type Question = {
    id: number
    question: string
    options: string[]
    answer: string
    tags: string[]
}

export const ALL_QUESTIONS: Question[] = [
    // #tech #cs
    { id: 1, question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], answer: "Central Processing Unit", tags: ["#tech", "#cs"] },
    { id: 2, question: "Which data structure works on LIFO principle?", options: ["Queue", "Stack", "Array", "Tree"], answer: "Stack", tags: ["#tech", "#cs"] },
    { id: 3, question: "Time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: "O(log n)", tags: ["#tech", "#cs"] },
    { id: 4, question: "Which language is called the 'mother of all languages'?", options: ["C", "Assembly", "FORTRAN", "COBOL"], answer: "C", tags: ["#tech", "#cs"] },
    { id: 5, question: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Access Module", "Read And Modify"], answer: "Random Access Memory", tags: ["#tech", "#cs"] },
    { id: 6, question: "Output of `typeof null` in JavaScript?", options: ["null", "undefined", "object", "string"], answer: "object", tags: ["#tech", "#webdev"] },
    { id: 7, question: "Which sorting algorithm is always O(n log n) worst case?", options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"], answer: "Merge Sort", tags: ["#tech", "#cs"] },
    { id: 8, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "System Query Language", "Sequential Query Language"], answer: "Structured Query Language", tags: ["#tech", "#cs"] },
    { id: 9, question: "Which is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], answer: "Float", tags: ["#tech", "#webdev"] },
    { id: 10, question: "2 to the power of 10?", options: ["512", "1024", "2048", "256"], answer: "1024", tags: ["#tech", "#cs"] },
    { id: 11, question: "Which protocol does HTTPS use for encryption?", options: ["HTTP", "TLS/SSL", "FTP", "SSH"], answer: "TLS/SSL", tags: ["#tech", "#webdev"] },
    { id: 12, question: "DOM stands for?", options: ["Document Object Model", "Data Object Management", "Dynamic Object Model", "Document Oriented Module"], answer: "Document Object Model", tags: ["#tech", "#webdev"] },
    { id: 13, question: "Which company created React.js?", options: ["Google", "Microsoft", "Meta (Facebook)", "Twitter"], answer: "Meta (Facebook)", tags: ["#tech", "#webdev"] },
    { id: 14, question: "Git command to save changes locally?", options: ["git push", "git pull", "git commit", "git merge"], answer: "git commit", tags: ["#tech", "#cs"] },
    { id: 15, question: "Which of these is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], answer: "MongoDB", tags: ["#tech", "#cs"] },
    { id: 16, question: "HTTP status code for 'Not Found'?", options: ["200", "301", "403", "404"], answer: "404", tags: ["#tech", "#webdev"] },
    { id: 17, question: "In OOP, what is Encapsulation?", options: ["Hiding internal details", "Inheriting from a class", "Creating multiple objects", "Overriding methods"], answer: "Hiding internal details", tags: ["#tech", "#cs"] },
    { id: 18, question: "Which loop runs at least once?", options: ["for", "while", "do-while", "forEach"], answer: "do-while", tags: ["#tech", "#cs"] },
    { id: 19, question: "How many bits in a byte?", options: ["4", "8", "16", "32"], answer: "8", tags: ["#tech", "#general"] },
    { id: 20, question: "Full form of API?", options: ["Application Programming Interface", "Automated Process Integration", "App Protocol Interface", "Application Process Integration"], answer: "Application Programming Interface", tags: ["#tech", "#webdev"] },
    { id: 21, question: "What is a primary key in a database?", options: ["A key that can be null", "Uniquely identifies each row", "A foreign key reference", "Any column in a table"], answer: "Uniquely identifies each row", tags: ["#tech", "#cs"] },
    { id: 22, question: "Which of these is a version control system?", options: ["Docker", "Git", "Kubernetes", "Nginx"], answer: "Git", tags: ["#tech", "#cs"] },
    { id: 23, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: "Cascading Style Sheets", tags: ["#tech", "#webdev"] },
    { id: 24, question: "In Python, what is a list comprehension?", options: ["A way to explain lists", "A concise way to create lists", "A list sorting method", "A list filtering algorithm"], answer: "A concise way to create lists", tags: ["#tech", "#cs"] },
    { id: 25, question: "What is the default port for HTTP?", options: ["443", "22", "80", "8080"], answer: "80", tags: ["#tech", "#webdev"] },

    // #funny
    { id: 26, question: "A developer's best friend at 3am is?", options: ["Stack Overflow", "Their mom", "Coffee", "Sleep"], answer: "Stack Overflow", tags: ["#funny"] },
    { id: 27, question: "Programmer's favourite music genre?", options: ["Classical", "Jazz", "Al-go-rithm", "Pop"], answer: "Al-go-rithm", tags: ["#funny"] },
    { id: 28, question: "Why do programmers prefer dark mode?", options: ["Saves battery", "Because light attracts bugs", "Looks cool", "It's faster"], answer: "Because light attracts bugs", tags: ["#funny"] },
    { id: 29, question: "How many programmers to change a light bulb?", options: ["1", "2", "None — it's a hardware problem", "Depends on the framework"], answer: "None — it's a hardware problem", tags: ["#funny"] },
    { id: 30, question: "What's a student's most used excuse?", options: ["Dog ate my assignment", "My WiFi was down", "Was at the library", "Server was down"], answer: "My WiFi was down", tags: ["#funny"] },
    { id: 31, question: "When a CS student says 'it works on my machine'?", options: ["It works everywhere", "It won't work in production", "Debug is done", "It's fully tested"], answer: "It won't work in production", tags: ["#funny"] },
    { id: 32, question: "Official unit of programmer time?", options: ["Hours", "'Just 5 minutes'", "Days", "Sprints"], answer: "'Just 5 minutes'", tags: ["#funny"] },
    { id: 33, question: "Which is a real programming language?", options: ["LOLCODE", "FunScript", "LazyPy", "ClickCode"], answer: "LOLCODE", tags: ["#funny"] },
    { id: 34, question: "What does a student call the night before exams?", options: ["Preparation day", "Panic Mode activated", "Revision night", "Holiday"], answer: "Panic Mode activated", tags: ["#funny"] },
    { id: 35, question: "A programmer's reaction to a working code they didn't write?", options: ["Read it carefully", "Delete it", "Don't touch it", "Refactor immediately"], answer: "Don't touch it", tags: ["#funny"] },

    // #general
    { id: 36, question: "Who invented the World Wide Web?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Elon Musk"], answer: "Tim Berners-Lee", tags: ["#general", "#tech"] },
    { id: 37, question: "Which country invented zero?", options: ["China", "Greece", "India", "Egypt"], answer: "India", tags: ["#general"] },
    { id: 38, question: "Capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], answer: "Tokyo", tags: ["#general"] },
    { id: 39, question: "Speed of light approximately?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], answer: "3 × 10⁸ m/s", tags: ["#general"] },
    { id: 40, question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific", tags: ["#general"] },
    { id: 41, question: "Full form of PDF?", options: ["Portable Document Format", "Print Document File", "Personal Data Format", "Printable Document Form"], answer: "Portable Document Format", tags: ["#general", "#tech"] },
    { id: 42, question: "Element with symbol 'Fe'?", options: ["Fluorine", "Iron", "Francium", "Fermium"], answer: "Iron", tags: ["#general"] },
    { id: 43, question: "First iPhone released in?", options: ["2005", "2006", "2007", "2008"], answer: "2007", tags: ["#general", "#tech"] },
    { id: 44, question: "Largest planet in solar system?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: "Jupiter", tags: ["#general"] },
    { id: 45, question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: "6", tags: ["#general"] },
]

export function getRandomQuestions(count = 10, tags: string[] = []): Question[] {
    const pool = tags.length > 0
        ? ALL_QUESTIONS.filter(q => tags.some(t => q.tags.includes(t)))
        : ALL_QUESTIONS
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
}