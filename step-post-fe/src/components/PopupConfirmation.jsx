function PopupEdition({msg, onCancelClick, onConfirmClick}) {
    return (
        <>
        <div className="screen"></div>
        <article className="popup">
            <h4>{msg}</h4>
            <div className="popup-buttons">
                <button className="button" onClick={() => onCancelClick()}>Annuler</button>
                <button className="button-valider" onClick={() => onConfirmClick()}>Confirmer</button>
            </div>
        </article>
        </>
    )
}

export default PopupEdition;