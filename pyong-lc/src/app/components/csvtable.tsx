'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface CsvTableProps {
  csvUrl: string;
}

export default function CsvTable({ csvUrl }: CsvTableProps) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        const parsed = Papa.parse<Record<string, string>>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
        setHeaders(parsed.meta.fields || []);
      })
      .catch((err) => console.error('CSV fetch error:', err));
  }, [csvUrl]);

  return (
    <div>
      {headers.length > 0 && (
        <table style={{ marginTop: '16px', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((key) => (
                  <td key={key} style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
