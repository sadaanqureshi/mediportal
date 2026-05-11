"use client";
import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface Column {
  header: string;
  accessor: string;
}

interface ReusableTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  actionLabel?: string;
}

const ReusableTable: React.FC<ReusableTableProps> = ({ 
  title, columns, data, onAdd, onEdit, onDelete, onView, actionLabel = "Add New" 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 w-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your records effectively</p>
        </div>
        
        {onAdd && (
          <button 
            onClick={onAdd} 
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-100"
          >
            + {actionLabel}
          </button>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px]"> 
          <thead className="bg-slate-50/50">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-4 px-6 text-sm text-slate-700 font-medium whitespace-nowrap">
                      {col.accessor === 'status' ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          ['Active', 'Processed', 'Completed'].includes(row.status) 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : ['Pending', 'Pending AI', 'Inactive'].includes(row.status)
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}>
                          {row[col.accessor]}
                        </span>
                      ) : (
                        row[col.accessor]
                      )}
                    </td>
                  ))}
                  
                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {onView && (
                        <button onClick={() => onView(row)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center text-slate-400 text-sm">
                  No records found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;