import Moment from 'react-moment';

const BackupList = ({ backups }) => {

    const currentBackups = backups

    const dateMinuteFormat = (date) => {
        return <Moment format="YYYY.MM.DD HH:mm">{date}</Moment>
    }

    const isValueNull = (value) => {
        return value == null ? "--" : value
    }

    const isDateNull = (value) => {
        return value == null ? '--' : dateMinuteFormat(value)
    }

    const tableHead = [
        'Status', 'Requested at', 'Created at', 'Deleted at', 'ID',
        'Errors', 'File Name', 'Password', 'Size, bytes', 'Updated at'
    ]

    const statusColour = (status) => {
        const colour = {
            created: 'text-[#22c55e]',
            creating: 'text-[#6ee7b7]',
            await: 'text-[#facc15]',
            error: 'text-[#e11d48]',
            deleted: 'text-[#713f12]',
        }
        return colour[status]
    }

    return (
        <div>
            <div className="grid grid-cols-10 mb-2 border-b-2" >
                {tableHead.map((val, key) => (
                    <div key={`${val}-${key}`}>{val}</div>
                ))}
            </div>
            {currentBackups != null && (currentBackups.map((line, index) => (
                <div className="grid grid-cols-10 mb-1"
                    key={`${index}-${line.size}-${line.state}`}>
                    <div className={`${statusColour(line.state)}`} >{line.state}</div>
                    <div>{isDateNull(line.created_at)}</div>
                    <div>{isDateNull(line.backup_created)}</div>
                    <div>{isDateNull(line.backup_deleted)}</div>
                    <div className='text-xs'>{isValueNull(line.backup_id)}</div>
                    <div>{isValueNull(line.error_message)}</div>
                    <div className='text-xs'>{isValueNull(line.file_name)}</div>
                    <div>{isValueNull(line.password)}</div>
                    <div>{isValueNull(line.size)}</div>
                    <div>{isDateNull(line.updated_at)}</div>
                </div>
            )))}
        </div>
    )
}

export default BackupList