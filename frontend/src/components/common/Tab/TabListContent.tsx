import { ListContentProps } from "./type";

const TabListContent = ({
  children,
  className
}: ListContentProps) => {
  return (
    <div role="tab" className={className}>
      {children}
    </div>
  )
}

export default TabListContent;