import { formatDate, setColor, toTitleCase } from "../../modules/formatter";

function HistoriqueRow({ courrier, onRowClick }) {
  return (
    <tr onClick={() => onRowClick(courrier.bordereau)}>
      <td>{courrier.bordereau}</td>
      <td className="date">{formatDate(courrier.date)}</td>
      <td>{toTitleCase(courrier.nom)}</td>
      <td>
        <div
          className="cercle"
          style={{ backgroundColor: setColor(courrier.etat) }}
        ></div>
        <p>{toTitleCase(courrier.etat)}</p>
      </td>
    </tr>
  );
}

export default HistoriqueRow;
