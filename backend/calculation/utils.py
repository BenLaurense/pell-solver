import math


def is_square(n: int) -> bool:
    return math.isqrt(n)**2 == n


def is_squarefree(n: int) -> bool:
    '''
    Check if an integer is squarefree (dumb implementation for now)
    '''
    for t in range(2, math.floor(math.sqrt(n)) + 1):
        if n % t ** 2 == 0:
            return False
    return True


CONT_FRAC_DISPLAY_LEN = 30


def clip_continued_fraction(l: list[int]) -> str:
    '''
    Display utility which clips the continued fraction representation down to a sensible display length
    '''
    str_rep = f"[{str(l[0])};" + ",".join(map(lambda x: str(x), l[1:CONT_FRAC_DISPLAY_LEN]))
    if len(l) > CONT_FRAC_DISPLAY_LEN:
        str_rep += "..."
    return str_rep + "]"
