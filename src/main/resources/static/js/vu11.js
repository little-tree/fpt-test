function saveServiceUser(timeOut) {
	
	$("#loading").css("display","block");
	var time =0;
	if(window.lastUpdate){
		time = (new Date(window.lastUpdate)).getTime();
	}

	var gender = $('input[name = "gender_male"]:checked').val();
	var burden = $('input[name = "burden"]:checked').val();

	var postData = {
		serviceUserNumber : $("#serviceUserNumber").val(),
		insurerNo : $("#insurerNo").val(),
		insuredNo : $("#insuredNo").val(),
		serviceUserLastName : $("#serviceUserLastName").val(),
		serviceUserLastNameKana : $("#serviceUserLastNameKana").val(),
		serviceUserFirstName : $("#serviceUserFirstName").val(),
		serviceUserFirstNameKana : $("#serviceUserFirstNameKana").val(),
		gender : gender,
		birthday : $("#birthday").val(),
		carePeriodStart : $("#carePeriodStart").val(),
		carePeriodEnd : $("#carePeriodEnd").val(),
		careLevel : $("#careLevel").val(),
		familyStructure : $("#familyStructure").val(),
		mainCarePerson : $("#mainCarePerson").val(),
		nursingCareContents : $("#nursingCareContents").val(),
		burden : burden,
		livingEnviroment : $("#livingEnviroment").val(),
		financialSituation : $("#financialSituation").val(),
		historyOfLife : $("#historyOfLife").val(),
		individualFactor : $("#individualFactor").val(),
		hobbyRegionOfInterest : $("#hobbyRegionOfInterest").val(),
		remarks : $("#remarks").val(),
		servicePeriodStart : $("#servicePeriodStart").val(),
		servicePeriodEnd : $("#servicePeriodEnd").val(),
		serviceUserStaffs : [],
		lastUpdate: time
	};

	$('.userId').each(function() {
		postData.serviceUserStaffs.push($(this).children().val());
	})

	postData = JSON.stringify(postData);
	
	var serviceUserFactory = storage.getServiceUserFactory();
	var historyFactory = storage.getHistoryFactory();
	
	
	var oldServiceUserNumber = $("#serviceUserNumber").val();
	if (oldServiceUserNumber == "") {
		//oldServiceUserNumber = -1;
		var serviceUserTable = localStorage.getItem("service_users");
		serviceUserTable = JSON.parse(serviceUserTable);
		//decrease 		
		//serviceUserTable['temporary_index']--;
		oldServiceUserNumber = serviceUserTable['temporary_index']
	}
	var header = {};
	header[$("meta[name='_csrf_header']").attr("content")] = $("meta[name='_csrf']").attr("content") ;
	$
			.ajax({
				url : serverContextPath + 'service_user/user',
				type : "post",
				data : postData,
				contentType : "application/json; charset=utf-8",
				timeout : timeOut,
				headers: header,
				success : function(response) {

					var errors = response.errors;
					var serviceUserNumber = response.service_user_number;
					var historyNumber = response.history_number;
					var updateTime;
					
					if(response.update_time){
						updateTime = (new Date(parseInt(response.update_time))).toISOString();
						window.lastUpdate = updateTime;
					}
					
					
					// check if has errors
					if (errors || !(serviceUserNumber) || !(historyNumber) || !(updateTime)) {
						// remove service user in temporary if in new screen
						if(!window.isEditLocalVariable){
							serviceUserFactory.removeFromTemporary($("#careFacilityId").val(),
									oldServiceUserNumber);
						}
						
						$("#error_message").empty();
						
						// check not found errors
						if(errors.indexOf("ERR_U11_01") != -1){
							
							document.getElementById('errorPage').click();
							return "";
							
						}
						
						document.getElementById("input_check").hidden = "hidden";
						document.getElementById("success_message").hidden = "hidden";

						
						for (var i = 0; i < errors.length; i++) {
							$("#error_message").append(
									'<li class="error">' + errors[i] + '</li>');
						}

						document.getElementById("error_message").hidden = "";
						$("#loading").css("display","none");
						// success
					} else {

						var serviceUser = new Service_User();

						serviceUser.care_facility_id = $("#careFacilityId").val();
						serviceUser.service_user_number = serviceUserNumber;

						serviceUser.insured_no = $("#insuredNo").val();
						serviceUser.insurer_no = $("#insurerNo").val();
						serviceUser.last_name = $("#serviceUserLastName").val();
						serviceUser.first_name = $("#serviceUserFirstName").val();
						serviceUser.last_name_kana = $("#serviceUserLastNameKana").val();
						serviceUser.first_name_kana = $("#serviceUserFirstNameKana").val();
						serviceUser.birthday = $("#birthday").val();
						serviceUser.tel_no = "";

						
						if (serviceUserFactory.saveOrUpdate(serviceUser,
								updateTime)) {

							// remove service user in temporary
							if(window.isEditLocalVariable){
								oldServiceUserNumber = window.serviceUserNumber;
							}
							if (serviceUserFactory.removeFromTemporary(serviceUser.care_facility_id,oldServiceUserNumber)) {

								if (historyFactory.save(serviceUser,historyNumber)) {
									// display success message
									var message;
									if(isEditScreen){
										message = stvClientInputCheck.getMessage('INF_U21_01');
									}else{
										message = stvClientInputCheck.getMessage('INF_U11_01',serviceUserNumber);
									}
									

									$("#success_message").empty();
									$("#success_message").append('<li>' + message + '</li>');

									document.getElementById("success_message").hidden = "";
									document.getElementById("error_message").hidden = "hidden";
									document.getElementById("input_check").hidden = "hidden";

									$("#loading").css("display","none");
								}
							}


						}
						
						
						//clear all value in table
			    		if(!isEditScreen){
			    			clearTable();	
			    		}


					}

					$("#loading").css("display","none");
				},
				error : function(jqXHR, textStatus, errorThrown) {

					if (textStatus === "timeout") {
						// remove service user in temporary
						if(!window.isEditLocalVariable){
							serviceUserFactory.removeFromTemporary($("#careFacilityId").val(),
									oldServiceUserNumber);
						}
						
						// display time out warning
						var message = stvClientInputCheck
								.getMessage('WAR_U11_12');

						$("#error_message").empty();
						$("#error_message").append('<li class="error">' + message + '</li>');
						document.getElementById("input_check").hidden = "hidden";
						document.getElementById("success_message").hidden = "hidden";
						
						document.getElementById("error_message").hidden = "";
			    		
						
						
					} else {
						// call error system page
						// remove service user in temporary
						if(!window.isEditLocalVariable){
							serviceUserFactory.removeFromTemporary($("#careFacilityId").val(),
									oldServiceUserNumber);
						}
						
						$("#errorPage").trigger( "click" );
						window.location.href = serverContextPath+ "error";
					}
					
					$("#loading").css("display","none");
				}
			});
}

