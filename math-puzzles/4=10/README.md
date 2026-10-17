# 4 = 10 Interactive Puzzle Solver

An interactive terminal tool and solver engine for the **4 = 10** math puzzle.

## Overview

The goal of the 4=10 puzzle is to combine four given digits with basic arithmetic operations (`+`, `-`, `×`, `÷`) and optional brackets `( )` such that the expression evaluates to **10**.

In many levels or game variants:
- Certain arithmetic signs may be restricted or disallowed (e.g. no division `÷` or no multiplication `×`).
- Brackets `( )` may be disallowed, requiring a strictly linear expression evaluated via standard operator precedence (**PEMDAS / BODMAS**).

## Features

- **Interactive Terminal**: Prompts for digits, asks if all signs and brackets are allowed, and lets you disallow any subset of `+`, `-`, `*`, `/`, or `brackets`.
- **Direct CLI Mode**: Run one-off puzzles directly via command line arguments.
- **Minimal Parentheses Formatter**: Automatically simplifies redundant brackets (e.g., outputs `(3 - 7 ÷ 4) × 8` instead of `(((3 - (7 ÷ 4)) * 8))`).
- **Comprehensive Unit Tests**: Full test suite verifying digit permutations, operator filters, bracket constraints, division-by-zero protection, and mathematical correctness.

## Quick Start

### 1. Launch Interactive Mode
```bash
node interactiveTerminal.js
```

### 2. Run Direct Solve Mode
```bash
# Solve 3847 with all operations & brackets allowed
node interactiveTerminal.js 3847

# Solve 3847 with brackets disallowed
node interactiveTerminal.js 3847 --disallow "brackets"

# Solve 1234 without multiplication or division
node interactiveTerminal.js 1234 --disallow "*, /"
```

### 3. Run Unit Tests
```bash
node test_solver.js
```

## How the Logic Works

1. **Permutations**: Generates all unique permutations of the 4 digits (handling duplicate digits like `1 1 2 3` efficiently without redundant work).
2. **Expression Generation**:
   - **With Brackets**: Generates all 5 Catalan binary tree topologies for 4 operands and evaluates intermediate results with floating-point tolerance (`1e-7`). Redundant parentheses are pruned according to operator precedence and associativity rules.
   - **Without Brackets**: Generates flat expressions `d1 op1 d2 op2 d3 op3 d4` and evaluates them using standard operator precedence (PEMDAS / BODMAS) with zero brackets.
3. **Filtering & Deduplication**: Ensures only permitted operators and bracket rules are used, and deduplicates equivalent expressions.
