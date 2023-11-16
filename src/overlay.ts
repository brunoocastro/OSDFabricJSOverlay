import { Viewer } from "openseadragon";
import { FabricOverlay } from "./OSDFabricOverlay";

export interface FabricOverlayOptions {
  /**
   * Fabric 'virtual' canvas size, for creating objects
   * @default 1000
   */
  scale: number;
  staticCanvas: boolean;
  fabricCanvasOptions: fabric.ICanvasOptions | fabric.IStaticCanvasOptions;
}

export type FabricOverlayType = FabricOverlay;

export function fabricOverlay(
  OSDViewer: Viewer,
  options: FabricOverlayOptions
) {
  if (!OSDViewer.fabricOverlay) {
    OSDViewer.fabricOverlay = new FabricOverlay(OSDViewer, options);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line prettier/prettier
window.fabricOverlay = { fabricOverlay };
