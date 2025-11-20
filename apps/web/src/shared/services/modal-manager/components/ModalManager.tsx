"use client"
import { createRef, useImperativeHandle, useState } from "react";
import type { ModalConfig, ModalManagerProps } from "../types";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

export const ModalManagerRef = createRef<ModalManagerProps>();
export function ModalManager() {
   const [visible, setVisible] = useState(false);
   const [config, setConfig] = useState<ModalConfig>({
      content: <></>,
      title: "",
      action: [],
   });
   const onOpenChange = (isOpen: boolean) => setVisible(isOpen);
   const hide = () => setVisible(false);
   const open = (config: ModalConfig) => {
      setConfig(config);
      setVisible(true);
   };

   useImperativeHandle(ModalManagerRef, () => ({
      open,
      hide,
   }));
   return (
      <Dialog open={visible} onOpenChange={onOpenChange}>
         <DialogContent>
            {config.title && <DialogTitle>{config.title}</DialogTitle>}
            {config.content}
            {config.action && config.action?.length > 0 && (
               <DialogFooter>
                  {config.action?.map((action, index) => (
                     <Button key={action.id} onClick={action.onClick}>
                        {action.label}
                     </Button>
                  ))}
               </DialogFooter>
            )}
         </DialogContent>
      </Dialog>
   );
}
