import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourcePath = path.resolve(__dirname, "../pages/channels/ChannelCard.tsx");
const targetPath = path.resolve(__dirname, "../pages/channels/ChannelCard2.tsx");

const DEFAULT_TRANSFORM_TAGS = ["Link", "a", "button", "img"];
const DEFAULT_REMOVE_VARIABLES = ["toast", "router", "dispatch", "state"];
const DEFAULT_SKELETON_STYLE = ["animate-pulse", "bg-gray-200", "rounded"]; // 루트에는 포함 안되도록 설정
const DEFAULT_EXCLUDE_CLASSES = ["hover", "transition", "ease", "animate"]; // 모든 곳에서 제거해야할 항목
const DEFAULT_NOT_IN_ROOT = ["bg", "rounded", "border"]; // 루트에서 제거하면 안되는 항목

class SkeletonTransformer {
  processedNodes;

  constructor(sourcePath, targetPath) {
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;
    this.processedNodes = new WeakMap();
  }

  generate() {
    const parserOptions = {
      sourceType: "module",
      plugins: ["typescript", "jsx", "classProperties", "dynamicImport"]
    }

    const sourceCode = fs.readFileSync(sourcePath, "utf-8");
    const ast = parser.parse(sourceCode, parserOptions);
    const visitors = this.createVisitors();

    traverse.default(ast, visitors);

    const skeletonComponentName = `Skeleton${path.basename(sourcePath, '.tsx')}`;
    const exportDeclaration = t.exportDefaultDeclaration(t.identifier(skeletonComponentName));
    ast.program.body.push(exportDeclaration);

    const { code } = generate.default(ast, {}, sourceCode);
    fs.writeFileSync(targetPath, code, 'utf-8');
    console.log(`스켈레톤 컴포넌트 생성: ${targetPath}`);
  }

  createVisitors() {
    const localVarsToRemove = new Set();
    
    return {
      ImportDeclaration: (path) => path.remove(),
      ExportDeclaration: (path) => path.remove(),
      TSInterfaceDeclaration: (path) => path.remove(),
      TSTypeAliasDeclaration: (path) => path.remove(),
      
      VariableDeclaration: (path) => this.handleVariableDeclaration(path, localVarsToRemove),

      JSXElement: (path) => this.handleJSXElement(path),
      JSXExpressionContainer: (path) => this.handleJSXExpressionContainer(path),
      JSXText: (path) => this.handleJSXText(path),
      ReturnStatement: (path) => this.handleReturnStatement(path),
      CallExpression: (path) => this.handleCallExpression(path, localVarsToRemove)
    };
  }

  handleVariableDeclaration(path, localVarsToRemove) {
    if (path.node.declarations.length > 0 && 
        t.isVariableDeclarator(path.node.declarations[0]) && 
        t.isArrowFunctionExpression(path.node.declarations[0].init)) {

      const originalName = path.node.declarations[0].id.name;
      path.node.declarations[0].init.params = [];
      path.node.declarations[0].id.name = `Skeleton${originalName}`;
  
      this.processArrowFunctionBody(path.node.declarations[0].init);
    }

    if (path.node.declarations.some(decl => 
      t.isIdentifier(decl.id) && 
      DEFAULT_REMOVE_VARIABLES.includes(decl.id.name))) {
      
      path.node.declarations.forEach(decl => {
        if (t.isIdentifier(decl.id) && DEFAULT_REMOVE_VARIABLES.includes(decl.id.name)) {
          localVarsToRemove.add(decl.id.name);
        }
      });
      
      path.remove();
    }
  }
  
  processArrowFunctionBody(arrowFunction) {
    if (t.isBlockStatement(arrowFunction.body)) {
      const returnStatement = arrowFunction.body.body.find(
        stmt => t.isReturnStatement(stmt)
      );
      
      if (returnStatement && t.isJSXElement(returnStatement.argument)) {
        this.processJSXElementClassName(returnStatement.argument, true);
      }
    } 
    else if (t.isJSXElement(arrowFunction.body)) {
      this.processJSXElementClassName(arrowFunction.body, true);
    }
  }
  
