import { ModalManagerRef } from "./components";
import type { ModalConfig } from "./types";

function open(config: ModalConfig) {
   ModalManagerRef.current?.open(config);
}

function hide() {
   ModalManagerRef.current?.hide();
}

export const modalManager = {
   open,
   hide,
};
