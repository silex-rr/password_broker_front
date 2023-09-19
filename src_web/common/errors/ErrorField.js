import ErrorFieldProblem from './ErrorFieldProblem';
import React from 'react';
const ErrorField = ({field, problems}) => {
    const problemsEls = [];

    for (let i = 0; i < problems.length; i++) {
        problemsEls.push(<ErrorFieldProblem problem={problems[i]} />);
    }

    return (
        <p className="pl-2">
            <span>{field}: </span>
            <ul className="ml-2 pl-2">{problemsEls}</ul>
        </p>
    );
};

export default ErrorField;
