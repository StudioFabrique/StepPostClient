export function triTableau(tab, value, filtre) {
  switch (value) {
    case 0:
      if (filtre) {
        tab.sort(function compare(a, b) {
          if (a.bordereau < b.bordereau) return -1;
          if (a.bordereau > b.bordereau) return 1;
          return 0;
        });
      } else {
        tab.sort(function compare(b, a) {
          if (a.bordereau < b.bordereau) return -1;
          if (a.bordereau > b.bordereau) return 1;
          return 0;
        });
      }
      break;
    case 1:
      if (filtre) {
        tab.sort(function compare(a, b) {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        });
      } else {
        tab.sort(function compare(b, a) {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        });
      }
      break;
    case 2:
      if (filtre) {
        tab.sort(function compare(a, b) {
          if (a.nom < b.nom) return -1;
          if (a.nom > b.nom) return 1;
          return 0;
        });
      } else {
        tab.sort(function compare(b, a) {
          if (a.nom < b.nom) return -1;
          if (a.nom > b.nom) return 1;
          return 0;
        });
      }
      break;
    case 3:
      if (filtre) {
        tab.sort(function compare(a, b) {
          if (a.etat < b.etat) return -1;
          if (a.etat > b.etat) return 1;
          return 0;
        });
      } else {
        tab.sort(function compare(b, a) {
          if (a.etat < b.etat) return -1;
          if (a.etat > b.etat) return 1;
          return 0;
        });
      }
      break;

    default:
      break;
  }
  return tab;
}
