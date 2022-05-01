export function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR').format(Date.parse(date));
}

export function toTitleCase(str) {
    return str.replace(
        /([^\W_]+[^\s-]*) */g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function setEtatMessage(etat, nom) {
    let message;
    switch (etat) {
        case "pris en charge":
            message = `Le courrier pour ${nom} a été pris en charge.`;
            break;
        case "distribué":
            message = `Le destinataire ${nom} a bien reçu son courrier.`;
            break;
        case "avisé":
            message = `Le facteur a laissé un avis de passage pour : ${nom}.`;
            break;
        case "mis en instance":
            message = ` Le courrier pour ${nom} a été déposé à un point de retrait.`;
            break;
        case "npai":
            message = `Le destinataire ${nom} n'habite pas à l'adresse indiquée.`;
            break;
        case "non réclamé":
            message = `Le courrier pour ${nom} a été retourné )'expéditeur.`;
            break;

    }
    return message;
}

export function setColor(statut) {
    let color;
    switch (statut) {
        case "NPAI":
            color = "red";
            break;
        case "non réclamé":
            color = "red";
            break;
        case "distribué":
            color = "#24A640";
            break;
        default:
            color = "#FF5E1A";
            break;
    }
    return color;
}