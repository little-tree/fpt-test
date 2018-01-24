function advanceSearch(careFacilityId){
    var serviceUserTable;
	$(".advance_search_local").click(function(){		
		$("#service_user_dialog").dialog({
			
			 modal: true,
			 show: 'blind',
			 hide: 'blind',
			 width: 990,
			 draggable: false,
			 resizable: false,
			 dialogClass: 'ui-dialog-osx',
			 open:function(){
				 sessionStorage.serviceUserNumber= $("#serviceUserNumberSearch").val();
				 $("#serviceUserNumberSearch").val("");
				 $("#tab").css("display", "none");
				 // get data from local storage
				 var serviceUserFactory = storage.getServiceUserFactory();
				 var careFacilityIdSearch = careFacilityId;
				 var serviceUserData = serviceUserFactory.getListServiceUserByCareFacility(careFacilityIdSearch);
				 
				  if(!serviceUserData){
					  serviceUserData = [];
				  }
				  if(! $.fn.DataTable.isDataTable( '#service_user_table' )){
					  serviceUserTable = $("#service_user_table").DataTable( {
							"paging":   false,
							"info":     false,
							data: serviceUserData,
							columns: [
							            { data: null, 
							              render: function ( data, type, row ){
							            	  return '<input type="radio" name="serviceUserNumber" value="'+row.service_user_number+'"></input>';
							              }},
							             { data: null,render:''},
								         { data: null, render: 'last_name' },
								         { data: null, render: 'first_name' },
								         { data: null, render: 'last_name_kana' },
								         { data: null, render: 'first_name_kana' },
								         { data: null, render: 'insured_no' }
							        ],
							 "columnDefs": [ {
							            "searchable": false,
							            "orderable": false,
							            "targets": 1
							        } ],
							 "order": [[ 1, 'asc' ]]
							
					 });
				  }

				  
				  
				  serviceUserTable.on( 'order.dt search.dt', function () {
					  serviceUserTable.column(1, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				            cell.innerHTML = i+1;
				        } );
				  } ).draw();
				  
				  serviceUserTable.search('');
				  
				  stvClientInputCheck.initialize(window.serverContextPath + "validator-client", "/json/serviceUserSelector.json", "/properties/applicationmessage.properties");
			 },
			 close: function( event, ui ) {
				 $("#tab").css("display", "block");
				 $("#serviceUserNumberSearch").val(sessionStorage.serviceUserNumber);
				 if(serviceUserTable){
					 serviceUserTable.destroy();
				 }
				 
				 $(".filter").val('');
				 $("#service_user_dialog #info ul#message_check").empty();
				 $("#message_filteringLastName").prop("hidden", true);
				 $("#message_filteringFirstName").prop("hidden", true);
				 $("#message_filteringLastNameKana").prop("hidden", true);
				 $("#message_filteringFirstNameKana").prop("hidden", true);
				 $("#message_filteringInsurerNumber").prop("hidden", true);
				 

				 $("#filteringLastName").removeClass("stvInvalid");
				 $("#filteringFirstName").removeClass("stvInvalid");
				 $("#filteringLastNameKana").removeClass("stvInvalid");
				 $("#filteringFirstNameKana").removeClass("stvInvalid");
				 $("#filteringInsurerNumber").removeClass("stvInvalid");
				 $("#filteringLastName").removeClass("stvValid");
				 $("#filteringFirstName").removeClass("stvValid");
				 $("#filteringLastNameKana").removeClass("stvValid");
				 $("#filteringFirstNameKana").removeClass("stvValid");
				 $("#filteringInsurerNumber").removeClass("stvValid");
				 
				 if(window.isServiceUserList){
					 stvClientInputCheck.initialize(serverContextPath + "validator-client","/json/serviceUserList.json","/properties/applicationmessage.properties");
				 }
				 
				 
			 }
		})
	});
	
	$("#userSearch").click(function(){
		
		// Get result of client input check error and display message if has error
		event = {"target":{"id":"userSearch"}};
   		var resultOne = stvClientInputCheck.checkResult(event,true);
	    if (resultOne.stvResult) {
	    	$("#client_check").css("display","none");
	    	// implement search data
	    	var serviceUserTable = $("#service_user_table").DataTable();
			if(serviceUserTable){
				
				// clear global search
				serviceUserTable.search('');
				serviceUserTable.columns().search('');
				var lastName = $("#filteringLastName").val();
				var firstName = $("#filteringFirstName").val();
				var lastNameKana = $("#filteringLastNameKana").val();
				var firstNameKana = $("#filteringFirstNameKana").val();
				var insurerNo = $("#filteringInsurerNumber").val();
				
				if(lastName != "" || firstName != "" || lastNameKana!= "" || firstNameKana!= "" || insurerNo != ""){
					// search by last name

					if(lastName != ""){
						serviceUserTable.column('2').search(lastName).draw();
					}
					
					// search by first name
					
					if(firstName != ""){
						serviceUserTable.column('3').search(firstName).draw();
					}
					// search by last name kana
					
					if(lastNameKana != ""){
						serviceUserTable.column('4').search(lastNameKana).draw();
					}
					// search by first name kana
					
					if(firstNameKana !=""){
						serviceUserTable.column('5').search(firstNameKana).draw();
					}
					
					// search by insurer no
					
					if(insurerNo != ""){
						serviceUserTable.column('6').search(insurerNo).draw();
					}
					
				}else{
					serviceUserTable.column('').search('').draw();
				}
					
					
				// check empty result
				var totalRecord = serviceUserTable.page.info().recordsDisplay;
				// 2017/02/22: fix issue #8300
				var errors = $("#service_user_dialog #info ul#message_check").empty();
				if(totalRecord == 0){
					$("#service_user_table .dataTables_empty").css("display","none");
					// display message
					var message = stvClientInputCheck.getMessage('WAR_U32_04');
					var appendLi = '<li class="error">'+message+' </li>';
//					var errors = $("#service_user_dialog #info ul#message_check").empty();
					errors.append(appendLi);
				} else {
					// Fixing #8300 : When got data then clear those fields.
					 $("#filteringLastName").removeClass("stvInvalid");
					 $("#filteringFirstName").removeClass("stvInvalid");
					 $("#filteringLastNameKana").removeClass("stvInvalid");
					 $("#filteringFirstNameKana").removeClass("stvInvalid");
					 $("#filteringInsurerNumber").removeClass("stvInvalid");
					 $("#filteringLastName").removeClass("stvValid");
					 $("#filteringFirstName").removeClass("stvValid");
					 $("#filteringLastNameKana").removeClass("stvValid");
					 $("#filteringFirstNameKana").removeClass("stvValid");
					 $("#filteringInsurerNumber").removeClass("stvValid");
				}
		/*		}else{
					
					// display message
					var message = '<li class="error">'+stvClientInputCheck.getMessage('WAR_U32_01')+' </li>';
					var errors = $("#service_user_dialog #info ul#message_check").empty();
					errors.append(message);
				}*/				
			}
	    } else {
	    	 $("#service_user_dialog #info ul#message_check").empty();
	    	 $("#client_check").css("display","block");
	    	var numErrorName = 0;
	    	var numErrorNameKana = 0;
	    	for (var item in resultOne.stvItems) {
	    		if(resultOne.stvItems[item].result === false) {
	    			document.getElementById("message_" + resultOne.stvItems[item].id).hidden = "";
	    			if(resultOne.stvItems[item].id == "filteringLastName" || resultOne.stvItems[item].id == "filteringFirstName"){
	    				numErrorName++;
	    			}
	    			if(resultOne.stvItems[item].id == "filteringLastNameKana" || resultOne.stvItems[item].id == "filteringFirstNameKana"){
	    				numErrorNameKana++;
	    			}
	    		} else {
	    			document.getElementById("message_" + resultOne.stvItems[item].id).hidden = "hidden";

	    		}
	    	}
	    	
	    	
	    	if(numErrorName > 1){
	    		document.getElementById("message_filteringFirstName").hidden = "hidden";
	    	}
	    	
	    	if(numErrorNameKana > 1){
	    		document.getElementById("message_filteringFirstNameKana").hidden = "hidden";
	    	}
	    }
	});
	
	$("#settingBtn").click(function(){
		
		var serviceUserNumber = $("input[name='serviceUserNumber']:checked").val();
		if(serviceUserNumber){
			$("#service_user_dialog").dialog('close');
			
			// put service user number to session
			sessionStorage.serviceUserNumber = serviceUserNumber;
			$("#serviceUserNumberSearch").val(sessionStorage.serviceUserNumber);
			$("#serviceUserNumberSearch").trigger($.Event("keyup", { keyCode: 13 }));
			$("#searchForm #serviceUserNumber").val(sessionStorage.serviceUserNumber);
		}
	});
}