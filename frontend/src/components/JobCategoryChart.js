import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';



const COLORS = ["#6ee7b7", "#60a5fa", "#f472b6", "#fb923c"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey - 6} textAnchor={textAnchor} fill="#f1f5f9" fontSize={17} fontWeight={600}>
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 16} textAnchor={textAnchor} fill="#94a3b8" fontSize={15}>
        {`${value} · ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

export default class JobCategoryChart extends PureComponent {

  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {

    const { data, selectedTitle, onTitleSelect } = this.props;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={500} height={500}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
            onClick={(pieData) => onTitleSelect && onTitleSelect(pieData.name)}
            style={{ cursor: 'pointer' }}
          >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={selectedTitle && entry.name !== selectedTitle ? 0.3 : 1}
              stroke={entry.name === selectedTitle ? '#ffffff' : 'none'}
              strokeWidth={entry.name === selectedTitle ? 2 : 0}
            />
          ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
