export function getCourriers(page, max, listeCourriers) {
  let size = setLimit(page, max, listeCourriers);
  let tmpListe = [];
  for (let i = page * max; i < size; i++) {
    tmpListe = [...tmpListe, listeCourriers[i]];
  }
  return tmpListe;
}

export function setLimit(page, max, listeCourriers) {
  let size;
  if (listeCourriers.length < max * (page + 1)) {
    size = listeCourriers.length;
  } else {
    size = max * (page + 1);
  }
  return size;
}

export function setPrevious(page) {
  return page > 0;
}

export function setNext(page, max, courriersSize, listeSize) {
  return courriersSize >= max && courriersSize * page + 1 !== listeSize;
}
