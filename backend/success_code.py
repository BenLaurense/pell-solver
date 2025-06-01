from enum import Enum

class SuccessCode(Enum):
    Success = 1,
    SuccessNoSolution = 4,
    Error = 2,
    NotSquarefree = 3
    