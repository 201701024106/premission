type menuItem = {
    name: string;
    i?: string; // 处理后的图标
    icon?: string;
    path: string;
    children?: menuItem[];
    index?: string;
    [key: string]: any;
}
export type { menuItem };