'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface CsvEditorProps {
  csvUrl: string;
}

export default function CsvEditor({ csvUrl }: CsvEditorProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(csvUrl)
      .then(res => res.text())
      .then(text => {
        const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
        if (result.data.length > 0) {
          setHeaders(result.data[0]);
          setRows(result.data.slice(1));
        }
      });
  }, [csvUrl]);

  const handleAddRow = () => {
    setRows((prev) => {
      const newIndex = prev.length;
      setHighlightIndex(newIndex);
      setTimeout(() => setHighlightIndex(null), 2000); // ✅ 闪烁高亮
      return [...prev, Array(headers.length).fill('')];
    });
    setEditMode(true);
  };

  const handleDeleteRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

const handleSave = async () => {
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
  
    try {
      const res = await fetch('/api/save-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: csvUrl.split('/').pop(), // 自动从传入路径提取文件名
          content: csvContent,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(`✅ ${data.message || '保存成功'}`);
        setEditMode(false);
        setHighlightIndex(null);
      } else {
        alert(`❌ 保存失败: ${data.error || '未知错误'}`);
      }
    } catch (err) {
      console.error('保存出错:', err);
      alert('❌ 保存出错，请稍后重试');
    }
  };
  
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#FFF',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginTop: '24px',
      maxWidth: 800,
      marginInline: 'auto',
    }}>
      <h2 style={{ color: '#3A3A3A', marginBottom: '16px' }}>
        编辑内容：{csvUrl.split('/').pop()}
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#B3D8F5',
                color: '#3A3A3A'
              }}>
                {header}
              </th>
            ))}
            {editMode && (
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>操作</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{
              backgroundColor: rowIndex === highlightIndex ? '#AEE5B1' : undefined,
              transition: 'background-color 0.3s',
            }}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editMode ? (
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {editMode && (
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => handleDeleteRow(rowIndex)}>删除</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '16px' }}>
        <button onClick={handleAddRow} style={{ marginRight: '8px' }}>新增条目</button>
        <button onClick={() => setEditMode(!editMode)} style={{ marginRight: '8px' }}>
          {editMode ? '退出编辑模式' : '进入编辑模式'}
        </button>
        <button onClick={handleSave}>保存修改</button>
      </div>
    </div>
  );
}
