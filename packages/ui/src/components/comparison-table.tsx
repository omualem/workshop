import { Card } from "./card";

type ComparisonColumn = {
  title: string;
  score: number;
  price: string;
  pickupPoints: string;
  explanation: string;
};

export const ComparisonTable = ({ columns }: { columns: ComparisonColumn[] }) => (
  <Card className="overflow-x-auto p-0">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          <th className="px-4 py-3 text-right font-medium">מדד</th>
          {columns.map((column) => (
            <th key={column.title} className="px-4 py-3 text-right font-medium">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-3 font-medium text-slate-700">ציון כולל</td>
          {columns.map((column) => (
            <td key={`${column.title}-score`} className="px-4 py-3 text-slate-900">
              {column.score.toFixed(1)}
            </td>
          ))}
        </tr>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-3 font-medium text-slate-700">מחיר</td>
          {columns.map((column) => (
            <td key={`${column.title}-price`} className="px-4 py-3 text-slate-900">
              {column.price}
            </td>
          ))}
        </tr>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-3 font-medium text-slate-700">איסופים</td>
          {columns.map((column) => (
            <td key={`${column.title}-pickup`} className="px-4 py-3 text-slate-900">
              {column.pickupPoints}
            </td>
          ))}
        </tr>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-3 font-medium text-slate-700">למה זה מדורג כך</td>
          {columns.map((column) => (
            <td key={`${column.title}-explanation`} className="px-4 py-3 text-slate-600">
              {column.explanation}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </Card>
);
