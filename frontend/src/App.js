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
      setResultText('Please enter a positive squarefree integer!');
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
      } else if (data.success === 'NotSquarefree') {
        setSuccess(false);
        setResultText('Please enter a positive squarefree integer!');
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
  const [activeTab, setActiveTab] = useState('A');
  const [resetKey, setResetKey] = useState(0);

  const tabs = {
    A: {
      title: "Pell's Equation Solver",
      description: `This applet finds the fundamental solution to x² - ny² = 1 given an input n.`,
      endpoint: '/backend/pell',
      buildSuccessText: data => `Fundamental solution: (x, y)=${data.solution}`,
      buildStepsText: data => [
        `Continued fraction of √n has period ${data.period}.`,
        `Representation: ${data.cont_frac}.`,
        `Solution index: ${data.solution_index}.`
      ]
    },
    B: {
      title: "Negative Pell's Equation Solver",
      description: `This applet finds the fundamental solution to x² - ny² = -1 if it exists.`,
      endpoint: '/backend/negative_pell',
      buildSuccessText: data =>
        `Fundamental solution: (x, y)=${data.solution}. Auxiliary: (x', y')=${data.aux_solution}`,
      buildStepsText: data => [
        `Continued fraction of √n has period ${data.period}.`,
        data.success === 'SuccessNoSolution'
          ? 'Even period → no solution.'
          : `Odd period → solution at index ${data.solution_index}`
      ]
    },
    C: {
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
        {activeTab === 'C' ? (
          <div>
            <h2>{tabs.C.title}</h2>
            <p>{tabs.C.description}</p>
          </div>
        ) : (
          <Solver {...tabs[activeTab]} resetSignal={resetKey} />
        )}
      </div>
    </div>
  );
}

export default PellSolverApp;
