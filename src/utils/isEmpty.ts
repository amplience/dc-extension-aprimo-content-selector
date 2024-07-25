export const isEmpty = (o: object | undefined) =>
  o && Object.keys(o).length === 0 && o.constructor === Object;
