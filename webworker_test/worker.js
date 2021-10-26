const range = n => [...Array(n).keys()];

onmessage = e => {
  const m1 = e.data[0];
  const m2 = e.data[1];
  const rows = [];
  for (let idx = 0; idx < 4; ++idx) {
    const r = [];
    const m1Row = m1[idx];
    for (let jdx = 0; jdx < 4; ++jdx) {
      const m2Row = m2[jdx];
      r.push(
        range(4)
          .reduce((ps, kdx) => ps + m1Row[kdx] * m2Row[kdx], 0)
      );
    }
    rows.push(r);
  }
  postMessage(rows);
}