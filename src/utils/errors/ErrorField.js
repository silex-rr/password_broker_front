import ErrorFieldProblem from "./ErrorFieldProblem";

const ErrorField = ({field, problems}) => {

    const problemsEls = [];

    for (let i = 0; i < problems.length; i++) {
        problemsEls.push(<ErrorFieldProblem problem={problems[i]}/>)
    }

    return (
        <p className="pl-2">
            <span>{field}: </span>
            <ul className="pl-2 ml-2">
                {problemsEls}
            </ul>
        </p>
    )
}

export default ErrorField