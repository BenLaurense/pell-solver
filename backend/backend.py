from flask import Flask, send_from_directory, request, jsonify
from calculation import is_squarefree, clip_continued_fraction, solve_pell, solve_negative_pell
from enum import Enum

app = Flask(__name__, static_folder='../frontend', static_url_path='/')

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/backend/pell', methods=['POST'])
def pell():
    '''
    Solve Pell's equation and store calculation steps
    '''
    req = request.get_json()
    app.logger.info(f'Call to /backend/pell with input={req}')

    n = int(req['n'])
    if not is_squarefree(n):
        return jsonify({
        'success': SuccessCode.NotSquarefree.name, 
        'solution': None,
        })
    
    try:
        result = solve_pell(n)
        app.logger.info(f'result: {result}')

        return jsonify({
            'success': SuccessCode.Success.name, 
            'solution': result['solution'],
            'period': result['period'],
            'solution_index': result['solution_index'],
            'cont_frac': clip_continued_fraction(result['cont_frac'])
            })

    except Exception as e:
        return jsonify({
            'success': SuccessCode.Error.name, 
            'solution': None,
            'error': str(e)
            })
    
@app.route('/backend/negative_pell', methods=['POST'])
def negative_pell():
    '''
    Solve Negative Pell's equation and store calculation steps
    '''
    req = request.get_json()
    app.logger.info(f'Call to /backend/negative_pell with input={req}')

    n = int(req['n'])
    if not is_squarefree(n):
        return jsonify({
        'success': SuccessCode.NotSquarefree.name, 
        'solution': None,
        })
    
    try:
        result = solve_negative_pell(n)
        app.logger.info(f'result: {result}')
        if not result:
            return jsonify({
            'success': SuccessCode.SuccessNoSolution.name, 
            'result': None,
            })
        return jsonify({
            'success': SuccessCode.Success.name, 
            'solution': result['solution'],
            'aux_solution': result['aux_solution'],
            'period': result['period'],
            'solution_index': result['solution_index'],
            'aux_solution_index': result['aux_solution_index'],
            'cont_frac': clip_continued_fraction(result['cont_frac'])
            })
    
    except Exception as e:
        return jsonify({
            'success': SuccessCode.Error.name, 
            'result': None,
            'error': str(e)
            })

@app.route('/backend/generalised_pell', methods=['POST'])
def generalised_pell():
    '''
    Solve Generalised Pell's equation and store calculation steps
    '''
    raise NotImplementedError()

class SuccessCode(Enum):
    Success = 1,
    SuccessNoSolution = 4,
    Error = 2,
    NotSquarefree = 3

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
