function istPlz(text) {
  return /^\d{5}$/.test(text);
}

function zahlenFinden(text) {
  return (text.match(/\d+/g) ?? []).map(Number);
}

function datumDeutsch(iso) {
  return iso.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1");
}

function istEmail(text) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(text);
}
