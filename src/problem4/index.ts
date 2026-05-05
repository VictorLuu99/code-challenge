// Three implementations of summation 1+2+...+n.
// Per the challenge: input is any integer, the result fits in
// Number.MAX_SAFE_INTEGER. The summation is only defined for n >= 1;
// for n <= 0 we early-return n.

// O(1) time, O(1) space. Closed form (Gauss).
export function sum_to_n_a(n: number): number {
  if (n <= 0) return n;
  return (n * (n + 1)) / 2;
}

// O(n) time, O(1) space. Iterative.
export function sum_to_n_b(n: number): number {
  if (n <= 0) return n;
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}

// O(n) time, O(n) call-stack space. Recursive; will overflow the stack
// for large n - the closed form is the practical choice.
export function sum_to_n_c(n: number): number {
  if (n <= 0) return n;
  return n + sum_to_n_c(n - 1);
}
