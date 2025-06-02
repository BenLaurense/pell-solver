# pell-solver
React + Flask app for solving Pell's equation and the negative Pell's equation.

# Introduction

Pell's equation is the Diophantine equation $$x^2-ny^2=1$$ where $n\in\mathbb{Z}_{>0}$ is not a perfect square. Its
integer solutions are infinite in number, and are surprisingly rich. For
example, the smallest solution to $x^2-61y^2=1$ is
$(x,y)=(1766319049,226153980)$.

The key fact is that all solutions to Pell's equation arise from powers
of a single "fundamental solution", and (amongst other methods) we can
find this solution using the continued fraction expansion of $\sqrt{n}$.

# Solving Using Continued Fractions

To find integer solutions $x^2-ny^2=1$, we use the following procedure:

- Compute the continued fraction expansion of $\sqrt{n}$, which is
  finite and periodic: $$\sqrt{n}=[a_0;\overline{a_1,a_2,\dotsc,a_k}]$$

- Determine the period length $k$.

- Let $h_n/k_n$ be the $n$th convergent to $\sqrt{n}$. Then:

  - If $k$ is even, then $(x,y)=(h_{k-1},k_{k-1})$ is the fundamental
    solution.

  - If $k$ is odd, then $(x,y)=(h_{2k-1},k_{2k-1})$ is the fundamental
    solution.

- Once the fundamental solution $(x, y)$ is known, all other
  solutions can be obtained by: $$x_i+y_i\sqrt{n}=(x+y\sqrt{n})^i$$
  Which, after some algebra, yields a recurrence: $$x_{i+1}=xx_i+nyy_i, y_{i+1}=xy_i+yx_i$$
