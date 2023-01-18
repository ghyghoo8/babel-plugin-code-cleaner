declare var process : {
  env: Record<string, unknown>
}

type ItemProp = Record<string, any>
// path.get 表示获取某个属性的path
// path.matchesPattern 检查某个节点是否符合某种模式
// path.remove 删除当前节点
interface IPathType extends ItemProp {
  get: any
  matchesPattern: any
  remove: any
}

const isProduction = process.env.NODE_ENV === 'production';

const name = 'code-cleaner'

/**
 * check comment
 * @param node 
 * @param commentWord 
 * @returns 
 */
const isReserveComment = (node: ItemProp, commentWord: string) => {
  const { value, type } = node
  return ['CommentBlock', 'CommentLine'].includes(type) && value.includes(commentWord)
};

/**
 * clear main
 * @param path 
 * @param commentWord 
 */
const cleanConsoleExpression = (path: IPathType, commentWord:string) => {
  const parentNode = path.parentPath.node as ItemProp;
  const { leadingComments, trailingComments } = parentNode
  const commentHasMap = {
    leading: false, //前缀注释
    trailing: false //后缀注释
  }
  // 前缀注释处理
  if (leadingComments && leadingComments.length) {
    leadingComments.forEach((comment:ItemProp) => {
      if (isReserveComment(comment, commentWord) && !comment.currentLineValue) {
        commentHasMap.leading = true;
      }
    });
  }
  // 后缀注释处理
  if (trailingComments && trailingComments.length) {
    const {
      start: { line: currentLine }
    } = parentNode.loc; 
    
    trailingComments.forEach((comment:ItemProp) => {
      const {
        start: { line: currentCommentLine }
      } = comment.loc; 
      if (currentLine === currentCommentLine) {
        comment.currentLineValue = true;
      }
      if (isReserveComment(comment, commentWord) && comment.currentLineValue) {
        commentHasMap.trailing = true;
      }
    });
  }

  if (!commentHasMap.leading && !commentHasMap.trailing) {
    path.remove();
  }
};

const visitor = {
  CallExpression(path: IPathType, opts: ItemProp ) {
    const { commentWord = '@ignore-code-cleaner', env } = opts.opts; 
    const calleePath = path.get('callee');
    if (calleePath && calleePath.matchesPattern('console', true)) {
      if (isProduction || env === 'production') {
        cleanConsoleExpression(path, commentWord);
      }
    }
  },
  // 如果设置了 ignoreDebug = true， 则不删除debugger
  DebuggerStatement(path: IPathType, opts: ItemProp) {
    const { ignoreDebug } = opts.opts
    if (!ignoreDebug) {
      path.remove();
    }
  },
}

const codeCleaner =  () => {
  return {
    visitor,
    name
  };
}

export default codeCleaner 
