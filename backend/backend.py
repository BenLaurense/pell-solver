from flask import Flask, send_from_directory, request, jsonify
from backend.calculation import is_square, clip_continued_fraction, solve_pell, solve_negative_pell
from enum import Enum
from dataclasses import asdict


app = Flask(__name__, static_folder='../frontend', static_url_path='/')


@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html') # type: ignore


@app.route('/backend/pell', methods=['POST'])
def pell():
    '''
    Solve Pell's equation and store calculation steps
    '''
    req = request.get_json()
    app.logger.info(f'Call to /backend/pell with input={req}')

    n = int(req['n'])
    if is_square(n):
        return jsonify({
            'n': n,
            'success': SuccessCode.IsSquare.name
        })
    
    try:
        result = solve_pell(n)
        app.logger.info(f'result: {result}')

        result_dict = asdict(result)
        result_dict['success'] = SuccessCode.Success.name
        result_dict['cont_frac'] = clip_continued_fraction(result_dict['cont_frac'])
        return jsonify(result_dict)

    except Exception as e:
        return jsonify({
            'n': n,
            'success': SuccessCode.Error.name,
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
    if is_square(n):
        return jsonify({
            'n': n,
            'success': SuccessCode.IsSquare.name
        })

    try:
        result = solve_negative_pell(n)
        app.logger.info(f'result: {result}')

        result_dict = asdict(result)
        if result.solutions:
            result_dict['success'] = SuccessCode.Success.name
        else:
            result_dict['success'] = SuccessCode.SuccessNoSolution.name
        result_dict['cont_frac'] = clip_continued_fraction(result_dict['cont_frac'])
        return jsonify(result_dict)

    except Exception as e:
        return jsonify({
            'n': n,
            'success': SuccessCode.Error.name,
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
    IsSquare = 3


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
