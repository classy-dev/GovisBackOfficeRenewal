import React from 'react';

export const DonutBasicLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: entry.color,
              marginRight: '10px',
            }}
          />
          {entry.value} - {entry.payload.percent}%
          <span
            style={{
              color: entry.payload.increase > 0 ? 'green' : 'red',
              marginLeft: '5px',
            }}
          >
            {entry.payload.increase > 0 ? '+' : ''}
            {entry.payload.increase}%
          </span>
        </li>
      ))}
    </ul>
  );
};
