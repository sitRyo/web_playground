const range = n => [...Array(n).keys()];

const table = document.getElementById('table');
const wrapper = document.getElementById('wrapper');

// worker
const myWorker = new Worker('worker.js');

const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

/* シングルスレッドで行列の値を計算 */
const calcMatrixNormal = (m1, m2) => {
  const result = range(4).map(idx => {
    const row = m1[idx];
    return range(4).map(jdx => {
      const col = m2[jdx];
      const val = range(4).reduce((pv, cv) => {
        const rv = row[cv] * col[cv];
        return pv + rv;
      }, 0)
      return val;
    })
  })

  return result;
}

/* 行列の値を取得する */
function getMatrixValues(tableDom) {
  const matrix = [];
  for (let i = 0; i < 4; ++i) {
    const row = tableDom.childNodes[i + 1];
    const rowElem = row.childNodes;
    const rowArray = [];
    for (let j = 0; j < 4; ++j) {
      rowArray.push(Number(rowElem[j].value));
    }
    matrix.push(rowArray);
  }

  return matrix;
}

/* 行列の値をセット */
function setMatrixValueToTable(matrix, tableName) {
  const table = document.getElementById(tableName);
  range(4).forEach(idx => {
    const row = table.childNodes[idx + 1];
    const rowElem = row.childNodes;
    range(4).forEach(jdx => {
      const val = matrix[idx][jdx];
      rowElem[jdx].value = val;
    })
  })
}

myWorker.onmessage = (ev => {
  // 行列の表示
  setMatrixValueToTable(ev.data, 'table-4');
})

/* worker生成 */
function doWorker(m1, m2) {
  // workerに行列を送信
  myWorker.postMessage([m1, m2]);
}

/* Buttonのリスナーを設定 */
const calcButton = document.getElementById('calc');
calcButton.onclick = () => {
  const table1 = document.getElementById('table-1');
  const table2 = document.getElementById('table-2');
  const matrix1 = getMatrixValues(table1);
  // 2つ目の行列は転置しておく
  const matrix2 = transpose(getMatrixValues(table2));
  doWorker(matrix1, matrix2);
  setMatrixValueToTable(calcMatrixNormal(matrix1, matrix2), 'table-3');
}

function generateTableDOM(headText, tableIdx, table, hasDefaultVal, magnification) {
  const tableTop = document.createElement('div');
  const heading = document.createElement('h1');
  heading.innerText = headText;
  tableTop.setAttribute('id', `table-${tableIdx}`);
  tableTop.appendChild(heading);
  for (let i = 0; i < 4; ++i) {
    const divInfo = document.createElement('div');
    divInfo.setAttribute('id', `table-${tableIdx}-${i}`);
    for (let j = 0; j < 4; ++j) {
      const inputElm = document.createElement('input');
      inputElm.setAttribute('id', `${tableIdx}-m${i}${j}`)
      inputElm.setAttribute('placeholder', `m${i}${j}`);
      if (hasDefaultVal) {
        inputElm.value = magnification * (4 * i) + j;
      }
      divInfo.appendChild(inputElm);
    }
    tableTop.appendChild(divInfo);
  }
  table.appendChild(tableTop);
};

function init() {
  generateTableDOM('Matrix 1', 1, table, true, 1);
  generateTableDOM('Matrix 2', 2, table, true, 2);
  generateTableDOM('Single Thread', 3, wrapper);
  generateTableDOM('Web Worker', 4, wrapper);
}

init();