/**
 * Helper module
 */
export const helper = {
  compareTop,
  compareWorst
};

function compareTop(a, b) {
  let floatA = parseFloat(a["Value"]);
  let floatB = parseFloat(b["Value"]);
  if (floatA < floatB) return 1;
  if (floatA > floatB) return -1;
  return 0;
}

function compareWorst(a, b) {
  let floatA = parseFloat(a["Value"]);
  let floatB = parseFloat(b["Value"]);
  if (floatA > floatB) return 1;
  if (floatA < floatB) return -1;
  return 0;
}
