import unittest

from task_1 import calculate


class CalculatorTests(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(calculate(2, 3, "+"), 5)

    def test_subtraction(self):
        self.assertEqual(calculate(10, 7, "-"), 3)

    def test_multiplication(self):
        self.assertEqual(calculate(4, 5, "*"), 20)

    def test_division(self):
        self.assertEqual(calculate(12, 4, "/"), 3)

    def test_power(self):
        self.assertEqual(calculate(2, 3, "**"), 8)

    def test_modulo(self):
        self.assertEqual(calculate(14, 5, "%"), 4)

    def test_divide_by_zero_raises(self):
        with self.assertRaises(ValueError):
            calculate(1, 0, "/")

    def test_unknown_operation_raises(self):
        with self.assertRaises(ValueError):
            calculate(1, 2, "x")


if __name__ == "__main__":
    unittest.main()
