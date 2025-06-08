# pell-solver
React + Flask app for solving Pell's equation and the negative Pell's equation. https://pell-solver.onrender.com/

# Introduction

Pell's equation is the Diophantine equation $$x^2-ny^2=1$$ where $n\in\mathbb{Z}_{>0}$ is not a perfect square. Its
integer solutions are infinite in number, and are surprisingly rich. For
example, the smallest solution to $x^2-61y^2=1$ is
$(x,y)=(1766319049,226153980)$.

The key fact is that all solutions to Pell's equation arise from powers
of a single "fundamental solution", and (amongst other methods) we can
find this solution using the continued fraction expansion of $\sqrt{n}$.
