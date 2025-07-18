/**
 * @name: Solution 1: Using a For Loop.
 * @param {number} n - The number to sum to.
 * @returns {number} - The sum of all integers from 1 to n.
 * @example: sum_to_n_a(5) => 1 + 2 + 3 + 4 + 5 = 15
 *
 * @description:
 * @complexity: O(n)
 * @space: O(1)
 */
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * @name: Solution 2: Using a Recursive Function.
 * @param {number} n - The number to sum to.
 * @returns {number} - The sum of all integers from 1 to n.
 * @example: sum_to_n_b(5) => 1 + 2 + 3 + 4 + 5 = 15
 *
 * @description:
 * @complexity: O(n)
 * @space: O(n)
 */
var sum_to_n_b = function (n) {
  if (n <= 0) return 0;
  return n + sum_to_n_b(n - 1);
};

/**
 * @name: Solution 3: Using the formula for the sum of an arithmetic series.
 * @param {number} n - The number to sum to.
 * @returns {number} - The sum of all integers from 1 to n.
 * @example: sum_to_n_c(5) => 1 + 2 + 3 + 4 + 5 = 15
 *
 * @description: In high school and university, I learned that the sum of an arithmetic series is given by the formula:
 * @complexity: O(1)
 * @space: O(1)
 * => The best solution to approach to calculate the problem as constant time.
 */
var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};
