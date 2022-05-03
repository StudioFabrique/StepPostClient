function PopupEdition({onCancelClick, onConfirmClick}) {
    return (
        <>
        <div className="screen"></div>
        <article className="popup">
            <h4>Confirmez vous les modifications ?</h4>
            <div className="popup-buttons">
                <button onClick={() => onCancelClick()}>Annuler</button>
                <button onClick={() => onConfirmClick()}>Confirmer</button>
            </div>
        </article>
        </>
    )
}

export default PopupEdition;