// 这个文件通常用来声明TypeScript中不易推断类型的模块、变量、函数等。它帮助TypeScript理解代码中的类型。
declare module '*.svg' {
    const content: any
    export default content
}

declare module '*.png' {
    const content: any
    export default content
}

declare module '*.jpg' {
    const content: any
    export default content
}

declare module 'react-star-ratings'

declare module '*.less' {
    const content: { [className: string]: string }
    export default content
}

declare module '*.css' {
    const content: { [className: string]: string }
    export = content
}

declare module '*.scss' {
    const content: { [className: string]: string }
    export = content
}

declare module '*.ttf' {
    const content: { [className: string]: string }
    export = content
}
