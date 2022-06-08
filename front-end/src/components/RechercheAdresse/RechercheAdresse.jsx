import "../Recherche/Recherche.css";

function Recherche({ onRecherche }) {
  async function handleSubmit(event) {
    event.preventDefault();
    let name = event.target.value;
    onRecherche(name);
  }

  return (
    <div className="recherche-adresse">
      <input type="text" id="searchInput" onChange={handleSubmit} />
      <img src="img/icone-loupe.png" alt="icone loupe" />
    </div>
  );
}

export default Recherche;
