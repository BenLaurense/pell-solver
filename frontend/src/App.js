import { useState, useEffect } from 'react';
import './App.css';

function Solver({
  title,
  description,
  endpoint,
  buildSuccessText,
  buildStepsText,
  resetSignal
}) {
  const [inputN, setInputN] = useState('');
  const [resultText, setResultText] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputN('');
    setResultText('');
    setCalculationSteps([]);
    setSuccess(null);
    setLoading(false);
  }, [resetSignal]);

  const handleSubmit = async () => {
    const n = parseInt(inputN);
    if (isNaN(n) || n <= 0) {
      setSuccess(false);
      setResultText('Please enter a valid positive non-square integer!');
      setCalculationSteps([]);
      return;
    }

    setLoading(true);
    setSuccess(null);
    setResultText('');
    setCalculationSteps([]);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n })
      });

      const data = await response.json();
      if (data.success === 'Success') {
        setSuccess(true);
        setResultText(buildSuccessText(data));
        setCalculationSteps(buildStepsText(data));
      } else if (data.success === 'SuccessNoSolution') {
        setSuccess(true);
        setResultText('No solutions!');
        setCalculationSteps(buildStepsText(data));
      } else if (data.success === 'IsSquare') {
        setSuccess(false);
        setResultText('Please enter a valid positive non-square integer!');
      } else {
        setSuccess(false);
        setResultText('Calculation Failed');
      }
    } catch (error) {
      setSuccess(false);
      setResultText('An error occurred. Please try another');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p className="description-box">{description}</p>
      <input
        className="styled-input"
        type="number"
        value={inputN}
        onChange={e => setInputN(e.target.value)}
        placeholder="Enter n"
      />
      <button className="styled-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      <p
        className="result-display"
        style={{ color: success === null ? '#333' : success ? '#2e7d32' : '#d32f2f' }}
      >
        {resultText}
      </p>
      {calculationSteps.length > 0 && (
        <div className="steps-container">
          <div className="steps-label">Calculation Steps:</div>
          <ul className="steps-content">
            {calculationSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PellSolverApp() {
  const [activeTab, setActiveTab] = useState('Pell');
  const [resetKey, setResetKey] = useState(0);

  const tabs = {
    Pell: {
      title: "Pell's Equation Solver",
      description: `This applet finds the fundamental solution (x*, y*) to x² - ny² = 1 given an input n.\n 
      Given a solution (x, y), another solution is given by (xx* + nyy*, xy* + yx*). 
      All solutions are obtained this way, starting with (x*, y*)`,
      endpoint: '/backend/pell',
      buildSuccessText: data => `Trivial solution: (${data.trivial_solutions})\nFundamental solution: (${data.solutions})`,
      buildStepsText: data => [
        // `Trivial solution (${data.trivial_solutions}) always exists`,
        `Continued fraction of √${data.n} is given by ${data.cont_frac} and has period ${data.period}`,
        `${data.period % 2 === 0 ? 'Even' : 'Odd' } period → fundamental solution is the index-${data.solutions_idx} convergent`,
        // `Fundamental solution is (x*, y*)=(${data.solutions})`
      ]
    },
    NegPell: {
      title: "Negative Pell's Equation Solver",
      description: `This applet finds the fundamental solution (x*, y*) to x² - ny² = -1 given an input n, if it exists.\n
      Given a solution (x, y), another solution is given by (xx' + nyy', xy' + yx') where (x', y') is the fundamental solution 
      of the corresponding Pell equation x² - ny² = 1. All solutions are obtained this way, starting with (x*, y*)`,
      endpoint: '/backend/negative_pell',
      buildSuccessText: data =>
        `Fundamental solution: (${data.solutions})`,
      buildStepsText: data => [
        `Continued fraction of √${data.n} is given by ${data.cont_frac} and has period ${data.period}.`,
        data.success === 'SuccessNoSolution'
          ? 'Even period → no solution'
          : `Odd period → fundamental solution is the index-${data.solutions_idx} convergent`,
        `The auxiliary Pell equation x² - ${data.n}y² = 1 has fundamental solution (x', y')=(${data.aux_solutions})`
        // `Fundamental solution is (x*, y*)=(${data.solutions})`
      ]
    },
    GeneralPell: {
      title: "Generalised Pell's Equation Solver",
      description: 'Coming soon...'
    }
  };

  const tabKeys = Object.keys(tabs);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="calculator-container">
      <div className="tab-header">
        {tabKeys.map(key => (
          <button
            key={key}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {tabs[key].title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 'GeneralPell' ? (
          <div>
            <h2>{tabs.GeneralPell.title}</h2>
            <p>{tabs.GeneralPell.description}</p>
          </div>
        ) : (
          <Solver {...tabs[activeTab]} resetSignal={resetKey} />
        )}
      </div>
    </div>
  );
}

export default PellSolverApp;
