sap.ui.define([
	"sap/m/MessageToast", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType", "sap/ui/model/Sorter", "sap/ui/core/util/Export", "sap/ui/core/util/ExportTypeCSV", "sap/m/MessageBox",
	"sap/ui/core/util/MockServer", "sap/ui/export/Spreadsheet", "sap/ui/model/odata/v2/ODataModel", "sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export", "sap/ui/core/util/ExportTypeCSV"
], function (e, t, a, o, n, s, r, i, l, d, Spreadsheet, _, c, p, m) {
	"use strict";
	var S = {
		BotList: []
	};
	var aQQH = {
		items: []
	};
	return t.extend("MM.mat_consumption.controller.Home", {
		onInit: function () {
			var that = this;
		},
		_getMatStock: function (t, resolve, reject) {

			var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();

			var oModelMATSTOCK = this.getOwnerComponent().getModel("MATSTOCK");
			var aMatStock = {
				MatStock: []
			};
			var r = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);
			var i = new sap.ui.model.Filter({
				filters: [r],
				and: true
			});
			var l = new Array(new sap.ui.model.Filter({
				filters: [i],
				and: true
			}));

			oModelMATSTOCK.read("/YY1_MatStock", {
				urlParameters: {
					$select: "Material, Plant, CreationDate, CrossPlantStatusValidityDate, MatlCnsmpnQtyInMatlBaseUnit, MaterialBaseUnit, ProductDescription, CrossPlantStatus, On_Hand_Qty"
				},
				filters: [l],
				success: function (data, err) {
					var o = data.results;
					o.sort();

					var s = o.length;
					if (s !== 0) {
						sap.m.MessageToast.show("Getting Material stock!!! ");
						for (var r = 0; r < s; r++) {

							if (o[r].Material !== "" && o[r].Plant !== "") {
								if (o[r].CrossPlantStatusValidityDate === null) {
									o[r].CrossPlantStatusValidityDate = o[r].CreationDate;
								}

								aMatStock.MatStock.push({
									Material: o[r].Material,
									Plant: o[r].Plant,
									CreationDate: o[r].CrossPlantStatusValidityDate,
									MaterialBaseUnit: o[r].MaterialBaseUnit,
									MatlCnsmpnQtyInMatlBaseUnit: o[r].MatlCnsmpnQtyInMatlBaseUnit,
									On_Hand_Qty: o[r].On_Hand_Qty,
									SLoc_S099_Qty: o[r].on_hnd_s099,
									ProductDescription: o[r].ProductDescription,
									CrossPlantStatus: o[r].CrossPlantStatus
								});
							}
						}

					}
					resolve(aMatStock.MatStock);
				},
				error: function () {
					reject();
				}
			});
		},
		_getStd_Price: function (t, resolve, reject) {

			var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();
			var oModelSTDPRICE = this.getOwnerComponent().getModel("STDPRICE");
			var aStdPrice = {
				StdPrice: []
			};
			var r = new sap.ui.model.Filter("ValuationArea", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);
			var i = new sap.ui.model.Filter({
				filters: [r],
				and: true
			});
			var l = new Array(new sap.ui.model.Filter({
				filters: [i],
				and: true
			}));
			oModelSTDPRICE.read("/YY1_Prod_Std_Price", {
				urlParameters: {
					$select: "Product, ValuationArea, Std_Price"
				},
				filters: [l],
				success: function (data, err) {
					var o = data.results;
					o.sort();
					var s = o.length;
					if (s !== 0) {
						sap.m.MessageToast.show("Getting standard price!!! ");
						for (var r = 0; r < s; r++) {
							if (o[r].Material !== "" && o[r].ValuationArea !== "") {
								aStdPrice.StdPrice.push({
									Material: o[r].Product,
									Std_Price: o[r].Std_Price,
									ValuationArea: o[r].ValuationArea
								});
							}
						}
					}
					resolve(aStdPrice.StdPrice);
				},
				error: function () {
					reject();
				}
			});
		},
		_getGoods_Mvnt: function (t, resolve, reject) {

			var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();
			var oModelGOODSMVNT = this.getOwnerComponent().getModel("GOODSMVNT");
			var oGOODS_MVMT = {
				GOODS_MVMT: []
			};

			var r = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);
			var i = new sap.ui.model.Filter({
				filters: [r],
				and: true
			});
			var idDatePickerVal = this.getView().byId("idDatePicker").getValue().toUpperCase();
			var yyyy = idDatePickerVal.slice(6, 10);
			var mm = idDatePickerVal.slice(0, 2);
			var dd = idDatePickerVal.slice(3, 5);
			var idDatePickerVal = yyyy + "-" + mm + "-" + dd;

			var todate = new Date(idDatePickerVal);
			var yyyy = yyyy - 2;
			var fromdate = yyyy + "-" + mm + "-" + dd;
			var fromdate = new Date(fromdate);

			var M = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.LE, todate.toISOString());
			var O = new sap.ui.model.Filter({
				filters: [M],
				and: true
			});
			var S = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.GE, fromdate.toISOString());
			var v = new sap.ui.model.Filter({
				filters: [S],
				and: true
			});
			var f = new Array(new sap.ui.model.Filter({
				filters: [i, O, v],
				and: true
			}));

			oModelGOODSMVNT.read("/YY1_GOODS_MVMT", {
				urlParameters: {
					$select: "Material, Plant, MaterialBaseUnit, DocumentDate, TotalGdsMvtQtyInBaseUnit, CreationDate, GoodsMovementType"
				},
				filters: [f],
				success: function (data, err) {

					var o = data.results;
					o.sort();
					var s = o.length;
					if (s !== 0) {
						sap.m.MessageToast.show("Getting goods movement data!!! ");
						for (var r = 0; r < s; r++) {
							if (o[r].Material !== "" && o[r].Plant !== "" && (o[r].GoodsMovementType === "201" || o[r].GoodsMovementType === "202" || o[
									r].GoodsMovementType === "602" || o[r].GoodsMovementType === "601")) {
								oGOODS_MVMT.GOODS_MVMT.push({
									Material: o[r].Material,
									Plant: o[r].Plant,
									MaterialBaseUnit: o[r].MaterialBaseUnit,
									DocumentDate: o[r].PostingDate,
									TotalGdsMvtQtyInBaseUnit: o[r].TotalGdsMvtQtyInBaseUnit,
									CreationDate: o[r].CreationDate,
									GoodsMovementType: o[r].GoodsMovementType
								});
							}
						}
					}
					resolve(oGOODS_MVMT.GOODS_MVMT);
				},
				error: function () {
					reject();
				}
			});
		},
		_getGoods_MvntQty: function (t, resolve, reject) {

			var oModelMvntQty = this.getOwnerComponent().getModel("GOODSMVNT");
			var aGoods_MvntQty = {
				Goods_MvntQty: []
			};
			var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();
			var r = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);

			var i = new sap.ui.model.Filter({
				filters: [r],
				and: true
			});
			var idDatePickerVal = this.getView().byId("idDatePicker").getValue().toUpperCase();
			var yyyy = idDatePickerVal.slice(6, 10);
			var mm = idDatePickerVal.slice(0, 2);
			var dd = idDatePickerVal.slice(3, 5);
			var idDatePickerVal = yyyy + "-" + mm + "-" + dd;

			var toDate = new Date(idDatePickerVal);
			var yyyy = yyyy - 2;
			var fromDate = yyyy + "-" + mm + "-" + dd;
			var fromDate = new Date(fromDate);

			var M = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.LE, toDate.toISOString());
			var O = new sap.ui.model.Filter({
				filters: [M],
				and: true
			});
			var S = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.GE, fromDate.toISOString());
			var v = new sap.ui.model.Filter({
				filters: [S],
				and: true
			});
			var f = new Array(new sap.ui.model.Filter({
				filters: [i, O, v],
				and: true
			}));

			oModelMvntQty.read("/YY1_GOODS_MVMT", {
				urlParameters: {
					$select: "Material, Plant, TotalGdsMvtQtyInBaseUnit, CreationDate, GoodsMovementType"
				},
				filters: [f],
				success: function (data, err) {

					var o = data.results;
					o.sort();
					var s = o.length;
					if (s !== 0) {
						sap.m.MessageToast.show("Getting goods movement data!!! ");
						for (var r = 0; r < s; r++) {
							if (o[r].Material !== "" && o[r].Plant !== "" && (o[r].GoodsMovementType === "201" || o[r].GoodsMovementType === "202" || o[
									r].GoodsMovementType === "602" || o[r].GoodsMovementType === "601")) {
								aGoods_MvntQty.Goods_MvntQty.push({
									Material: o[r].Material,
									Plant: o[r].Plant,
									TotalGdsMvtQtyInBaseUnit: o[r].TotalGdsMvtQtyInBaseUnit,
									CreationDate: o[r].CreationDate,
									GoodsMovementType: o[r].GoodsMovementType
								});
							}
						}
					}
					resolve(aGoods_MvntQty.Goods_MvntQty);
				},
				error: function () {
					reject();
				}
			});
		},
		_getSL099_QUANTITY: function (t, resolve, reject) {

			var oModelMATSTOCK = this.getOwnerComponent().getModel("MATSTOCK");
			var aSL099_QUANTITY = {
				SL099_QUANTITY: []
			};

			var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();
			var r = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);
			var i = new sap.ui.model.Filter({
				filters: [r],
				and: true
			});
			var sl = "S099";
			var d = new sap.ui.model.Filter("StorageLocation", sap.ui.model.FilterOperator.EQ, sl);
			var u = new sap.ui.model.Filter({
				filters: [d],
				and: true
			});
			var l = new Array(new sap.ui.model.Filter({
				filters: [i, u],
				and: true
			}));
			oModelMATSTOCK.read("/YY1_MatStock", {
				urlParameters: {
					$select: "Material, Plant, StorageLocation, On_Hand_Qty"
				},
				filters: [l],
				success: function (data, err) {
					var o = data.results;
					o.sort();
					var s = o.length;
					if (s !== 0) {
						sap.m.MessageToast.show("Getting goods movement data!!! ");
						for (var r = 0; r < s; r++) {
							if (o[r].Material !== "" && o[r].Plant !== "") {
								aSL099_QUANTITY.SL099_QUANTITY.push({
									Material: o[r].Material,
									Plant: o[r].Plant,
									On_Hand_Qty: o[r].On_Hand_Qty
								});
							}
						}
					}
					resolve(aSL099_QUANTITY.SL099_QUANTITY);
				},
				error: function () {
					reject();
				}
			});
		},
		_getQOH: function (t, resolve, reject) {

			if (this !== undefined) {
				var idFieldPlantVal = this.getView().byId("idFieldPlant").getValue().toUpperCase();
				var r = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, idFieldPlantVal);
				var i = new sap.ui.model.Filter({
					filters: [r],
					and: true
				});
				var idDatePickerVal = this.getView().byId("idDatePicker").getValue().toUpperCase();
				var yyyy = idDatePickerVal.slice(6, 10);
				var mm = idDatePickerVal.slice(0, 2);
				var dd = idDatePickerVal.slice(3, 5);
				var idDatePickerVal = yyyy + "-" + mm + "-" + dd;

				var toDate = new Date(idDatePickerVal);
				var yyyy = yyyy - 2;
				var fromDate = yyyy + "-" + mm + "-" + dd;
				var fromDate = new Date(fromDate);

				var M = new sap.ui.model.Filter("MatlDocLatestPostgDate", sap.ui.model.FilterOperator.LE, toDate.toISOString());
				var O = new sap.ui.model.Filter({
					filters: [M],
					and: true
				});
				var f = new Array(new sap.ui.model.Filter({
					filters: [i, O],
					and: true
				}));
				var aQOH = {
					QOH: []
				};
				var oModelMATSTOCKonHnd = this.getOwnerComponent().getModel("STOCKONHND");
				oModelMATSTOCKonHnd.read("/YY1_Material_in_Stock", {
					urlParameters: {
						$select: "Material, Plant, MatlWrhsStkQtyInMatlBaseUnit"
					},
					filters: [f],
					success: function (data, err) {

						var o = data.results;
						o.sort();
						var s = o.length;
						if (s !== 0) {
							sap.m.MessageToast.show("Getting quantity on hand data!!! ");
							for (var r = 0; r < s; r++) {
								if (o[r].Material !== "" && o[r].Plant !== "") {

									aQOH.QOH.push({
										Material: o[r].Material,
										Plant: o[r].Plant,
										On_Hand_Qty: o[r].MatlWrhsStkQtyInMatlBaseUnit
									});
								}
							}
						}
						aQQH.items = aQOH.QOH;
					},
					error: function () {}
				});
			}
		},
		_buildFinalData: function (oConData) {

			var t = 0;
			var a = {};
			var o = [];
			var n = 0;
			var e = oConData;
			for (var s = 0; s < e.StdPrice.length; s++) {
				for (var r = 0; r < e.MatStock.length; r++) {
					if (e.MatStock[r].Material === e.StdPrice[s].Material && e.MatStock[r].Plant === e.StdPrice[s].ValuationArea) {
						for (var i = 0; i < e.SL099_QUANTITY.length; i++) {
							if (e.MatStock[r].Material === e.SL099_QUANTITY[i].Material) {
								a.SLoc_S099_Qty = parseFloat(e.SL099_QUANTITY[i].On_Hand_Qty);
								break;
							}
						}

						for (var it = 0; it < aQQH.items.length; it++) {
							if (e.MatStock[r].Material === aQQH.items[it].Material &&
								e.MatStock[r].Plant === aQQH.items[it].Plant) {
								e.MatStock[r].On_Hand_Qty = aQQH.items[it].On_Hand_Qty;
								break;
							}
						}

						var l = this.getView().byId("idDatePicker").getValue().toUpperCase();
						var idDatePickerVal = this.getView().byId("idDatePicker").getValue().toUpperCase();
						var yyyy = idDatePickerVal.slice(6, 10);
						var mm = idDatePickerVal.slice(0, 2);

						var d = yyyy;
						var u = mm;
						var _ = '0000';
						var c = '00';
						u = parseFloat(u);

						if (e.MatStock[r].CreationDate === null) {

						} else {
							var _ = e.MatStock[r].CreationDate.getFullYear();
						}
						if (e.MatStock[r].CreationDate === null) {

						} else {
							var c = e.MatStock[r].CreationDate.getMonth();
						}

						//(user input date year - creation year) * 12 + (user input date month - creation month)
						t = (d - _) * 12 + (u - c);
						a.Material = e.MatStock[r].Material;
						a.ProductDescription = e.MatStock[r].ProductDescription;
						a.Plant = e.MatStock[r].Plant;
						a.CrossPlantStatus = e.MatStock[r].CrossPlantStatus;
						a.On_Hand_Qty = parseFloat(n) + parseFloat(e.MatStock[r].On_Hand_Qty);
						a.Tot_Std_Cost = parseFloat(e.MatStock[r].On_Hand_Qty) * parseFloat(e.StdPrice[s].Std_Price);
						a.Tot_Std_Cost = parseFloat(a.Tot_Std_Cost).toFixed(2);
						a.Std_Price = parseFloat(e.StdPrice[s].Std_Price).toFixed(2);
						if (a.CreationDate === null ||
							a.CreationDate === undefined
						) {

							a.CreationDate = e.MatStock[r].CreationDate.toISOString().slice(0, 10);

							var yyyy = a.CreationDate.slice(0, 4);
							var mm = a.CreationDate.slice(5, 7);
							var dd = a.CreationDate.slice(8, 10);
							a.CreationDate = mm + '/' + dd + '/' + yyyy;
						}

						a.Consumption = 0;
						a.Consumption201 = 0;
						a.Consumption202 = 0;
						a.GoodsShipped = 0;
						a.GoodsShipped601 = 0;
						a.GoodsShipped602 = 0;
						a.ExcessQOH = "0";
						for (var p = 0; p < e.GOODS_MVMT_CUM.length; p++) {
							if (e.MatStock[r].Material === e.GOODS_MVMT_CUM[p].Material && e.MatStock[r].Plant === e.GOODS_MVMT_CUM[p].Plant) {
								a.GoodsShipped = 0;
								a.GoodsShipped601 = 0;
								a.GoodsShipped602 = 0;
								if ((e.GOODS_MVMT_CUM[p].Plant === "US01" || e.GOODS_MVMT_CUM[p].Plant === "US02" || e.GOODS_MVMT_CUM[p].Plant === "US03") &&
									e.GOODS_MVMT_CUM[p].GoodsMovementType === "601" || e.GOODS_MVMT_CUM[p].GoodsMovementType === "602") {

									for (var x = 0; x < e.GOODS_MVMT_CUM.length; x++) {
										if (e.GOODS_MVMT_CUM[x].Material === e.GOODS_MVMT_CUM[p].Material &&
											e.GOODS_MVMT_CUM[x].Plant === e.GOODS_MVMT_CUM[p].Plant &&
											e.GOODS_MVMT_CUM[x].GoodsMovementType === "601"
										) {

											a.GoodsShipped601 = parseFloat(e.GOODS_MVMT_CUM[x].TotalGdsMvtQtyInBaseUnit);
										}
										if (e.GOODS_MVMT_CUM[x].Material === e.GOODS_MVMT_CUM[p].Material &&
											e.GOODS_MVMT_CUM[x].Plant === e.GOODS_MVMT_CUM[p].Plant &&
											e.GOODS_MVMT_CUM[x].GoodsMovementType === "602"
										) {

											a.GoodsShipped602 = parseFloat(e.GOODS_MVMT_CUM[x].TotalGdsMvtQtyInBaseUnit);
										}
									}
								}
								a.Consumption = 0;
								a.Consumption201 = 0;
								a.Consumption202 = 0;
								if ((e.GOODS_MVMT_CUM[p].Plant === "US01" || e.GOODS_MVMT_CUM[p].Plant === "US02" || e.GOODS_MVMT_CUM[p].Plant === "US03") &&
									e.GOODS_MVMT_CUM[p].GoodsMovementType === "201" || e.GOODS_MVMT_CUM[p].GoodsMovementType === "202") {

									for (var x = 0; x < e.GOODS_MVMT_CUM.length; x++) {
										if (e.GOODS_MVMT_CUM[x].Material === e.GOODS_MVMT_CUM[p].Material &&
											e.GOODS_MVMT_CUM[x].Plant === e.GOODS_MVMT_CUM[p].Plant &&
											e.GOODS_MVMT_CUM[x].GoodsMovementType === "201"
										) {

											a.Consumption201 = parseFloat(e.GOODS_MVMT_CUM[x].TotalGdsMvtQtyInBaseUnit);
										}
										if (e.GOODS_MVMT_CUM[x].Material === e.GOODS_MVMT_CUM[p].Material &&
											e.GOODS_MVMT_CUM[x].Plant === e.GOODS_MVMT_CUM[p].Plant &&
											e.GOODS_MVMT_CUM[x].GoodsMovementType === "202"
										) {

											a.Consumption202 = parseFloat(e.GOODS_MVMT_CUM[x].TotalGdsMvtQtyInBaseUnit);
										}
									}

								}
								if (t <= 24) {
									a.MonthUsage24 = parseFloat(a.Consumption) + parseFloat(a.GoodsShipped);
									a.MonthUsage24 = parseFloat(a.MonthUsage24) / parseFloat(t) * 24;
									a.MonthUsage24 = parseFloat(a.MonthUsage24).toFixed(2);
								} else {
									a.MonthUsage24 = parseFloat(a.Consumption) + parseFloat(a.GoodsShipped);
								}
							}
						}

						if (a.GoodsShipped601 === 'undefined') {
							a.GoodsShipped601 = 0;
						}
						if (a.GoodsShipped602 === 'undefined') {
							a.GoodsShipped602 = 0;
						}
						if (a.Consumption201 === 'undefined') {
							a.Consumption201 = 0;
						}
						if (a.Consumption202 === 'undefined') {
							a.Consumption202 = 0;
						}

						a.Consumption = parseFloat(a.Consumption201) + parseFloat(a.Consumption202);
						a.GoodsShipped = parseFloat(a.GoodsShipped601) + parseFloat(a.GoodsShipped602);

						if (a.CrossPlantStatus === "05") {
							a.ExcessQOH = a.On_Hand_Qty;
						}
						if (a.CrossPlantStatus === "03") {
							var m = parseFloat(a.MonthUsage24) - parseFloat(a.On_Hand_Qty);
							if (m > 0) {
								a.ExcessQOH = m;
							} else {
								a.ExcessQOH = "0";
							}
						}

						var l = this.getView().byId("idDatePicker").getValue().toUpperCase();
						var yyyy = l.slice(6, 10);
						var mm = l.slice(0, 2);

						var d = yyyy;
						var u = mm;
						u = parseFloat(u);

						var _ = e.MatStock[r].CreationDate.getFullYear();
						var c = e.MatStock[r].CreationDate.getMonth();
						t = (d - _) * 12 + (u - c);

						if (t <= 24) {
							a.Months_Usage_Life_in_months = t;
						} else {
							a.Months_Usage_Life_in_months = "0";
						}

						if (a.CrossPlantStatus === "05" || a.MonthUsage24 === "0") {
							a.NEW_OBS_EXC_or_GOOD = "OBS";
						}
						if (a.ExcessQOH === "0") {
							a.NEW_OBS_EXC_or_GOOD = "GOOD";
						}
						if ((a.CrossPlantStatus === "02" || a.CrossPlantStatus === "03" || a.CrossPlantStatus === "04") && a.ExcessQOH > "0") {
							a.NEW_OBS_EXC_or_GOOD = "EXC";
						}
						if (t < "12") {
							a.NEW_OBS_EXC_or_GOOD = "NEW";
						}

						if (a.NEW_OBS_EXC_or_GOOD === "EXC") {
							a.Excess_OH_FIFO = a.ExcessQOH * a.Std_Price;
						} else {
							a.Excess_OH_FIFO = "0";
						}
						if (a.NEW_OBS_EXC_or_GOOD === "OBS") {
							a.Obsolete_OH_FIFO = a.ExcessQOH * a.Std_Price;
						} else {
							a.Obsolete_OH_FIFO = "0";
						}

						a.E_O_OH_FIFO = a.Excess_OH_FIFO + a.Obsolete_OH_FIFO;
						if (a.E_O_OH_FIFO === "undefined" || a.E_O_OH_FIFO === "") {
							a.E_O_OH_FIFO = "0";
						}
						if (a.Tot_Std_Cost === "undefined" || a.Tot_Std_Cost === "") {
							a.Tot_Std_Cost = "0";
						}
						if (a.Std_Price === "undefined" || a.Std_Price === "") {
							a.Std_Price = "0";
						}
						if (a.GoodsShipped === "undefined" || a.GoodsShipped === "") {
							a.GoodsShipped = "0";
						}
						if (a.Consumption === "undefined" || a.Consumption === "") {
							a.Consumption = "0";
						}
						if (a.MonthUsage24 === "undefined" || a.MonthUsage24 === "") {
							a.MonthUsage24 = "0";
						}
						if (a.Months_Usage_Life_in_months === "undefined" || a.Months_Usage_Life_in_months === "") {
							a.Months_Usage_Life_in_months = "0";
						}
						if (a.ExcessQOH === "undefined" || a.ExcessQOH === "") {
							a.ExcessQOH = "0";
						}
						if (a.NEW_OBS_EXC_or_GOOD === "undefined" || a.NEW_OBS_EXC_or_GOOD === "") {
							a.NEW_OBS_EXC_or_GOOD = "0";
						}
						if (a.Excess_OH_FIFO === "undefined" || a.Excess_OH_FIFO === "") {
							a.Excess_OH_FIFO = "0";
						}
						if (a.Obsolete_OH_FIFO === "undefined" || a.Obsolete_OH_FIFO === "") {
							a.Obsolete_OH_FIFO = "0";
						}
						o.push(a);
						a = {};
					}
				}
			}
			S.BotList = o;
			var M = [];
			var O = {};
			O.columnName = "Material";
			M.push(O);
			O = {};
			O.columnName = "ProductDescription";
			M.push(O);
			O = {};
			O.columnName = "Plant";
			M.push(O);
			O = {};
			O.columnName = "CrossPlantStatus";
			M.push(O);
			O = {};
			O.columnName = "On_Hand_Qty";
			M.push(O);
			O = {};
			O.columnName = "Tot_Std_Cost";
			M.push(O);
			O = {};
			O.columnName = "Std_Price";
			M.push(O);
			O = {};
			O.columnName = "GoodsShipped";
			M.push(O);
			O = {};
			O.columnName = "Consumption";
			M.push(O);
			O = {};
			O.columnName = "SLoc_S099_Qty";
			M.push(O);
			O = {};
			O.columnName = "MonthUsage24";
			M.push(O);
			O = {};
			O.columnName = "ExcessQOH";
			M.push(O);
			O = {};
			O.columnName = "NEW_OBS_EXC_or_GOOD";
			M.push(O);
			O = {};
			O.columnName = "Excess_OH_FIFO";
			M.push(O);
			O = {};
			O.columnName = "Obsolete_OH_FIFO";
			M.push(O);
			O = {};
			O.columnName = "E_O_OH_FIFO";
			M.push(O);
			O = {};
			O.columnName = "Months_Usage_Life_in_months";
			M.push(O);
			O = {};
			O.columnName = "CreationDate";
			M.push(O);
			O = {};
			var v = sap.ui.getCore().byId("container-mat_consumption---Home--idTable");
			var f = new sap.ui.model.json.JSONModel();
			f.setData({
				rows: o,
				columns: M,
				width: "11rem"
			});
			v.setModel(f);
			v.bindColumns("/columns", function (e, t) {
				var a = t.getObject().columnName;
				return new sap.ui.table.Column({
					label: a,
					template: a
				});
			});
			v.bindRows("/rows");
		},
		onSearch: function () {

			var that = this;
			var t = this.getView().byId("idFieldPlant").getValue().toUpperCase();
			var DatePicker = this.getView().byId("idDatePicker").getValue().toUpperCase();
			if (t === '') {
				sap.m.MessageToast.show("Please provide Plant value!!! ");
			}
			if (DatePicker === '') {
				sap.m.MessageToast.show("Please provide End Date value!!! ");
			}

			if (t !== '' && DatePicker !== '') {

				sap.ui.core.BusyIndicator.show();

				var a = {
					items: [],
					Material: [],
					MatStock: [],
					StdPrice: [],
					GOODS_MVMT: [],
					GOODS_MVMT_CUM: [],
					Goods_MvntQty: [],
					SL099_QUANTITY: [],
					QOH: []
				};

				var t = this.getView().byId("idFieldPlant").getValue().toUpperCase();
				var DatePicker = this.getView().byId("idDatePicker").getValue().toUpperCase();
				var idDatePickerVal = this.getView().byId("idDatePicker").getValue().toUpperCase();
				var yyyy = idDatePickerVal.slice(6, 10);
				var mm = idDatePickerVal.slice(0, 2);
				var dd = idDatePickerVal.slice(3, 5);
				var DatePicker = yyyy + "-" + mm + "-" + dd;

				var promiseStd_Price;
				var promiseSL099_QUANTITY;
				var promiseGoods_Mvnt;
				var promiseSL099_QUANTITY;
				var promiseGoods_MvntQty;

				var promiseMatStock = new Promise(function (resolve, reject) {
					that._getMatStock(t, resolve, reject);
				});
				promiseMatStock.then(function (mStock) {
					a.MatStock = mStock;

					promiseStd_Price = new Promise(function (resolve, reject) {
						that._getStd_Price(t, resolve, reject);
						that._getQOH(t, resolve, reject);
					});
					promiseStd_Price.then(function (stdPrice) {

						a.StdPrice = stdPrice;
						promiseSL099_QUANTITY = new Promise(function (resolve, reject) {
							that._getSL099_QUANTITY(t, resolve, reject);

						});
						promiseSL099_QUANTITY.then(function (SL099_QUANTITY) {
							promiseGoods_Mvnt = new Promise(function (resolve, reject) {
								a.SL099_QUANTITY = SL099_QUANTITY;
								that._getGoods_Mvnt(t, resolve, reject);
							});

							promiseGoods_Mvnt.then(function (GOODS_MVMT) {
								promiseGoods_MvntQty = new Promise(function (resolve, reject) {
									a.GOODS_MVMT = GOODS_MVMT;
									that._getGoods_MvntQty(t, resolve, reject);
								});
								promiseGoods_MvntQty.then(function (GOODS_MVMT_CUM) {
									a.GOODS_MVMT_CUM = GOODS_MVMT_CUM;
									that._buildFinalData(a);

									sap.ui.core.BusyIndicator.hide();
								}, function () {});
							}, function () {});
						}, function () {}, function () {});
					}, function () {});
				}, function () {});
			}
		},
		onDataExport: function (oConData) {
			var dateModel = new sap.ui.model.json.JSONModel();
			dateModel.setData(S.BotList);
			var a = new p({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: ",",
					charset: "utf-8"
				}),
				models: dateModel,
				rows: {
					path: "/"
				},
				columns: [{
					name: "Material",
					template: {

						content: "'{Material}"
					}
				}, {
					name: "Product Description",
					template: {
						content: "{ProductDescription}"
					}
				}, {
					name: "Plant",
					template: {
						content: "{Plant}"
					}
				}, {
					name: "Cross Plant Status",
					template: {
						content: "'{CrossPlantStatus}"
					}
				}, {
					name: "On Hand Qty",
					template: {
						content: "{On_Hand_Qty}"
					}
				}, {
					name: "Total Std Cost",
					template: {
						content: "{Tot_Std_Cost}"
					}
				}, {
					name: "Std Price",
					template: {
						content: "{Std_Price}"
					}
				}, {
					name: "Goods Shipped",
					template: {
						content: "{GoodsShipped}"
					}
				}, {
					name: "Consumption",
					template: {
						content: "{Consumption}"
					}
				}, {
					name: "S.Loc S099 Qty",
					template: {
						content: "{SLoc_S099_Qty}"
					}
				}, {
					name: "24 Month Usage",
					template: {
						content: "{MonthUsage24}"
					}
				}, {
					name: "Excess QOH",
					template: {
						content: "{ExcessQOH}"
					}
				}, {
					name: "NEW, OBS, EXC or GOOD",
					template: {
						content: "{NEW_OBS_EXC_or_GOOD}"
					}
				}, {
					name: "Excess OH FIFO",
					template: {
						content: "{Excess_OH_FIFO}"
					}
				}, {
					name: "Obsolete OH FIFO",
					template: {
						content: "{Obsolete_OH_FIFO}"
					}
				}, {
					name: "E_O_OH_FIFO",
					template: {
						content: "{E_O_OH_FIFO}"
					}
				}, {
					name: "Months Usage Life in months",
					template: {
						content: "{Months_Usage_Life_in_months}"
					}
				}, {
					name: "Creation Date",
					template: {
						content: "{CreationDate}"
					}
				}]
			});
			a.saveFile().always(function () {
				this.destroy();
			});
		}
	});
});