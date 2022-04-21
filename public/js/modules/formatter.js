export function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR').format(Date.parse(date));
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}