function temporarySave(flag, storage) {

	var service_User_Temporary = createTemporaryServiceUser();

	if (service_User_Temporary) {

		service_User_Temporary.request_flag = flag;
		if (storage) {

			var serviceUserFactory = storage.getServiceUserFactory();
			// save service user to temporary table
			if (serviceUserFactory
					.saveOrUpdateToTemporary(service_User_Temporary)) {
				return true;
			}
		}
	}

	return false;
}

function createTemporaryServiceUser() {
	var service_User_Temporary = new Service_User_Temporary();
	service_User_Temporary.service_user_number = $("#serviceUserNumber").val();
	if (!$("#serviceUserNumber").val()) {		
		if(window.serviceUserNumber){
			service_User_Temporary.service_user_number  = window.serviceUserNumber;
		}else{
			//get index
			var serviceUserTable = localStorage.getItem("service_users");
			serviceUserTable = JSON.parse(serviceUserTable);
			//decrease 		
			serviceUserTable['temporary_index']--;
			localStorage.setItem("service_users", JSON.stringify(serviceUserTable));		

			service_User_Temporary.service_user_number = serviceUserTable['temporary_index'];
		}

	}
	service_User_Temporary.care_facility_id = $("#careFacilityId").val();

	service_User_Temporary.insured_no = $("#insuredNo").val();
	service_User_Temporary.insurer_no = $("#insurerNo").val();
	service_User_Temporary.last_name = $("#serviceUserLastName").val();
	service_User_Temporary.last_name_kana = $("#serviceUserLastNameKana").val();
	service_User_Temporary.first_name = $("#serviceUserFirstName").val();
	service_User_Temporary.first_name_kana = $("#serviceUserFirstNameKana")
			.val();
	service_User_Temporary.tel_no = "";
	var gender = $('input[name = "gender_male"]:checked').val();
	if(gender){
		service_User_Temporary.gender = gender;
	}
	
	service_User_Temporary.birthday = $("#birthday").val();
	service_User_Temporary.care_period_start = $("#carePeriodStart").val();
	service_User_Temporary.care_period_end = $("#carePeriodEnd").val();
	service_User_Temporary.care_level = $("#careLevel").val();
	service_User_Temporary.family_structure = $("#familyStructure").val();
	service_User_Temporary.main_care_person = $("#mainCarePerson").val();
	service_User_Temporary.nursing_care_contents = $("#nursingCareContents")
			.val();
	
	var burden = $('input[name = "burden"]:checked').val();
	if(burden){
		service_User_Temporary.burden = burden;
	}
	service_User_Temporary.living_enviroment = $("#livingEnviroment").val();
	service_User_Temporary.financial_situation = $("#financialSituation").val();
	service_User_Temporary.history_of_life = $("#historyOfLife").val();
	service_User_Temporary.individual_factor = $("#individualFactor").val();
	service_User_Temporary.hobby_region_of_interest = $(
			"#hobbyRegionOfInterest").val();
	service_User_Temporary.remarks = $("#remarks").val();

	service_User_Temporary.service_period_start = $("#servicePeriodStart")
			.val();
	service_User_Temporary.service_period_end = $("#servicePeriodEnd").val();
	service_User_Temporary.careing_person = [];
	$('.userId').each(function() {

		service_User_Temporary.careing_person.push($(this).children().val());
	})

	service_User_Temporary.request_flag = "-1"; // Manage synchronized
												// transaction between client
												// and server : -1,0,1,2

	return service_User_Temporary;
}

