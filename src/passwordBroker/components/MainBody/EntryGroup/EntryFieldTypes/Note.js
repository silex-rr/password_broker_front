const Note = ({value}) => {
    return (
        <div className="col-span-3 px-2 basis-1/2">
            <div className="whitespace-pre-line">{value}</div>
        </div>
    )
}

export default Note