import React, { useState } from 'react';
import { ChevronRight, ChevronDown, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface Column {
  header: string;
  key: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataNode {
  id: string;
  data: Record<string, any>;
  children?: () => Promise<DataNode[]> | DataNode[];
}

interface ExpandableRowProps {
  node: DataNode;
  columns: Column[];
  level?: number;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({ node, columns, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<DataNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded && node.children && children.length === 0) {
      setIsLoading(true);
      const result = await node.children();
      setChildren(result);
      setIsLoading(false);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr 
        onClick={node.children ? handleToggle : undefined}
        className={cn(
          "group transition-all duration-300 border-b border-zinc-100 dark:border-zinc-800",
          isExpanded ? "bg-brand-500/5 dark:bg-brand-500/10" : "hover:bg-zinc-50 dark:hover:bg-black",
          node.children ? "cursor-pointer" : ""
        )}
      >
        {columns.map((col, i) => (
          <td 
            key={col.key} 
            className={cn(
              "py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-sm text-zinc-600 dark:text-zinc-400 font-medium whitespace-nowrap",
              i === 0 && "text-zinc-900 dark:text-white font-bold",
              col.key === 'trend' && "w-1 text-right pl-0"
            )}
            style={{ paddingLeft: i === 0 ? `${level * 12 + 8}px` : (col.key === 'trend' ? '0' : undefined) }}
          >
            <div className={cn("flex items-center gap-2 md:gap-3", col.key === 'trend' && "justify-end")}>
              {i === 0 && node.children && (
                <div 
                  className={cn(
                    "p-0.5 md:p-1 rounded-md md:rounded-lg transition-all duration-300",
                    isExpanded ? "bg-brand-500 text-white rotate-90" : "bg-zinc-100 dark:bg-night-bg text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200"
                  )}
                >
                  <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
                </div>
              )}
              <span className="truncate">
                {col.render ? col.render(node.data[col.key], node.data) : node.data[col.key]}
              </span>
            </div>
          </td>
        ))}
      </tr>
      {isExpanded && (
        <>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-4 px-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Loading Data...
                </div>
              </td>
            </tr>
          ) : (
            children.map(child => (
              <ExpandableRow 
                key={child.id} 
                node={child} 
                columns={columns} 
                level={level + 1} 
              />
            ))
          )}
        </>
      )}
    </>
  );
};

interface ExpandableTableProps {
  columns: Column[];
  data: DataNode[];
}

export const ExpandableTable: React.FC<ExpandableTableProps> = ({ columns, data }) => {
  const scrollRef = useDraggableScroll();
  return (
    <div 
      ref={scrollRef}
      className="w-full rounded-xl md:rounded-[2rem] border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-night-bg shadow-sm draggable-scroll custom-scrollbar transition-colors duration-500"
    >
      <table className="w-full min-w-max text-left border-collapse select-none md:select-text">
        <thead className="bg-zinc-50 dark:bg-black border-b border-zinc-200 dark:border-zinc-800 transition-colors">
          <tr>
            {columns.map(col => (
              <th key={col.key} className={cn(
                "py-2 md:py-5 px-2 md:px-6 text-[7px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap",
                col.key === 'trend' && "text-right w-1 pl-0"
              )}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {data.map(node => (
            <ExpandableRow key={node.id} node={node} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