  processJSXElementClassName(element, isRootElement = false) {
    if (!element || !element.openingElement) return;
    const openingElement = element.openingElement;
    const classNameAttr = openingElement.attributes.find(
      attr => t.isJSXAttribute(attr) && attr.name.name === 'className'
    );
    
    if (classNameAttr) {
      if (t.isStringLiteral(classNameAttr.value)) {
        const existingClassName = classNameAttr.value.value;
        const filteredClasses = utils.filterClassNames(
          existingClassName, 
          DEFAULT_EXCLUDE_CLASSES, 
          isRootElement, 
          DEFAULT_NOT_IN_ROOT
        );
        const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, isRootElement);
        classNameAttr.value = t.stringLiteral(combinedClassName);
      } 
      else if (t.isJSXExpressionContainer(classNameAttr.value)) {
        const expression = classNameAttr.value.expression;
        let staticClassName = '';
        if (t.isTemplateLiteral(expression)) {
          staticClassName = expression.quasis
            .map(quasi => quasi.value.raw)
            .join(' ')
            .trim();
        }
        else if (t.isStringLiteral(expression)) {
          staticClassName = expression.value;
        }
        const filteredClasses = utils.filterClassNames(
          staticClassName, 
          DEFAULT_EXCLUDE_CLASSES, 
          isRootElement, 
          DEFAULT_NOT_IN_ROOT
        );
        const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, isRootElement);
        
        classNameAttr.value = t.stringLiteral(combinedClassName);
      }
    } else {
      if (!isRootElement) {
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(DEFAULT_SKELETON_STYLE.join(' '))
          )
        );
      }
    }
  }
  
  handleJSXElement(path) {
    if (this.processedNodes.get(path.node)) return;
    this.processedNodes.set(path.node, true);
    
    const expressions = path.node.children.filter(
      child => t.isJSXExpressionContainer(child)
    );

    if (expressions.length > 0) {
      const existingClassName = utils.getClassNameValue(path.node.openingElement.attributes);
      const filteredClasses = utils.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
      const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);
      
      const skeletonElement = utils.createSkeletonElement(combinedClassName);
      this.processedNodes.set(skeletonElement, true);
      
      path.replaceWith(skeletonElement);
      return;
    }

    if (t.isJSXOpeningElement(path.node.openingElement)) {
      const tagName = path.node.openingElement.name.name;
      
      if (DEFAULT_TRANSFORM_TAGS.includes(tagName)) {
        path.node.openingElement.name.name = 'div';
        path.node.closingElement.name.name = 'div';
      }

      path.node.openingElement.attributes = path.node.openingElement.attributes.filter(
        attr => t.isJSXAttribute(attr) && (attr.name.name === 'className' || attr.name.name === 'class')
      );
    }
  }
  
  handleJSXExpressionContainer(path) {
    if (this.processedNodes.get(path.node)) return;
    this.processedNodes.set(path.node, true);
    
    const parentElement = path.findParent((p) => t.isJSXElement(p));
    const openingElement = parentElement?.node.openingElement;
    if (!openingElement) return;

    const existingClassName = utils.getClassNameValue(openingElement.attributes);
    const filteredClasses = utils.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
    const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);

    const skeletonElement = utils.createSkeletonElement(combinedClassName);
    this.processedNodes.set(skeletonElement, true);
    
    path.replaceWith(skeletonElement);
  }
  
  handleJSXText(path) {
    if (this.processedNodes.get(path.node)) return;
    
    if (path.node.value.trim() !== '') { 
      this.processedNodes.set(path.node, true); 

      const parentPath = path.findParent(p => t.isJSXElement(p));
      if (!parentPath || !parentPath.node.openingElement) return;
      
      const openingElement = parentPath.node.openingElement;
      const existingClassName = utils.getClassNameValue(openingElement.attributes);
      const filteredClasses = utils.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
      const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);

      const classNameAttr = openingElement.attributes.find(attr =>
        t.isJSXAttribute(attr) && attr.name.name === 'className'
      );
      
      if (classNameAttr) { 
        classNameAttr.value = t.stringLiteral(combinedClassName);
      } else { 
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(combinedClassName)
          )
        );
      }
      
      parentPath.node.children = [t.jsxText('채우기')];
    }
  }
  
  handleReturnStatement(path) {
    const argument = path.node.argument;
    
    if (t.isJSXElement(argument)) {
      const openingElement = argument.openingElement;
      const classNameAttr = openingElement.attributes.find(
        attr => t.isJSXAttribute(attr) && attr.name.name === 'className'
      );
      
      if (classNameAttr) {
        if (t.isJSXExpressionContainer(classNameAttr.value)) {
          const expression = classNameAttr.value.expression;
          
          if (t.isTemplateLiteral(expression)) {
            const staticParts = expression.quasis
              .map(quasi => quasi.value.raw)
              .join(' ')
              .trim();
            
            const filteredClasses = utils.filterClassNames(
              staticParts, 
              DEFAULT_EXCLUDE_CLASSES, 
              true, 
              DEFAULT_NOT_IN_ROOT
            );
            const combinedClassName = utils.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, true);
            classNameAttr.value = t.stringLiteral(combinedClassName);
          }
        }
      }
    }
  }
  
  handleCallExpression(path, localVarsToRemove) {
    const callee = path.node.callee;

    if (t.isIdentifier(callee) && 
        (callee.name.startsWith('use') || DEFAULT_REMOVE_VARIABLES.includes(callee.name) || localVarsToRemove.has(callee.name))) {
      path.remove();
      return;
    }

    if (t.isArrowFunctionExpression(path.node) || 
        t.isFunctionExpression(path.node)) {
      path.remove();
    }
  }
}

