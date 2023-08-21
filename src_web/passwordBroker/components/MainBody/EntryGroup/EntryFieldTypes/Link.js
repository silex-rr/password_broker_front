const Link = ({value}) => {
    return (
        <div className="col-span-3 px-2 basis-1/2">
            <a href={value} className="link" target="_blank" rel="noreferrer">{value}</a>
        </div>
    )
}

export default Link