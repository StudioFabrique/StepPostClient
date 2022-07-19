import React, { Component, useEffect, useState } from "react";
import "./AdressesFavorites.css";
import ListeAdresses from "../../components/ListeAdresses/ListeAdresses";
import NouvelEnvoi from "../../components/NouvelEnvoi/NouvelEnvoi";
import AdresseForm from "../../components/AdresseForm/AdresseForm";
import { postData } from "../../modules/fetchData";

function AdressesFavorites({ onPageLanding }) {
  const [section, setSection] = useState(0);
  const [newId, setNewId] = useState(null);

  useEffect(() => {
    onPageLanding(1);
  }, [onPageLanding]);

  const handleSectionUpdate = (newId, section) => {
    setNewId(newId);
    setSection(section);
  };

  const handleRetour = () => {
    setSection(0);
  };

  const handleNouvelleAdresse = () => {
    setSection(3);
  };

  const handleAjouterAdresse = async (adresse) => {
    await postData("/add-adresse", adresse);
    setSection(0);
  };

  const handleEditerAdresse = async (adresse) => {
    await postData("/edit-adresse", adresse);
    setSection(0);
  };

  return (
    <main className="main-nouvel-envoi">
      {section === 0 && (
        <ListeAdresses
          onClickIcone={handleSectionUpdate}
          onNewAdress={handleNouvelleAdresse}
        />
      )}
      {section === 1 && <NouvelEnvoi adresse={newId} onRetour={handleRetour} />}
      {section === 2 && (
        <AdresseForm
          id={newId}
          onRetour={handleRetour}
          onEditerAdresse={handleEditerAdresse}
        />
      )}
      {section === 3 && (
        <AdresseForm
          onRetour={handleRetour}
          onAjouterAdresse={handleAjouterAdresse}
        />
      )}
    </main>
  );
}

export default AdressesFavorites;
