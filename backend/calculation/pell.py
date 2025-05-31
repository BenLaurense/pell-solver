import math


def regular_cont_fraction(n: int) -> list[int]:
    '''
    Finds the continued fraction representation of sqrt{n} as a list.
    Uses the fact that the continued fraction is periodic and terminates
    at 2sqrt{n}
    '''
    i = math.sqrt(n)
    a = math.floor(i)
    
    l = [a]
    target = 2 * a
    while a != target:
        i = 1 / (i - a)
        a = math.floor(i)
        l.append(a)
    return l


def solve_pell(n: int) -> dict:
    '''
    Given an integer n, finds the fundamental solution of Pell's equation 
    using the continued fraction method.
    Will throw if n is not squarefree positive
    '''
    l = regular_cont_fraction(n)
    period = len(l) - 1 # Integer part not counted

    idx = period
    if period % 2:
        idx = 2*period
        l += l[1:] # Make long enough

    h_pprev, h_prev = 0, 1
    k_pprev, k_prev = 1, 0
    h, k = None, None
    for j in range(1, idx + 1):
        h = l[j - 1]*h_prev + h_pprev
        k = l[j - 1]*k_prev + k_pprev
        # print(j, h, k, h**2 - n*k**2)
        h_pprev, h_prev = h_prev, h
        k_pprev, k_prev = k_prev, k
    return {
        'cont_frac': l,
        'period': period,
        'solution_index': idx,
        'solution': (h, k)
    }


def solve_negative_pell(n: int) -> dict | None:
    '''
    Given an integer n, finds the fundamental solution of the Negative Pell's equation 
    using the continued fraction method. Also returns the fundamental solution of 
    the associated Pell's equation. Returns None if no solution exists.
    Will throw if n is not squarefree positive.
    '''
    l = regular_cont_fraction(n)
    period = len(l) - 1 # Integer part not counted
    
    if not period % 2:
        return None
    p_idx = 2*period
    n_idx = period
    l += l[1:] # Make long enough

    h_pprev, h_prev = 0, 1
    k_pprev, k_prev = 1, 0
    h, k = None, None
    ns = None
    for j in range(1, p_idx + 1):
        h = l[j - 1]*h_prev + h_pprev
        k = l[j - 1]*k_prev + k_pprev
        # print(j, h, k, h**2 - n*k**2)
        if j == n_idx:
            ns = (h, k)
        h_pprev, h_prev = h_prev, h
        k_pprev, k_prev = k_prev, k
    return {
        'cont_frac': l,
        'period': period,
        'solution_index': n_idx,
        'aux_solution_index': p_idx,
        'solution': ns,
        'aux_solution': (h, k)
    }


def pell_next_solution(n: int, fundamental_solution: tuple[int, int], current_solution: tuple[int, int]) -> tuple[int, int]:
    '''
    Given a solution of Pell's equation and the fundamental solution, computes the next solution
    '''
    x = fundamental_solution[0] * current_solution[0] + n * fundamental_solution[1] * current_solution[1]
    y = fundamental_solution[1] * current_solution[0] + fundamental_solution[0] * current_solution[1]
    return (x, y)
    