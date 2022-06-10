import { formatDate, setColor, toTitleCase } from "../../modules/formatter";

function Logs({ courrier, onRowClick }) {
  const handleClick = () => {
    onRowClick(courrier.courrier.bordereau);
  };

  return (
    <tr key={courrier.id} onClick={handleClick}>
      <td>{courrier.courrier.bordereau}</td>
      <td className="date">{formatDate(courrier.date)}</td>
      <td>{toTitleCase(courrier.courrier.name)}</td>
      <td>
        <div
          className="cercle"
          style={{ backgroundColor: setColor(courrier.statut.etat) }}
        ></div>
        <p>{toTitleCase(courrier.statut.etat)}</p>
      </td>
    </tr>
  );
}

export default Logs;