// Check service user number has exist
// if exist then return true
// if not exist then specifix position to insert new row
function isServiceUserExist(userId) {
	var serviceUserList = $('.userId');
	for (i = 0; i < serviceUserList.length; i++) {
		var element = serviceUserList[i];
		var serviceUserVal = $(element).children().val();
		var serviceUserNext = $(element).parent().next();
		var serviceUserNextVal = $(serviceUserNext).children().children().val();

		if (userId == serviceUserVal)
			return -1;

		if (userId > serviceUserVal) {

			if (serviceUserNextVal) {
				if (serviceUserNextVal > userId) {
					return i + 1;
				}

			} else {
				return i + 1;
			}
		} else {
			return i;
		}

	}
	return serviceUserList.length;
}

function setIndex() {
	// re-sort index
	$('.table_list_small .no').each(function(index) {

		$(this).text(index + 1);
		var element = $('td.userId')[index];
		$(element).children().attr("id", "serviceUserStaffs[" + index + "]");
		$(element).children().attr("name", "serviceUserStaffs[" + index + "]");
	});
}

function deleteServiceUser(object) {

	var currentRow = $(object).parent().parent().remove();
	var serviceUserList = $('.userId');
	if(serviceUserList){
		if(serviceUserList.length < 1){
			$("#addBtn").css("pointer-events","auto");	
		}
	}
	// re-sort index
	setIndex();

}

