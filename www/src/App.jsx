import React, { useState, useEffect } from 'react';
import init, { Calculator } from './pkg/calculator';
import { CalculatorJS } from './CalculatorJS';
import './App.css';

export default function App() {
  const [calc, setCalc] = useState(null);
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState('wasm');
  const [perfResults, setPerfResults] = useState([]);

  useEffect(() => {
    const loadWasm = async () => {
      await init();
      setCalc(new Calculator());
    };

    if (mode === 'wasm') loadWasm();
    else setCalc(new CalculatorJS());
  }, [mode]);

  const updateDisplay = () => {
    if (!calc) return;
    setDisplay(calc.get_value());
    setExpression(calc.get_expression());
  };

  const withCalcSafety = (fn) => (...args) => {
    if (!calc) return;
    fn(...args);
    updateDisplay();
  };

  const handleDigit = withCalcSafety((d) => calc.input_digit(d));
  const handleDecimal = withCalcSafety(() => calc.input_decimal());
  const handleClear = withCalcSafety(() => calc.clear());
  const handleToggleSign = withCalcSafety(() => calc.toggle_sign());
  const handlePercent = withCalcSafety(() => calc.percent());
  const handleOperation = withCalcSafety((op) => calc.perform_operation(op));

  const runPerformanceTest = () => {
    const testCases = [
      { type: 'short', expr: '1+2+3*4-5/2' },
      { type: 'medium', expr: Array(1000).fill('8*8').join('+') },
      { type: 'long', expr: Array(100000).fill('9*9').join('+') },
      { type: 'heavy' },
      { type: 'fib' }
    ];

    const results = testCases.map(({ type, expr }) => {
      if (type === 'heavy') {
        const n = 5000;

        const wasmStart = performance.now();
        const wasmResult = calc.heavy_compute(n);
        const wasmEnd = performance.now();
        const wasmTime = wasmEnd - wasmStart;

        const jsCalc = new CalculatorJS();
        const jsStart = performance.now();
        const jsResult = jsCalc.heavy_compute(n);
        const jsEnd = performance.now();
        const jsTime = jsEnd - jsStart;

        return {
          type,
          wasmTime: wasmTime.toFixed(2),
          jsTime: jsTime.toFixed(2),
          diff: (jsTime - wasmTime).toFixed(2)
        };
      }

      if (type === 'fib') {
        const n = 35;

        const wasmStart = performance.now();
        const wasmResult = calc.fib_recursive(n);
        const wasmEnd = performance.now();
        const wasmTime = wasmEnd - wasmStart;

        const jsCalc = new CalculatorJS();
        const jsStart = performance.now();
        const jsResult = jsCalc.fib_recursive(n);
        const jsEnd = performance.now();
        const jsTime = jsEnd - jsStart;

        return {
          type,
          wasmTime: wasmTime.toFixed(2),
          jsTime: jsTime.toFixed(2),
          diff: (jsTime - wasmTime).toFixed(2)
        };
      }

      // test the expression
      calc.clear();
      const wasmStart = performance.now();
      calc.evaluate_expression(expr);
      const wasmEnd = performance.now();
      const wasmTime = wasmEnd - wasmStart;

      const jsCalc = new CalculatorJS();
      const jsStart = performance.now();
      jsCalc.evaluate_expression(expr);
      const jsEnd = performance.now();
      const jsTime = jsEnd - jsStart;

      return {
        type,
        wasmTime: wasmTime.toFixed(2),
        jsTime: jsTime.toFixed(2),
        diff: (jsTime - wasmTime).toFixed(2)
      };
    });

    setPerfResults(results);
  };

  const buttons = [
    { label: 'C', onClick: handleClear, className: 'function' },
    { label: '±', onClick: handleToggleSign, className: 'function' },
    { label: '%', onClick: handlePercent, className: 'function' },
    { label: '/', onClick: () => handleOperation('/'), className: 'operator' },
    { label: '7', onClick: () => handleDigit(7) },
    { label: '8', onClick: () => handleDigit(8) },
    { label: '9', onClick: () => handleDigit(9) },
    { label: '*', onClick: () => handleOperation('*'), className: 'operator' },
    { label: '4', onClick: () => handleDigit(4) },
    { label: '5', onClick: () => handleDigit(5) },
    { label: '6', onClick: () => handleDigit(6) },
    { label: '-', onClick: () => handleOperation('-'), className: 'operator' },
    { label: '1', onClick: () => handleDigit(1) },
    { label: '2', onClick: () => handleDigit(2) },
    { label: '3', onClick: () => handleDigit(3) },
    { label: '+', onClick: () => handleOperation('+'), className: 'operator' },
    { label: '0', onClick: () => handleDigit(0), className: 'zero' },
    { label: '.', onClick: handleDecimal },
    { label: '=', onClick: () => handleOperation('='), className: 'operator' },
    { label: '√', onClick: () => handleOperation('sqrt'), className: 'function' },
    { label: 'x²', onClick: () => handleOperation('square'), className: 'function' },
    { label: 'mod', onClick: () => handleOperation('mod'), className: 'function' },
    { label: 'e^x', onClick: () => handleOperation('exp'), className: 'function' },
    { label: 'ln', onClick: () => handleOperation('ln'), className: 'function' },
    { label: 'log', onClick: () => handleOperation('log'), className: 'function' }
  ];

  return (
    <div className="calculator-container">
      <div className="mode-selector">
        <button className={`mode-btn ${mode === 'wasm' ? 'active' : ''}`} onClick={() => setMode('wasm')}>WASM Mode</button>
        <button className={`mode-btn ${mode === 'js' ? 'active' : ''}`} onClick={() => setMode('js')}>JS Mode</button>
        <button className="perf-btn" onClick={runPerformanceTest}>Run Performance Test</button>
      </div>

      <div className="calculator">
        <div className="expression">{expression || '0'}</div>
        <div className={`display ${display === 'Error' ? 'text-red-500' : ''}`}>{display}</div>
        <div className="buttons">
          {buttons.map((btn, idx) => (
            <button key={idx} className={`btn ${btn.className || ''}`} onClick={btn.onClick}>{btn.label}</button>
          ))}
        </div>
      </div>

      {perfResults.length > 0 && (
        <div className="perf-results mt-6">
          <h3 className="text-lg font-bold text-white mb-2">Performance Results (ms)</h3>
          <table className="table-auto w-full text-white border border-gray-300">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">Test Case</th>
                <th className="px-4 py-2">WASM (ms)</th>
                <th className="px-4 py-2">JavaScript (ms)</th>
                <th className="px-4 py-2">Difference</th>
              </tr>
            </thead>
            <tbody>
              {perfResults.map(result => (
                <tr key={result.type} className="bg-gray-800">
                  <td className="border px-4 py-2">{result.type}</td>
                  <td className="border px-4 py-2">{result.wasmTime}</td>
                  <td className="border px-4 py-2">{result.jsTime}</td>
                  <td className="border px-4 py-2">{result.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}