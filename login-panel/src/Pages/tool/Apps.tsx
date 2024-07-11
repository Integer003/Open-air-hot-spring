import React from 'react'

export const UnreadIndicator = ({ count }: { count: number }) => { if (count === 0) return null;
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

export const parseDataString = (dataString: string) => {
    const jsonRegex = /{.*?}[^*]/g; // 匹配不以星号结束的JSON对象
    return dataString.split(/}{/).map((str) => {
        if (str.trim() === '') return null; // 过滤掉空字符串
        return JSON.parse(str + '}');
    }).filter(Boolean); // 过滤掉null值
};