function clearAllData(){
	
}
function displayPrivateServiceUserInfor(serviceUserNumber) {

	var careFacilityId = $("#careFacilityId").val();	
	
	var serviceUserFactory = storage.getServiceUserFactory();	
	if (!serviceUserNumber) {
		var serviceUserNumber = $("#serviceUserNumber").val();
	}
	var serviceUserTemporary = serviceUserFactory.getServiceUserFromTemporary(
			careFacilityId, serviceUserNumber);

	if (serviceUserTemporary) {				
		$("#insuredNo").val(serviceUserTemporary.insured_no);
		$("#insurerNo").val(serviceUserTemporary.insurer_no);
		$("#serviceUserLastName").val(serviceUserTemporary.last_name);
		$("#serviceUserLastNameKana").val(serviceUserTemporary.last_name_kana);
		
		$("#serviceUserFirstName").val(serviceUserTemporary.first_name);
		$("#serviceUserFirstNameKana")
				.val(serviceUserTemporary.first_name_kana);
		$("input[name='gender_male']").val([serviceUserTemporary.gender]);
		$("#birthday").val(serviceUserTemporary.birthday);
		$("#carePeriodStart").val(serviceUserTemporary.care_period_start);
		$("#carePeriodEnd").val(serviceUserTemporary.care_period_end);
		$("#careLevel").val(serviceUserTemporary.care_level);
		$("#familyStructure").val(serviceUserTemporary.family_structure);
		$("#mainCarePerson").val(serviceUserTemporary.main_care_person);
		$("#nursingCareContents").val(
				serviceUserTemporary.nursing_care_contents);
		$("input[name='burden']").val([serviceUserTemporary.burden]);
		$("#livingEnviroment").val(serviceUserTemporary.living_enviroment);
		$("#financialSituation").val(serviceUserTemporary.financial_situation);
		$("#historyOfLife").val(serviceUserTemporary.history_of_life);
		$("#individualFactor").val(serviceUserTemporary.individual_factor);
		$("#hobbyRegionOfInterest").val(
				serviceUserTemporary.hobby_region_of_interest);
		$("#remarks").val(serviceUserTemporary.remarks);

		$("#servicePeriodStart").val(serviceUserTemporary.service_period_start);
		$("#servicePeriodEnd").val(serviceUserTemporary.service_period_end);
		var carePerson = serviceUserTemporary.careing_person;
		// empty table
		$("#service_user_list_create > tbody").html("");
		for (var index = 0; index < carePerson.length; index++) {

			var name = getFullName(carePerson[index]);
			var row = '<tr>'
					+ '<td style="width: 53px;" class="text_center no"></td>'
					+ '<td style="display:none;" class="text_center userId"> '
					+ '<input '
					+ 'id="serviceUserStaffs[0]" name="serviceUserStaffs[0]" '
					+ 'value ="'
					+ carePerson[index]
					+ '">'
					+ '</td>'
					+ '<td style="width: 386px;" class="fullName">'
					+ name
					+ '</td>'
					+ '<td style="width: 95px;" class="text_center">'
					+ '<a class="delete_button" tabindex="10" onclick="javascript:deleteServiceUser(this)">削除</a>'
					+ '</td>' + '</tr>';

			if (index <= 0) {
				$('.table_list_small tbody').prepend(row);

			} else {
				$('.table_list_small tbody > tr:nth-child(' + index + ')')
						.after(row);
			}

			setIndex();

		}

	} else {

		var serviceUser = serviceUserFactory.getServiceUser(careFacilityId,
				serviceUserNumber);
		if (serviceUser) {
			$("#insuredNo").val(serviceUser.insured_no);
			$("#serviceUserLastNameKana").val(serviceUser.last_name_kana);
			$("#serviceUserFirstNameKana").val(serviceUser.first_name_kana);
			$("#serviceUserLastName").val(serviceUser.last_name);
			$("#serviceUserFirstName").val(serviceUser.first_name);
			$("#birthday").val(serviceUser.birthday);
		}

	}

}

function getFullName(value) {
	var options = $("#selectUserStaff option");
	for (var i = 0; i < options.length; i++) {
		var temp = $(options[i]).val();
		var text = $(options[i]).text();
		if (temp == value)
			return text;
//		else
//			console.log("");
	}
}

function compareDate(date1, date2){
	
	if(date1.getTime() < date2.getTime()){
		return true;
	}
	
	return false;
}

