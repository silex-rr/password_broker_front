import { useState } from 'react';
import Moment from 'react-moment';

const BackupTable = ({ backups }) => {
    const [showPassword, setShowPassword] = useState(null)

    const currentBackups = backups


    const togglePassword = (index) => {
        if (index === showPassword) {
            setShowPassword(null);
        } else {
            setShowPassword(index);
        }
    };

    const isPassword = (value, index) => {
        const fieldText = value == null ? 'No password' : 'Show password'
        if (value == null) {
            return 'No password'
        }
        return index === showPassword ? value : fieldText;
    };

    const dateMinuteFormat = (date) => {
        return <Moment format="YYYY.MM.DD HH:mm">{date}</Moment>
    }

    const isValueNull = (value) => {
        return value == null ? "--" : value
    }

    const isDateNull = (value) => {
        return value == null ? '--' : dateMinuteFormat(value)
    }

    const tableHead = {
        'Status': 1, 'Requested at': 1, 'Created at': 1, 'Deleted at': 1, 'ID': 2,
        'Errors': 1, 'File Name': 2, 'Password': 1, 'Size, bytes': 1, 'Updated at': 1
    }

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
        <div className='overflow-y-auto'>
            <table class="table-auto">
                <thead>
                    <tr className='whitespace-no-wrap'>
                        {Object.keys(tableHead).map((val, key) => (
                            <th className='w-32' key={`${val}-${key}`}>{val}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentBackups != null && (currentBackups.map((line, index) => (
                        <tr className='whitespace-no-wrap' key={`${index}-${line.size}-${line.state}`}>
                            <td className={`${statusColour(line.state)}`} >{line.state}</td>
                            <td>{isDateNull(line.created_at)}</td>
                            <td>{isDateNull(line.backup_created)}</td>
                            <td>{isDateNull(line.backup_deleted)}</td>
                            <td className='text-xs'>{isValueNull(line.backup_id)}</td>
                            <td>{isValueNull(line.error_message)}</td>
                            <td className='text-xs'>{isValueNull(line.file_name)}</td>
                            <td className={`w-${tableHead['Password']}/12 hover:cursor-pointer`}
                                onClick={(() => togglePassword(index))}>{isPassword(line.password, index)}
                            </td>
                            <td>{isValueNull(line.size)}</td>
                            <td>{isDateNull(line.updated_at)}</td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
    )
}

export default BackupTable