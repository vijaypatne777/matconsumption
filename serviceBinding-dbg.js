function initModel() {
	var sUrl = "/OPENSAP/sap/opu/odata/sap/YY1_GOODS_MVMT_CDS/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}