import fs from "fs";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

const DEFAULT_TRANSFORM_TAGS = ["Link", "a", "button", "img"];
const DEFAULT_SKELETON_STYLE = ["animate-pulse", "bg-gray-200", "rounded"]; // 루트에는 포함 안되도록 설정
const DEFAULT_EXCLUDE_CLASSES = ["hover", "transition", "ease", "animate"]; // 모든 곳에서 제거해야할 항목
const DEFAULT_NOT_IN_ROOT = ["bg", "rounded", "border"]; // 루트에서 제거하면 안되는 항목

export class SkeletonTransformer {
  processedNodes;
  jsxElement = null;
  componentName = "";

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

    const sourceCode = fs.readFileSync(this.sourcePath, "utf-8");
    const ast = parser.parse(sourceCode, parserOptions);
    this.extractJSXAndComponentName(ast);

    if (!this.jsxElement) {
      console.error("[오류] 컴포넌트에서 JSX 요소를 찾을 수 없습니다.");
      process.exit(1);
    }

    const skeletonComponentCode = this.generateSkeletonComponentCode();
    const skeletonAst = parser.parse(skeletonComponentCode, parserOptions);
    this.transformToSkeleton(skeletonAst);

    const { code } = generate.default(skeletonAst, {}, sourceCode);
    fs.writeFileSync(this.targetPath, code, "utf-8");
  }

  extractJSXAndComponentName(ast) {
    let jsxCode = "";
    
    traverse.default(ast, {
      ReturnStatement: (path) => {
        if (this.jsxElement) return;
        
        if (t.isJSXElement(path.node.argument) || 
            t.isJSXFragment(path.node.argument)) {
          const { code } = generate.default(path.node.argument);
          jsxCode = code;
          this.jsxElement = code;
          
          const funcDecl = path.findParent(p => // 컴포넌트 이름 추출
            t.isFunctionDeclaration(p.node) || 
            t.isVariableDeclaration(p.node)
          );
          
          if (funcDecl) {
            if (t.isFunctionDeclaration(funcDecl.node)) {
              this.componentName = funcDecl.node.id.name;
            } else if (t.isVariableDeclaration(funcDecl.node) && 
                      funcDecl.node.declarations.length > 0) {
              const decl = funcDecl.node.declarations[0];
              if (t.isIdentifier(decl.id)) {
                this.componentName = decl.id.name;
              }
            }
          }
          
          if (!this.componentName) { // 컴포넌트 이름이 없으면 파일 명으로 찾기
            const basename = path.basename(this.sourcePath, ".tsx") || 
                            path.basename(this.sourcePath, ".jsx") || 
                            "Component";
            this.componentName = basename;
          }
          
          this.componentName = `Skeleton${this.componentName}`;
        }
      }
    });
  }
  
  generateSkeletonComponentCode() {
    return `const ${this.componentName} = () => {
  return (
    ${this.jsxElement}
  );
};

export default ${this.componentName};`;
  }

  transformToSkeleton(ast) {
    traverse.default(ast, {
      JSXElement: (path) => {
        if (this.processedNodes.get(path.node)) return;
        this.processedNodes.set(path.node, true);
        
        const hasExpressions = path.node.children.some(
          child => t.isJSXExpressionContainer(child)
        );
        
        const hasText = path.node.children.some(
          child => t.isJSXText(child) && child.value.trim() !== ""
        );

        if (hasExpressions || hasText) {
          const existingClassName = this.getClassNameValue(path.node.openingElement.attributes);
          const filteredClasses = this.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
          const combinedClassName = this.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);
          
          path.node.children = [t.jsxText("채우기")]; // 데이터, 텍스트 부분 채우기로 대체
          this.updateClassNameAttribute(path.node.openingElement, combinedClassName);
          return;
        }

        if (t.isJSXOpeningElement(path.node.openingElement)) { // 특정 태그 변환
          const tagName = this.getTagName(path.node.openingElement);
          
          if (DEFAULT_TRANSFORM_TAGS.includes(tagName)) {
            this.replaceTagWithDiv(path.node);
          }

          path.node.openingElement.attributes = path.node.openingElement.attributes.filter( // 필요한 속성만 유지
            attr => t.isJSXAttribute(attr) && (attr.name.name === "className" || attr.name.name === "class")
          );
        }
      },
      
      JSXExpressionContainer: (path) => {
        if (this.processedNodes.get(path.node)) return;
        this.processedNodes.set(path.node, true);
        
        const parentElement = path.findParent((p) => t.isJSXElement(p));
        if (!parentElement || !parentElement.node.openingElement) return;

        const existingClassName = this.getClassNameValue(parentElement.node.openingElement.attributes);
        const filteredClasses = this.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
        const combinedClassName = this.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);

        this.updateClassNameAttribute(parentElement.node.openingElement, combinedClassName);
        path.replaceWith(t.jsxText("채우기"));
      },
      
      JSXText: (path) => {
        if (this.processedNodes.get(path.node)) return;
        
        if (path.node.value.trim() !== "") { 
          this.processedNodes.set(path.node, true); 

          const parentPath = path.findParent(p => t.isJSXElement(p));
          if (!parentPath || !parentPath.node.openingElement) return;
          
          const openingElement = parentPath.node.openingElement;
          const existingClassName = this.getClassNameValue(openingElement.attributes);
          const filteredClasses = this.filterClassNames(existingClassName, DEFAULT_EXCLUDE_CLASSES, false, DEFAULT_NOT_IN_ROOT);
          const combinedClassName = this.combineClassNames(filteredClasses, DEFAULT_SKELETON_STYLE, false);

          this.updateClassNameAttribute(openingElement, combinedClassName);
          path.node.value = "채우기";
        }
      }
    });
  }

  getTagName(openingElement) {
    if (t.isJSXIdentifier(openingElement.name)) {
      return openingElement.name.name;
    }
    return "";
  }
  
  replaceTagWithDiv(element) {
    if (element.openingElement) {
      element.openingElement.name = t.jsxIdentifier("div");
    }
    if (element.closingElement) {
      element.closingElement.name = t.jsxIdentifier("div");
    }
  }
  
  updateClassNameAttribute(openingElement, className) {
    const classNameAttr = openingElement.attributes.find(
      attr => t.isJSXAttribute(attr) && attr.name.name === "className"
    );
    
    if (classNameAttr) {
      classNameAttr.value = t.stringLiteral(className);
    } else {
      openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("className"),
          t.stringLiteral(className)
        )
      );
    }
  }
  
  getClassNameValue(attributes) {
    const classNameAttr = attributes.find(attr => 
      t.isJSXAttribute(attr) && attr.name.name === "className"
    );
    
    if (!classNameAttr) return "";
    if (t.isStringLiteral(classNameAttr.value)) return classNameAttr.value.value;
    
    if (t.isJSXExpressionContainer(classNameAttr.value)) {
      const expression = classNameAttr.value.expression;
      
      if (t.isTemplateLiteral(expression)) {
        return expression.quasis
          .map(quasi => quasi.value.raw)
          .join(" ")
          .trim();
      }
      
      if (t.isStringLiteral(expression)) return expression.value;
    }
    return "";
  }

  filterClassNames(classNames, excludeClasses, isRootElement = false, keepClasses = []) {
    if (!classNames || classNames.trim() === "") {
      return [];
    }
    
    return classNames.split(" ").filter(className => {
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
  }

  combineClassNames(filteredClasses, skeletonStyle, isRootElement = false) {
    if (isRootElement) {
      return filteredClasses.join(" ").trim();
    } else {
      return [...skeletonStyle, ...filteredClasses].join(" ").trim();
    }
  }

  createSkeletonElement(className) {
    return t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier("div"), 
        [
          t.jsxAttribute(
            t.jsxIdentifier("className"), 
            t.stringLiteral(className)
          )
        ],
        false
      ),
      t.jsxClosingElement(t.jsxIdentifier("div")),
      [t.jsxText("채우기")],
      false
    );
  }
}