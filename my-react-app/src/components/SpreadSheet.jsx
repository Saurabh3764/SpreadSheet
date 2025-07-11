import React, { useState, useEffect } from "react";
import Cell from "./Cell";

const colToLetter = (col) => String.fromCharCode(65 + col);
const letterToCol = (letter) => letter.charCodeAt(0) - 65;

const Spreadsheet = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("spreadsheet");
    return saved ? JSON.parse(saved) : {};
  });

  const [selected, setSelected] = useState();
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selected) return;

      const match = selected.match(/^([A-Z]+)(\d+)$/);
      if (!match) return;

      const [, colLetter, rowStr] = match;
      let row = parseInt(rowStr) - 1;
      let col = letterToCol(colLetter);
 
 

      switch (e.key) {
        case "ArrowUp":
          row = Math.max(0, row - 1);
          break;
        case "ArrowDown":
          row = Math.min(rows - 1, row + 1);
          break;
        case "ArrowLeft":
          col = Math.max(0, col - 1);
          break;
        case "ArrowRight":
          col = Math.min(cols - 1, col + 1);
          break;
        case "Tab":
          e.preventDefault();
          col = (col + 1) % cols;
          if (col === 0) row = (row + 1) % rows;
          break;
        case "c":
          if (e.ctrlKey) setCopied({ ...data[selected] });
          break;
        case "v":
          if (e.ctrlKey && copied)
            setData((prev) => ({ ...prev, [selected]: { ...copied } }));
          break;
        case "b":
          if (e.ctrlKey) {
            e.preventDefault();
            toggleFormat("bold");
          }
          break;
        case "Backspace":
          setData((prev) => {
            const newData = { ...prev };
            delete newData[selected];
            return newData;
          });
          break;
        
        default:
          return;
      }

      const newCell = `${colToLetter(col)}${row + 1}`;
      setSelected(newCell);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected, copied, data]);

  useEffect(() => {
    localStorage.setItem("spreadsheet", JSON.stringify(data));
  }, [data]);

  const handleChange = (cellId, raw) => {
 
    const newData = { ...data, [cellId]: { ...data[cellId], raw } };
    setData(evaluateAll(newData));
  };

  const toggleFormat = (style) => {
    setData((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        format: {
          ...prev[selected]?.format,
          [style]: !prev[selected]?.format?.[style],
        },
      },
    }));
  };

  const evaluateAll = (allData) => {
    const evaluated = {};
    for (const key in allData) {
      evaluated[key] = {
        ...allData[key],
        value: evaluateFormula(allData[key].raw, allData),
      };
    }
    return evaluated;
  };

  const evaluateFormula = (raw, allData) => {
    if (!raw || raw[0] !== "=") return raw;
    const formula = raw.slice(1).toUpperCase();

    const match = formula.match(/(SUM|AVG)\(([A-Z]+\d+):([A-Z]+\d+)\)/);
    if (match) {
      const [, func, start, end] = match;
      const getCoords = (id) => {
        const col = letterToCol(id.match(/[A-Z]+/)[0]);
        const row = parseInt(id.match(/\d+/)[0]) - 1;
        return [row, col];
      };
      const [r1, c1] = getCoords(start);
      const [r2, c2] = getCoords(end);
      const values = [];

      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          const id = `${colToLetter(c)}${r + 1}`;
          const val = parseFloat(allData[id]?.value);
          values.push(isNaN(val) ? 0 : val);
        }
      }

      const sum = values.reduce((a, b) => a + b, 0);
      return func === "SUM" ? sum : (sum / values.length).toFixed(2);
    }

    try {
      const expr = formula.replace(/[A-Z]+\d+/g, (match) => {
        const val = allData[match]?.value;
        return isNaN(parseFloat(val)) ? 0 : val;
      });
      return eval(expr);
    } catch {
      return "ERR";
    }
  };



  const handleSave = () => {
    const json = JSON.stringify(data);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'spreadsheet.json';
    link.click();

  };

  const handleLoad = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const loaded = JSON.parse(evt.target.result);
      setData(evaluateAll(loaded));
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <h2 className="text-3xl mb-8">Spreadsheet</h2>
      <div className="mb-4">
        <button
          onClick={() => { setRows(rows + 1) }}
          className="px-2 py-1 border mr-2 cursor-pointer"
        >
          Add Row
        </button>
        <button
          onClick={() => { setCols(cols + 1) }}
          className="px-2 py-1 border mr-2 cursor-pointer"
        >
          Add Column
        </button>
        <button
          onClick={handleSave}
          className="px-2 py-1 border mr-2 cursor-pointer"
        >
          Save JSON
        </button>
        <input
          type="file"
          accept=".json"
          onChange={handleLoad}
          className="mr-2 border-1 p-1 cursor-pointer"
        />
        <button
          onClick={() => toggleFormat("bold")}
          className="px-2 py-1 border mr-2 cursor-pointer"
        >
          Bold
        </button>
        <button
          onClick={() => toggleFormat("bg")}
          className="px-2 py-1 border cursor-pointer"
        >
          Background
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            setData({});
          }}
          className="px-2 py-1 border mx-2 cursor-pointer"
        >
          Reset
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: cols }).map((_, c) => (
              <th key={c}>{colToLetter(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              <td className="text-center">{r + 1}</td>
              {Array.from({ length: cols }).map((_, c) => {
                const id = `${colToLetter(c)}${r + 1}`;
                return (
                  <td key={c} className="">
                    <Cell
                      cellId={id}
                      raw={data[id]?.raw || ""}
                      value={data[id]?.value || ""}
                      format={data[id]?.format || {}}
                      isSelected={selected === id}
                      onSelect={() => setSelected(id)}
                      onChange={handleChange}
                      
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
