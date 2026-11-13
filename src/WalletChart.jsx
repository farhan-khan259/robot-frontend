import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
export default function WalletChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid vertical={false} stroke="#E3EDDD" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis width={65} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Area
          name="Deposits"
          type="monotone"
          dataKey="deposits"
          stroke="#5C7057"
          fill="#D1EDD3"
        />
        <Area
          name="Net withdrawals"
          type="monotone"
          dataKey="withdrawals"
          stroke="#89A482"
          fill="#F5F9F2"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
