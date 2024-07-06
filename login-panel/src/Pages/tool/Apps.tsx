import React from 'react'

const UnreadIndicator = ({ count }: { count: number }) => { if (count === 0) return null;

    return (
        <span style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
        }}>
      {count}
    </span>
    );
};
