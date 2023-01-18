"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// path.get 表示获取某个属性的path
// path.matchesPattern 检查某个节点是否符合某种模式
// path.remove 删除当前节点

var isProduction = process.env.NODE_ENV === 'production';
var name = 'code-cleaner';

/**
 * check comment
 * @param node 
 * @param commentWord 
 * @returns 
 */
var isReserveComment = function isReserveComment(node, commentWord) {
  var value = node.value,
    type = node.type;
  return ['CommentBlock', 'CommentLine'].includes(type) && value.includes(commentWord);
};

/**
 * clear main
 * @param path 
 * @param commentWord 
 */
var cleanConsoleExpression = function cleanConsoleExpression(path, commentWord) {
  var parentNode = path.parentPath.node;
  var leadingComments = parentNode.leadingComments,
    trailingComments = parentNode.trailingComments;
  var commentHasMap = {
    leading: false,
    //前缀注释
    trailing: false //后缀注释
  };
  // 前缀注释处理
  if (leadingComments && leadingComments.length) {
    leadingComments.forEach(function (comment) {
      if (isReserveComment(comment, commentWord) && !comment.currentLineValue) {
        commentHasMap.leading = true;
      }
    });
  }
  // 后缀注释处理
  if (trailingComments && trailingComments.length) {
    var currentLine = parentNode.loc.start.line;
    trailingComments.forEach(function (comment) {
      var currentCommentLine = comment.loc.start.line;
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
var visitor = {
  CallExpression: function CallExpression(path, opts) {
    var _opts$opts = opts.opts,
      _opts$opts$commentWor = _opts$opts.commentWord,
      commentWord = _opts$opts$commentWor === void 0 ? '@ignore-code-cleaner' : _opts$opts$commentWor,
      env = _opts$opts.env;
    var calleePath = path.get('callee');
    if (calleePath && calleePath.matchesPattern('console', true)) {
      if (isProduction || env === 'production') {
        cleanConsoleExpression(path, commentWord);
      }
    }
  },
  // 如果设置了 ignoreDebug = true， 则不删除debugger
  DebuggerStatement: function DebuggerStatement(path, opts) {
    var ignoreDebug = opts.opts.ignoreDebug;
    if (!ignoreDebug) {
      path.remove();
    }
  }
};
var codeCleaner = function codeCleaner() {
  return {
    visitor: visitor,
    name: name
  };
};
var _default = codeCleaner;
exports["default"] = _default;