import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { FC } from "react";

interface PropsType {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string | React.ReactElement;
  description?: string;
  className?: string;
  footer?: React.ReactNode;
}

const AppDrawer: FC<PropsType> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className} aria-label="App Drawer content">
        <DrawerHeader>
          <DrawerTitle className="text-base/5 text-left">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        {footer && <DrawerFooter className="pt-2">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
};

export default AppDrawer;
