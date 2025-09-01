import React, { useState } from "react";
import { demonstrateJavaConcepts } from "../utils/demoData";

const JavaConceptsDemo = () => {
  const [consoleOutput, setConsoleOutput] = useState([]);

  const runDemo = () => {
    // Clear previous output
    setConsoleOutput([]);

    // Capture console.log output
    const originalLog = console.log;
    const logs = [];

    console.log = (...args) => {
      logs.push(args.join(" "));
      originalLog.apply(console, args);
    };

    // Run the demo
    demonstrateJavaConcepts();

    // Restore console.log
    console.log = originalLog;

    // Update state with captured logs
    setConsoleOutput(logs);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🎯 Java Concepts in JavaScript Demo
      </h2>

      <p className="text-gray-600 mb-6">
        This demo showcases how Java programming concepts are implemented using
        JavaScript classes:
        <br />• <strong>Method Overloading</strong> - Same method name with
        different parameters
        <br />• <strong>Constructor Overloading</strong> - Multiple constructor
        patterns
        <br />• <strong>Static Methods</strong> - Class-level methods without
        instantiation
        <br />• <strong>Public/Private Methods</strong> - Access control using #
        prefix
      </p>

      <button onClick={runDemo} className="btn-primary mb-6">
        🚀 Run Java Concepts Demo
      </button>

      {consoleOutput.length > 0 && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
          <div className="mb-2 text-white font-semibold">Console Output:</div>
          {consoleOutput.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 What to Look For:
        </h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Check the browser console for detailed output</li>
          <li>
            • Notice how methods behave differently with different parameters
          </li>
          <li>• See static methods being called on classes, not instances</li>
          <li>• Observe the encapsulation with private methods</li>
        </ul>
      </div>
    </div>
  );
};

export default JavaConceptsDemo;
