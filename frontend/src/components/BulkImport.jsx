import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';
import { API } from '../config/api';

const BulkImport = ({ token, onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedRecords, setFailedRecords] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        // Basic frontend validation
        const validatedData = rawData.map((row, index) => {
          const errors = [];
          if (!row.title) errors.push("Missing title");
          if (!row.price || isNaN(row.price)) errors.push("Invalid price");
          if (!row.propertyType) errors.push("Missing propertyType");
          if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push("Invalid email format");
          if (row.phone && !/^[0-9\-\+\s\(\)]{10,15}$/.test(row.phone)) errors.push("Invalid phone format");
          if (!row.lng || !row.lat) errors.push("Missing coordinates");
          
          return {
            ...row,
            _rowNum: index + 2, // +1 for 0-index, +1 for header row
            _errors: errors
          };
        });
        
        setData(validatedData);
        setPreview(true);
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleImport = async () => {
    const validData = data.filter(row => row._errors.length === 0);
    if (validData.length === 0) {
        alert("No valid records to import.");
        return;
    }

    setImporting(true);
    setProgress(0);
    const chunkSize = 10;
    let newFailedRecords = [...data.filter(row => row._errors.length > 0).map(row => ({
        ...row,
        error: row._errors.join(", ")
    }))];

    for (let i = 0; i < validData.length; i += chunkSize) {
      const chunk = validData.slice(i, i + chunkSize);
      try {
        const response = await fetch(`${API.BASE_URL}/admin/properties/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ properties: chunk })
        });
        const result = await response.json();
        
        if (result.success && result.results) {
            if (result.results.failed && result.results.failed.length > 0) {
                // Find original rows and attach errors
                const failedChunk = result.results.failed.map(f => {
                    const origRow = chunk.find(c => c._rowNum === f.rowNum) || {};
                    return { ...origRow, error: f.error };
                });
                newFailedRecords = [...newFailedRecords, ...failedChunk];
            }
        } else {
            // Entire chunk failed
            newFailedRecords = [...newFailedRecords, ...chunk.map(c => ({...c, error: result.message || "Server Error"}))];
        }
      } catch (error) {
        newFailedRecords = [...newFailedRecords, ...chunk.map(c => ({...c, error: error.message}))];
      }
      
      setProgress(Math.min(validData.length, i + chunkSize));
    }
    
    setFailedRecords(newFailedRecords);
    setImporting(false);
    
    if (newFailedRecords.length === 0) {
        alert("All properties imported successfully!");
        setPreview(false);
        setFile(null);
        setData([]);
        if (onImportComplete) onImportComplete();
    }
  };

  const downloadFailedRecords = () => {
    if (failedRecords.length === 0) return;
    
    const ws = XLSX.utils.json_to_sheet(failedRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Records");
    XLSX.writeFile(wb, "failed_imports.xlsx");
  };

  const resetForm = () => {
    setFile(null);
    setData([]);
    setPreview(false);
    setFailedRecords([]);
    setProgress(0);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const validCount = data.filter(r => r._errors.length === 0).length;
  const invalidCount = data.length - validCount;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FileSpreadsheet className="mr-2 text-indigo-600" />
        Bulk Import Properties
      </h2>
      
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium text-lg mb-2">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm mb-4">Supported files: .xlsx, .xls, .csv</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Select File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">File: {file?.name}</p>
              <div className="flex space-x-4 mt-1 text-sm">
                <span className="text-gray-600">Total: {data.length}</span>
                <span className="text-green-600">Valid: {validCount}</span>
                <span className="text-red-600">Invalid: {invalidCount}</span>
              </div>
            </div>
            {!importing && failedRecords.length === 0 && (
                <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                <X className="h-6 w-6" />
                </button>
            )}
          </div>

          {importing && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 text-gray-700">
                <span>Importing...</span>
                <span>{progress} / {validCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(progress / validCount) * 100}%` }}></div>
              </div>
            </div>
          )}

          {failedRecords.length > 0 && !importing && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="text-red-800 font-semibold flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {failedRecords.length} records failed to import
                    </h3>
                    <p className="text-red-600 text-sm mt-1">Please download the error file, fix the issues, and try again.</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={downloadFailedRecords} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center text-sm font-medium">
                        <Download className="h-4 w-4 mr-2" /> Download Errors
                    </button>
                    <button onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center text-sm font-medium">
                        <RefreshCw className="h-4 w-4 mr-2" /> Start Over
                    </button>
                </div>
            </div>
          )}

          {failedRecords.length === 0 && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-700 sticky top-0">
                    <tr>
                      <th className="p-3 border-b">Row</th>
                      <th className="p-3 border-b">Status</th>
                      <th className="p-3 border-b">Title</th>
                      <th className="p-3 border-b">Price</th>
                      <th className="p-3 border-b">Type</th>
                      <th className="p-3 border-b">City</th>
                      <th className="p-3 border-b">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 100).map((row, idx) => ( // show only first 100 for performance
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500 text-sm">{row._rowNum}</td>
                        <td className="p-3">
                            {row._errors.length === 0 ? 
                                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            }
                        </td>
                        <td className="p-3 font-medium text-gray-800">{row.title || '-'}</td>
                        <td className="p-3 text-gray-600">{row.price ? `$${row.price}` : '-'}</td>
                        <td className="p-3 text-gray-600 capitalize">{row.propertyType || '-'}</td>
                        <td className="p-3 text-gray-600">{row.city || '-'}</td>
                        <td className="p-3 text-red-500 text-sm">{row._errors.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 100 && (
                    <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 border-t">
                        Showing first 100 records out of {data.length}
                    </div>
                )}
              </div>
          )}

          {!importing && failedRecords.length === 0 && (
            <div className="flex justify-end space-x-4">
              <button 
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleImport}
                disabled={validCount === 0}
                className={`px-6 py-2 rounded-lg transition ${
                    validCount > 0 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Import ({validCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkImport;
