import './install';
import { FabricOverlayType } from './overlay';

declare module 'openseadragon' {
	interface Viewer {
    /**
		 * start a fabric overlay instance
		 */
		fabricOverlay: FabricOverlayType;
	}
}