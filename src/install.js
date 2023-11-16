/* eslint-disable @typescript-eslint/no-var-requires */
(function () {
	var osd = window.OpenSeadragon;
  var fabric = window.fabric
	var plugin = window.OSDFabricJSOverlay;
	if (!osd) {
		osd = require('openseadragon');
		if (!osd) {
			throw new Error('OpenSeadragon is missing.');
		}
	}
	if (!fabric) {
		fabric = require('fabric');
		if (!fabric) {
			throw new Error('Fabric JS is missing.');
		}
	}
	if (!plugin) {
		plugin = require('./overlay');
		if (!plugin) {
			throw new Error(
				'OSDFabricJSOverlay in missing',
			);
		}
	}
	osd.Viewer.prototype.fabricOverlay =
		plugin.fabricOverlay;
})();