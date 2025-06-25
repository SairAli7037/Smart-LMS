import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';

const COLORS = ['#10b981', '#f87171'];

const InstructorAnalytics = ({ data }) => {
 if (!data || data.length === 0) {
  return (
    <div className="bg-white border rounded-2xl p-6 text-center text-gray-600 shadow-sm">
      <p className="text-xl mb-2">📊 No analytics data available</p>
      <p className="text-sm">You haven't assigned any quizzes or received submissions yet.</p>
    </div>
  );
}

  const {
    total_students,
    total_quizzes,
    total_submissions,
    average_score,
    score_distribution,
    completion_distribution
  } = data[0];

  const pieData = [
    { name: 'Completed', value: completion_distribution.Completed },
    { name: 'Incomplete', value: completion_distribution.Incomplete }
  ];

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {[
          { label: 'Total Students', value: total_students },
          { label: 'Total Quizzes', value: total_quizzes },
          { label: 'Submissions', value: total_submissions },
          { label: 'Avg Score', value: average_score }
        ].map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-white to-gray-300 p-4 rounded-2xl shadow-sm border hover:shadow-md transition">
            <h4 className="text-sm text-gray-500 mb-1">{item.label}</h4>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {score_distribution.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-gray-400 shadow border rounded-2xl">
            No score data available
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={score_distribution} barSize={40}>
              <XAxis dataKey="score" stroke="#888" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="count" position="top" fill="#000" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        )}

  
        {(pieData[0].value === 0 && pieData[1].value === 0) ? (
           <div className="h-[280px] flex items-center justify-center text-gray-400 shadow border rounded-2xl">
             No completion data available
           </div>
         ) : (
          <div className="bg-white p-5 rounded-2xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🎯 Completion Rate</h3>
           <ResponsiveContainer width="100%" height={280}>
             <PieChart>
               <Pie
                 data={pieData}
                 dataKey="value"
                 nameKey="name"
                 cx="50%"
                 cy="50%"
                 outerRadius={85}
                 innerRadius={40}
                 labelLine={false}
                 label={({ name, percent }) =>
                   `${name} ${(percent * 100).toFixed(0)}%`
                 }
               >
                 {pieData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip />
               <Legend verticalAlign="bottom" height={36} />
             </PieChart>
           </ResponsiveContainer>
           </div>
         )}
         
      </div>
    </div>
  );
};

export default InstructorAnalytics;
