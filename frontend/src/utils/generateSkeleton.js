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
const sourcePath = path.resolve(__dirname, "../pages/questions/QuestionCard.tsx");
const targetPath = path.resolve(__dirname, "../pages/questions/QuestionCard2.tsx");

const generateSkeleton = ({
  sourcePath,
  targetPath,
  transformTags = ["Link", "a", "button", "img"],
  removeVariables = ["toast", "router", "dispatch", "state"] 
}) => {
  const sourceCode = fs.readFileSync(sourcePath, 'utf-8');

  const parserOptions = {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
      'classProperties',
      'dynamicImport'
    ]
  };

  const ast = parser.parse(sourceCode, parserOptions);
  const localVarsToRemove = new Set();

  traverse.default(ast, {
    ImportDeclaration(path) { path.remove(); },
    ExportDeclaration(path) { path.remove(); },
    TSInterfaceDeclaration(path) { path.remove(); },
    TSTypeAliasDeclaration(path) { path.remove(); },
    
    VariableDeclaration(path) {
      if (t.isVariableDeclarator(path.node.declarations[0]) && 
          t.isArrowFunctionExpression(path.node.declarations[0].init)) {
        const originalName = path.node.declarations[0].id.name;
        path.node.declarations[0].init.params = []; // props 제거
        path.node.declarations[0].id.name = `Skeleton${originalName}`;
      }

      if (path.node.declarations.some(decl => 
        t.isIdentifier(decl.id) && 
        removeVariables.includes(decl.id.name))) {
        
        path.node.declarations.forEach(decl => {
          if (t.isIdentifier(decl.id) && removeVariables.includes(decl.id.name)) {
            localVarsToRemove.add(decl.id.name);
          }
        });
        
        path.remove();
      }
    },
    
    JSXElement(path) {
      const existingClassName = getClassNameValue(path.node.openingElement.attributes);
      const filteredClasses = existingClassName.split(' ').filter(className => 
        !['hover', 'transition', 'ease', 'bg', 'rounded', 'animate'].some(removeClass => 
          className.startsWith(removeClass)
        )
      );
      const combinedClassName = ['animate-pulse', 'bg-gray-200', 'rounded', ...filteredClasses].join(' ').trim();
      const expressions = path.node.children.filter(
        child => t.isJSXExpressionContainer(child)
      );

      const skeletonElement = t.jsxElement(
        t.jsxOpeningElement(
          t.jsxIdentifier('div'), 
          [
            t.jsxAttribute(
              t.jsxIdentifier('className'), 
              t.stringLiteral(combinedClassName)
            )
          ],
          false
        ),
        t.jsxClosingElement(t.jsxIdentifier('div')),
        [t.jsxText('채우기')],
        false
      );
      
      if (expressions.length > 0) {
        path.replaceWith(skeletonElement);
        return;
      }

      if (t.isJSXOpeningElement(path.node.openingElement)) {
        const tagName = path.node.openingElement.name.name;
        
        if (transformTags.includes(tagName)) {
          path.node.openingElement.name.name = 'div';
          path.node.closingElement.name.name = 'div';
        }

        path.node.openingElement.attributes = path.node.openingElement.attributes.filter(
          attr => t.isJSXAttribute(attr) && 
                  (attr.name.name === 'className' || attr.name.name === 'class')
        );
      }
    },
    
    JSXExpressionContainer(path) {
      const parentElement = path.findParent((p) => t.isJSXElement(p));
      const openingElement = parentElement?.node.openingElement;
      if (!openingElement) return;

      const classNameAttr = openingElement.attributes.find(attr =>
        t.isJSXAttribute(attr) && attr.name.name === 'className'
      );

      const existingClassName = getClassNameValue(openingElement.attributes);
  
      const filteredClasses = existingClassName.split(' ').filter(className => 
        !['hover', 'transition', 'ease', 'bg', 'rounded', 'animate'].some(removeClass => 
          className.startsWith(removeClass)
        )
      );
      
      const combinedClassName = ['animate-pulse', 'bg-gray-200', 'rounded', ...filteredClasses].join(' ').trim();
      const skeletonElement = t.jsxElement(
        t.jsxOpeningElement(
          t.jsxIdentifier('div'), 
          [
            t.jsxAttribute(
              t.jsxIdentifier('className'), 
              t.stringLiteral(combinedClassName)
            )
          ],
          false
        ),
        t.jsxClosingElement(t.jsxIdentifier('div')),
        [t.jsxText('채우기')],
        false
      );
      
      const isClassNameExpression = classNameAttr && t.isJSXAttribute(classNameAttr);
      if (!isClassNameExpression) {
        path.replaceWith(skeletonElement);
      }
    },
    
    JSXText(path) {
      if (path.node.value.trim() !== '') { 
        const parentPath = path.findParent(p => t.isJSXElement(p));
        const openingElement = parentPath.node.openingElement;
        if (!openingElement) return;

        const existingClassName = getClassNameValue(openingElement.attributes);
     
        const filteredClasses = existingClassName.split(' ').filter(className => 
          className && !['hover', 'transition', 'ease', 'bg', 'rounded', 'animate'].some(
            removeClass => className.startsWith(removeClass)
          )
        );
         
        const combinedClassName = ['animate-pulse', 'bg-gray-200', 'rounded', ...filteredClasses].join(' ').trim();
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
    },

    ReturnStatement(path) {
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
              
              const filteredClasses = staticParts.split(' ').filter(className => 
                className && !['hover', 'transition', 'ease', 'animate'].some(
                  removeClass => className.startsWith(removeClass)
                )
              );
              
              const newClassName = filteredClasses.join(' ');
              classNameAttr.value = t.stringLiteral(newClassName);
            }
          }
        }
      }
    },
    
    CallExpression(path) {
      const callee = path.node.callee;

      if (t.isIdentifier(callee) && 
          (callee.name.startsWith('use') || removeVariables.includes(callee.name))) {
        path.remove();
        return;
      }

      if (t.isArrowFunctionExpression(path.node) || 
          t.isFunctionExpression(path.node)) {
        path.remove();
      }
    }
  });

  const skeletonComponentName = `Skeleton${path.basename(sourcePath, '.tsx')}`;
  const exportDeclaration = t.exportDefaultDeclaration(t.identifier(skeletonComponentName));
  ast.program.body.push(exportDeclaration);

  const { code } = generate.default(ast, {}, sourceCode);
  fs.writeFileSync(targetPath, code, 'utf-8');
  console.log(`스켈레톤 컴포넌트 생성 완료: ${targetPath}`);
}

const getClassNameValue = (attributes) => {
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
        .join('')
        .trim();
    }
    
    if (t.isStringLiteral(expression)) {
      return expression.value;
    }
  }
  
  return '';
};

generateSkeleton({
  sourcePath,
  targetPath,
})