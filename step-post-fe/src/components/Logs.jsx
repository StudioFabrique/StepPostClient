import { formatDate, setColor, toTitleCase } from "../modules/formatter";

function Logs({courrier, onRowClick}) {
    
    const handleClick = () => {
        onRowClick(courrier.bordereau);
    }

    return (
        <>
            <tr key={courrier.id} onClick={handleClick}>
                <td>{courrier.bordereau}</td>
                <td className='date'>{formatDate(courrier.date)}</td>
                <td>{toTitleCase(courrier.nom)}</td>
                <td>
                    <div className='cercle' style={{ backgroundColor: setColor(courrier.etat) }}></div>
                    <p>{toTitleCase(courrier.etat)}</p>
                </td>
            </tr>
        </>

    )
}

export default Logs;