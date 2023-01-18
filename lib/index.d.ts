type ItemProp = Record<string, any>;
interface IPathType extends ItemProp {
    get: any;
    matchesPattern: any;
    remove: any;
}
declare const codeCleaner: () => {
    visitor: {
        CallExpression(path: IPathType, opts: ItemProp): void;
        DebuggerStatement(path: IPathType, opts: ItemProp): void;
    };
    name: string;
};
export default codeCleaner;
