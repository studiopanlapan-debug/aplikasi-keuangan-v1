import React, { useMemo } from 'react';
import { useFinanceData } from '../hooks/useFinanceData.ts';
import Card from './ui/Card.tsx';
import ProgressBar from './ui/ProgressBar.tsx';
import SkeletonCard from './ui/SkeletonCard.tsx';
import { formatToRupiah } from '../utils/formatters.ts';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  financeData: ReturnType<typeof useFinanceData>;
  theme: string;
}

const PIE_COLORS = ['#0ea5e9', '#14b8a6', '#8b5cf6', '#f97316', '#ec4899', '#facc15'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const wrapperClasses = "bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg";
    const textClasses = "text-gray-800 dark:text-white";
    const labelClasses = `label font-bold mb-1 ${textClasses}`;

    if (payload[0].payload.name) { // For Pie Chart
      return (
        <div className={wrapperClasses}>
          <p className={labelClasses}>{`${payload[0].name} : ${formatToRupiah(payload[0].value)}`}</p>
        </div>
      );
    }
     // For Bar/Line Chart
    return (
      <div className={`${wrapperClasses} text-sm`}>
        <p className={labelClasses}>{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${formatToRupiah(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const Dashboard: React.FC<DashboardProps> = ({ financeData, theme }) => {
  const { allocations, totalAssets, monthlyRecap } = financeData || {};
  
  const axisColor = theme === 'dark' ? '#A0A0A0' : '#6B7280';
  const gridColor = theme === 'dark' ? '#3E3E3E' : '#E5E7EB';

  const isLoading = !financeData || !allocations || allocations.length === 0;

  const yAxisFormatter = (value: any) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return 'Rp0';

    if (numValue >= 1000000) {
      return `Rp${(numValue / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
    }
    if (numValue >= 1000) {
      return `Rp${(numValue / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Rb`;
    }
    return `Rp${numValue.toLocaleString('id-ID')}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const pieChartData = useMemo(() => {
    return allocations.map(a => ({ name: a.category, value: a.actualBalance }));
  }, [allocations]);

  const barChartData = useMemo(() => {
    return allocations.map(a => {
      const nominalTarget = a.specificTarget ?? (totalAssets * (a.targetPercentage / 100));
      return {
        name: a.category.split(' ')[0],
        Realisasi: a.actualBalance,
        Target: nominalTarget,
      };
    });
  }, [allocations, totalAssets]);

  const lineChartData = useMemo(() => {
      return monthlyRecap.map(r => ({
          name: r.month.split(' ')[0],
          'Total Aset': r.finalBalance
      }));
  }, [monthlyRecap]);

  const specificGoals = useMemo(() => {
    return allocations.filter(a => a.specificTarget && a.specificTarget > 0);
  }, [allocations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1 */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="Tren Total Aset Bulanan">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} tickFormatter={yAxisFormatter} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: axisColor }} />
                <Line type="monotone" dataKey="Total Aset" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Perbandingan Target vs Realisasi">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} tickFormatter={yAxisFormatter} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: axisColor }} />
                <Bar dataKey="Target" fill="#d1d5db" />
                <Bar dataKey="Realisasi" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Column 2 */}
      <div className="lg:col-span-1 space-y-6">
        <Card title="Distribusi Saldo Aktual">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {pieChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: '12px', color: axisColor}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Progress Target Spesifik">
            <div className="space-y-4">
            {specificGoals.map(goal => (
                <ProgressBar
                    key={goal.id}
                    label={goal.category}
                    current={goal.actualBalance}
                    target={goal.specificTarget!}
                />
            ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;