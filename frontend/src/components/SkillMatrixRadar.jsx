import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export const SkillMatrixRadar = ({ categories = [] }) => {
  const chartData = categories.length > 0 ? categories.map((c) => ({
    subject: c.category,
    Score: c.score,
    fullMark: 100,
  })) : [
    { subject: 'Frontend', Score: 85, fullMark: 100 },
    { subject: 'Backend', Score: 70, fullMark: 100 },
    { subject: 'Database', Score: 75, fullMark: 100 },
    { subject: 'Cloud', Score: 40, fullMark: 100 },
    { subject: 'DevOps', Score: 35, fullMark: 100 },
    { subject: 'Tools', Score: 90, fullMark: 100 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Skill Matrix</span>
          <span className="text-xs text-brand-400 font-medium">Domain Balance</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Category Proficiency Radar</h3>
      </div>

      <div className="w-full h-64 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'Proficiency']}
            />
            <Radar
              name="Student Coverage"
              dataKey="Score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-800 flex justify-around text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
          <span>Current Profile Strength</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span>100% Full Role Target</span>
        </div>
      </div>
    </div>
  );
};
