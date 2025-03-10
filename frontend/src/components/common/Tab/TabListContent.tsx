import { ListContentProps } from "./type";

const TabListContent = ({
  children,
  className
}: ListContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default TabListContent;