call backend\venv\Scripts\activate
start cmd /k "cd frontend && npm start"
flask run --host=0.0.0.0 --port=10000
pause