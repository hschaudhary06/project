"""Simple command-line calculator app."""

from __future__ import annotations


def calculate(num_1: float, num_2: float, operation: str) -> float:
    """Return the result of applying an operation to two numbers.

    Supported operations:
    +, -, *, /, **, %
    """
    if operation == "+":
        return num_1 + num_2
    if operation == "-":
        return num_1 - num_2
    if operation == "*":
        return num_1 * num_2
    if operation == "/":
        if num_2 == 0:
            raise ValueError("Cannot divide by zero")
        return num_1 / num_2
    if operation == "**":
        return num_1**num_2
    if operation == "%":
        if num_2 == 0:
            raise ValueError("Cannot modulo by zero")
        return num_1 % num_2
    raise ValueError(f"Unsupported operation: {operation}")


def _read_number(prompt: str) -> float:
    while True:
        raw = input(prompt).strip()
        try:
            return float(raw)
        except ValueError:
            print("Please enter a valid number.")


def run_calculator() -> None:
    print("Python Calculator")
    print("-----------------")

    while True:
        num_1 = _read_number("Enter your first number: ")
        num_2 = _read_number("Enter your second number: ")

        operation = input(
            """Please type the math operation you would like to complete:
+ for addition
- for subtraction
* for multiplication
/ for division
** for power
% for modulo
: """
        ).strip()

        try:
            result = calculate(num_1, num_2, operation)
            print(f"{num_1:g} {operation} {num_2:g} = {result:g}")
        except ValueError as error:
            print(error)

        response = input("Calculate again? Type 'Y' for yes or 'N' for no: ").strip().upper()
        if response == "N":
            print("See you again.")
            break
        if response != "Y":
            print("Unrecognized response; exiting.")
            break


if __name__ == "__main__":
    run_calculator()
