/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"MM/mat_consumption/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});