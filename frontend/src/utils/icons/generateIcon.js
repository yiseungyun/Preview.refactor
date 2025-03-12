import fs from "fs";
import path from "path";
import { iconList } from "./iconList.js";

const currentDir = process.cwd(); 
const outputDir = path.resolve(currentDir, "src/components/common/Icons");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

iconList.forEach(({ name, component }) => {
  const rendered = component({});
   
  const { attr } = rendered.props;
  const viewBox = attr?.viewBox || "0 0 24 24";

  const extractSvgContent = (children) => {
    if (!children) return "";
    
    // 배열인 경우
    if (Array.isArray(children)) {
      return children
        .map(child => {
          if (!child) return "";
          
          // SVG 요소 타입 확인 (path, circle, rect 등)
          const elementType = child.type;
          if (!elementType || !child.props) return "";
          
          // 일반적인 SVG 요소인 경우
          if (typeof elementType === "string") {
            const props = { ...child.props };
            
            // 색상 관련 속성 처리:
            // 1. fill 속성이 있고, 'none'이 아닌 경우 currentColor로 변경
            // 2. stroke 속성이 있는 경우 currentColor로 변경
            // 3. 이렇게 하면 원래 stroke를 사용하는 요소는 stroke가 유지되고,
            //    원래 fill을 사용하는 요소는 fill이 유지됩니다.
            if (props.fill && props.fill !== 'none') {
              props.fill = 'currentColor';
            }
            if ((props['stroke-width'] || props.strokeWidth) && !props.stroke) {
              props.stroke = 'currentColor';
            }

            // 모든 props를 속성으로 변환
            const attrs = Object.entries(props)
              .filter(([key, value]) => key !== 'children' && value !== undefined)
              .map(([key, value]) => `${key}="${value}"`)
              .join(" ");
            
            // 자식 요소가 있는 경우 재귀적으로 처리
            if (child.props.children) {
              const innerContent = extractSvgContent(child.props.children);
              return `<${elementType} ${attrs}>${innerContent}</${elementType}>`;
            }
            
            // 자식 요소가 없는 경우 (self-closing tag)
            return `<${elementType} ${attrs} />`;
          }
          
          // 중첩된 요소인 경우 (React 컴포넌트 등)
          if (child.props.children) {
            return extractSvgContent(child.props.children);
          }
          
          return "";
        })
        .filter(content => content.trim() !== "")
        .join("\n      ");
    }
    
    // 객체인 경우 (단일 요소)
    if (children && typeof children === 'object') {
      const elementType = children.type;
      if (!elementType || !children.props) return "";
      
      // SVG 요소인 경우
      if (typeof elementType === 'string') {
        const props = { ...children.props };
        
        // 색상 관련 속성 처리:
        // 1. fill 속성이 있고, 'none'이 아닌 경우 currentColor로 변경
        // 2. stroke 속성이 있는 경우 currentColor로 변경
        if (props.fill && props.fill !== 'none') {
          props.fill = 'currentColor';
        }
        if ((props['stroke-width'] || props.strokeWidth) && !props.stroke) {
          props.stroke = 'currentColor';
        }

        const attrs = Object.entries(props)
          .filter(([key, value]) => key !== 'children' && value !== undefined)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");
        
        // 자식 요소가 있는 경우
        if (children.props.children) {
          const innerContent = extractSvgContent(children.props.children);
          return `<${elementType} ${attrs}>${innerContent}</${elementType}>`;
        }
        
        // 자식 요소가 없는 경우
        return `<${elementType} ${attrs} />`;
      }
      
      // 중첩된 컴포넌트인 경우
      if (children.props.children) {
        return extractSvgContent(children.props.children);
      }
    }
    
    return "";
  };
  
  let svgContent = extractSvgContent(rendered.props.children);

  const componentString = `import React from "react";
import { convertToRem } from "./convertToRem.ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const ${name} = ({ size = 4, className = "", ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={convertToRem(size)}
      height={convertToRem(size)}
      viewBox="${viewBox}"
      className={className}
      fill="currentColor"
      {...props}
    >
${svgContent}
    </svg>
  );
};
`;

  fs.writeFileSync(path.join(outputDir, `${name}.tsx`), componentString);
  console.log(`🎉 아이콘 컴포넌트 생성 🎉: ${name}.tsx`);
});