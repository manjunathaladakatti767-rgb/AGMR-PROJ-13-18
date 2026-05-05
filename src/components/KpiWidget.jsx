import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KpiWidget = ({ title, value, trend, trendValue, isPositive }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      {trend && (
        <div className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
  );
};

export default KpiWidget;