function clearTable(){
	$("#serviceUserForm input[type='text']").val("");
	$("#serviceUserForm input[type='radio']").prop( "checked", false );
	$("#serviceUserForm select").each(function(){
		$(this).val( $(this).find('option:first').val());
	})
	
	$("#service_user_list_create tbody").html("");
}

function displayEditInformation(serviceUserNumber){
	var mapId = $("#careFacilityId").val()+"-"+serviceUserNumber+"-"+"T";
	var serviceUserTemp = localStorage.getItem(mapId);
	
	if(serviceUserTemp){
		//serviceUserTemp = JSON.parse(serviceUserTemp);
		displayPrivateServiceUserInfor(serviceUserNumber);
	}else{
		//reload screen
		window.location.href = window.serverContextPath + "service_user/user";
	}
}

function registerService(){
	
	var formName = "serviceUserForm";
	
	// Set message in dialog
	var dialogMessage;
	if(isEditScreen){
		dialogMessage = stvClientInputCheck.getMessage('CON_U21_01');
	}else{
		dialogMessage = stvClientInputCheck.getMessage('CON_U11_01');
	}
	
	// Define method for click OK button in confirm dialog
	var okCallback = function (formName) {
		
			// Hide success message and error message from server side
		document.getElementById("success_message").hidden = "hidden";
		document.getElementById("error_message").hidden = "hidden";
		
		// Get result of client input check error and display message if has error
		event = {"target":{"id":"confirmBtn"}};
   		var resultOne = stvClientInputCheck.checkResult(event,true);
	    if (resultOne.stvResult) {
	    	$('#input_check li.error').attr("hidden","true");
	    	$('#serviceUserForm input.stvInvalid').removeClass("stvInvalid");
	    	if(inputCheckDateConstraint()){
	    		// call temporary save function
		       	var flag = -1;
		       
		       	if(temporarySave(flag,storage)){
		       		saveServiceUser(timeOut);
		       	}
		       	
		       	// remove all error class in input field
		       	$('#serviceUserForm input.stvInvalid').removeClass("stvInvalid");
		       	
		       	
	    	}
	       	
	    } else {
	    	var numError = 0;
	    	var flag = false;
	    	for (var item in resultOne.stvItems) {
	    		if(resultOne.stvItems[item].result === false) {
	    			document.getElementById("message_" + resultOne.stvItems[item].id).hidden = "";
	    			if(resultOne.stvItems[item].id == "carePeriodStart" || resultOne.stvItems[item].id == "carePeriodEnd"){
	    				flag = true;
	    			}		    			
	    			numError ++;
	    		} else {
	    			document.getElementById("message_" + resultOne.stvItems[item].id).hidden = "hidden";
	    			var test = $('#'+resultOne.stvItems[item].id);
	    			$('#'+resultOne.stvItems[item].id).removeClass("stvInvalid"); 
	    		}
	    	}
	    	
	    	var errorLastNameKana = $("#message_serviceUserLastNameKana").text();
	    	var errorFirstNameKana = $("#message_serviceUserFirstNameKana").text();
	    	// display only 1 error message
	    	if(errorLastNameKana){
	    		if(errorFirstNameKana){
	    			$("#message_serviceUserFirstNameKana").attr("hidden","true");
	    		}
	    	}
	    	
	    	if(!flag){
	    		if(!inputCheckDateConstraint()){
	    			document.getElementById("input_check").hidden = "";
	    			
	    		}else{
					$("#carePeriodStart").removeClass( ["stvInvalid" ] ); 
					$("#carePeriodEnd").removeClass( ["stvInvalid" ] ); 
					$("#servicePeriodStart").removeClass( ["stvInvalid" ] ); 
					$("#servicePeriodEnd").removeClass( ["stvInvalid" ] ); 
	    		}
	    	}else{
	    		$("#carePeriodStart").removeClass( ["stvInvalid" ] ); 
				$("#carePeriodEnd").removeClass( ["stvInvalid" ] ); 
				$("#servicePeriodStart").removeClass( ["stvInvalid" ] ); 
				$("#servicePeriodEnd").removeClass( ["stvInvalid" ] ); 
	    	}
	    } 
	}
	displayConfirmDialog(dialogMessage, okCallback, formName);
}