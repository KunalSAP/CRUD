sap.ui.controller("controllers.ProductList", {
	onInit: function() {
		var sServiceUrl = "/ecc2/sap/opu/odata/SAP/Z_GW_PRODUCT_SRV/";
		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
			useBatch: false
		});
		this.getView().setModel(oModel);
	},

	onPress: function() {

		var sFrom = this.getView().byId("idSelectFrom").getSelectedItem().getText();
		var sTo = this.getView().byId("idSelectTo").getSelectedItem().getText();

		//create filter array objects cause filters are stored in form of arrays
		var filter = [];

		var oFilter = new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.BT, sFrom, sTo);

		filter.push(oFilter);

		this.getView().byId("idList").getBinding("items").filter(filter);
	},

	onItemPress: function(oEvent) {
		//every property has get and set method... so getTitle()
		var sSelItem = oEvent.getSource().getTitle(); //eg : ANATR

		//oModel is local to onItemPress function
		var oModel = this.getView().getModel();

		//get the reference to the model
		var sPath = "/ProductSet('" + sSelItem + "')";

		//get reference to view.
		var oViewRef = this;

		//read from Model
		oModel.read(sPath, {
			success: function(odata) {
				//data read from the Odata needs to be set to the Model which is in javascript format hence JSON model
				var oModel2 = new sap.ui.model.json.JSONModel(odata);

				//bind with the simple form
				var osf = oViewRef.getView().byId("SimpleFormDisplay354");

				//setting visibility of simple form to true
				osf.setVisible(true);

				osf.setModel(oModel2);

				sap.m.MessageToast.show("Data read Success");
			},
			error: function() {
				sap.m.MessageToast.show("You fucked up");
			}
		});
	},

	onCreate: function() {
		// Here this refers to controller
		var oRef_to_model = this;

		//create a dialog box
		var oDialog = new sap.m.Dialog({
			title: "Create Product",
			content: [
				new sap.m.Label({
					text: "Product ID"
				}),
				new sap.m.Input(),
				new sap.m.Label({
					text: "Product Name"
				}),
				new sap.m.Input()
			],

			beginButton: new sap.m.Button({
				text: "Creat & Save",
				press: function() {
					var data = {
						ProductID: this.getParent().getContent()[1].getValue(),
						Name: this.getParent().getContent()[3].getValue()
					};

					// this will fetch the dialog reference
					var myDialog = this.getParent();

					//create an entry. If this.getView would be used it would refer to button.
					oRef_to_model.getView().getModel().create("/ProductSet", data, {
						success: function() {
							sap.m.MessageToast.show("Creation Success");
							myDialog.close();
						},
						error: function() {
							sap.m.MessageToast.show("Creation Failure");
							myDialog.close();
						}

					});
				}

			}),
			endButton: new sap.m.Button({
				text: "Close",
				press: function() {
					oDialog.close();
				}
			})

		});

		oDialog.open();

	},

	onDelete: function(ODeleteEvent) {

		var bindingPath = ODeleteEvent.getParameters().listItem.getBindingContextPath();

		this.getView().getModel().remove(bindingPath, {
			success: function() {
				sap.m.MessageToast.show("Product Deleted");
			},
			error: function() {
				sap.m.MessageToast.show("Product Not Deleted");
			}
		});

	},

	onUpdate: function() {

		var oRef_to_model1 = this;
		//create a dialog box
		var oDialogUpdate = new sap.m.Dialog({
			title: "Update Product",
			content: [
				new sap.m.Label({
				text: "Product ID"
				}),
				new sap.m.Input({
				value: this.getView().byId("idProd").getText(),                                                  
				editable : false
				
				}),
			
				new sap.m.Label({
					text: " Update Product Name"
				}),
				new sap.m.Input()
			],

			beginButton: new sap.m.Button({
				text: "Save",
				press: function() {
					debugger;
					var upData = {
						ProductID: this.getParent().getContent()[1].getValue(),
						Name: this.getParent().getContent()[3].getValue()
					};

					//update(sPath, oData, mParameters?)
					oRef_to_model1.getView().getModel().update("/ProductSet",
						upData, {
							success: function() {
								sap.m.MessageToast.show("Product Updated");
								oDialogUpdate.close();
							},
							error: function() {
								sap.m.MessageToast.show("Product Update Failed");
									oDialogUpdate.close();
							}
						});
				}

			})

		});

		oDialogUpdate.open();
	}

});