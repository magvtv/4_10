# 4 = 10 & Math Puzzles

![math game banner](https://i.ytimg.com/vi/IgwGOWq82D4/maxresdefault.jpg)

Inspired by the popular "4 = 10" math puzzle game available on mobile app stores, this project provides a modular solver engine and interactive terminal tools to solve 4-digit arithmetic puzzles for various target values (**4**, **10**, **12**, **18**, **24**, and **100**).

Four single digits are combined using basic arithmetic operations (`+`, `-`, `×`, `÷`) and optional brackets `( )` to reach the target value.

---

## 🎯 Features

- **Interactive Terminal**: An interactive terminal CLI in each puzzle folder allows entering 4 digits and toggling which operations (`+`, `-`, `×`, `÷`) and brackets `( )` are allowed or disallowed.
- **Direct CLI Execution**: Solve individual puzzles from the command line in one command (e.g. `node interactiveTerminal.js 3847`).
- **Operator & Bracket Constraints**: Supports custom restrictions matching game levels (e.g., division disallowed, multiplication disallowed, or brackets disallowed).
- **Minimal Parentheses Formatter**: Automatically simplifies redundant brackets using mathematical precedence and associativity (e.g., renders `(3 - 7 ÷ 4) × 8 = 10` instead of `(((3 - (7 ÷ 4)) * 8)) = 10`).
- **Multiple Targets Supported**:
  - `4=4/` (Target: 4)
  - `4=10/` (Target: 10)
  - `4=12/` (Target: 12)
  - `4=18/` (Target: 18)
  - `4=24/` (Target: 24 - The famous 24 Game)
  - `4=100/` (Target: 100)
- **Comprehensive Unit Tests**: Complete test suites in every folder with 100% passing assertions (74/74 assertions passing).

---

## 🚀 Quick Start

Ensure you have [Node.js](https://nodejs.org/) installed (v16+). Zero external dependencies required.

### 1. Interactive Mode

Navigate to any target folder and run the interactive terminal:

```bash
cd math-puzzles/4=10
node interactiveTerminal.js
```

You will be prompted to:
1. Enter 4 digits (e.g., `3847` or `3 8 4 7`).
2. Choose if all arithmetic signs and brackets are allowed (`[Y/n]`).
3. If not, specify which signs to disallow (e.g. `*`, `/, b`, `brackets, ÷`).

### 2. Direct Solve Mode

Run immediate queries with or without restrictions:

```bash
# Solve 4=10 for 3847 with all operations & brackets allowed
node math-puzzles/4=10/interactiveTerminal.js 3847

# Solve 4=10 for 3847 with brackets disallowed (strict PEMDAS)
node math-puzzles/4=10/interactiveTerminal.js 3847 --disallow "b"

# Solve 4=24 for 1346
node math-puzzles/4=24/interactiveTerminal.js 1346

# Solve 4=100 for 5555 without multiplication
node math-puzzles/4=100/interactiveTerminal.js 5555 --disallow "*"
```

### 3. Run Unit Tests

To run the unit test suite for a specific puzzle target:

```bash
node math-puzzles/4=10/test_solver.js
```

Or run tests across all targets:

```bash
for dir in math-puzzles/4=*; do (cd "$dir" && node test_solver.js); done
```

---

## 🧠 How It Works

The solver uses a tree-based and precedence-driven architecture:

1. **Permutations**: Generates all unique permutations of the 4 input digits (efficiently deduplicating repeated numbers like `1, 1, 2, 3`).
2. **With Brackets (Tree Topologies)**: Generates all 5 Catalan binary expression tree structures for 4 numbers. Prunes redundant parentheses using operator precedence (BODMAS / PEMDAS) and associativity rules.
3. **Without Brackets (Flat Precedence)**: Generates flat expressions $d_1 \text{ } op_1 \text{ } d_2 \text{ } op_2 \text{ } d_3 \text{ } op_3 \text{ } d_4$ and evaluates them strictly by operator precedence with zero parentheses.
4. **Fractional Precision**: Handles fractional intermediate values (e.g. $7 \div 4 = 1.75$, $3 - 1.75 = 1.25$, $1.25 \times 8 = 10$) using an epsilon tolerance ($10^{-7}$) and guards against division by zero.

---

## 📁 Repository Structure

```
math-puzzles/
├── 4=4/
│   ├── interactiveTerminal.js  # Interactive CLI for target 4
│   ├── puzzleSolver.js         # Core solver engine
│   ├── test_solver.js          # Unit tests
│   └── README.md
├── 4=10/
│   ├── interactiveTerminal.js  # Interactive CLI for target 10
│   ├── puzzleSolver.js         # Core solver engine
│   ├── test_solver.js          # Unit tests
│   └── README.md
├── 4=12/
├── 4=18/
├── 4=24/
├── 4=100/
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