const utils = {
  getClassNameValue(attributes) {
    const classNameAttr = attributes.find(attr => 
      t.isJSXAttribute(attr) && attr.name.name === 'className'
    );
    if (!classNameAttr) return '';
    
    if (t.isStringLiteral(classNameAttr.value)) {
      return classNameAttr.value.value;
    }
    
    if (t.isJSXExpressionContainer(classNameAttr.value)) {
      const expression = classNameAttr.value.expression;
      if (t.isTemplateLiteral(expression)) {
        return expression.quasis
          .map(quasi => quasi.value.raw)
          .join(' ')
          .trim();
      }
      if (t.isStringLiteral(expression)) {
        return expression.value;
      }
    }
    
    return '';
  },
  filterClassNames(classNames, excludeClasses, isRootElement = false, keepClasses = []) {
    if (!classNames || classNames.trim() === '') {
      return [];
    }
    
    return classNames.split(' ').filter(className => {
      if (!className) return false;
      if (isRootElement && keepClasses.some(keep => className.startsWith(keep))) {
        return true;
      }
      if (!isRootElement && keepClasses.some(keep => className.startsWith(keep))) {
        return false;
      }
      if (excludeClasses.some(exclude => className.startsWith(exclude))) {
        return false;
      }
      return true;
    });
  },
  combineClassNames(filteredClasses, skeletonStyle, isRootElement = false) {
    if (isRootElement) {
      return filteredClasses.join(' ').trim();
    } else {
      return [...skeletonStyle, ...filteredClasses].join(' ').trim();
    }
  },
  createSkeletonElement(className) {
    return t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier('div'), 
        [
          t.jsxAttribute(
            t.jsxIdentifier('className'), 
            t.stringLiteral(className)
          )
        ],
        false
      ),
      t.jsxClosingElement(t.jsxIdentifier('div')),
      [t.jsxText('채우기')],
      false
    );
  }
};

function generateSkeleton(sourcePath, targetPath) {
  const transformer = new SkeletonTransformer(sourcePath, targetPath);
  transformer.generate();
}

generateSkeleton(sourcePath, targetPath);