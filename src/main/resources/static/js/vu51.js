function readFile(fileInput, secretKey) {

	// date time format
	var lastUpate = "updated_time";
	var webStorageUtil = new WebStorageUtil();
	// array to save service user data
	var serviceUserDataArr = {
		keys : [],
		datas : []
	};
	var serviceUserHistoryDataArr = {
		keys : [],
		datas : []
	};
	var serviceUserTemporaryDataArr = {
		keys : [],
		datas : []
	};

	var file = fileInput.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {

		try {

			var encryptedData = reader.result;
			var decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey);
			var content = decryptedData.toString(CryptoJS.enc.Utf8);

			var lines = content.split('\n');
			var flag = true;
			var totalServiceUserRecord = 0;
			var totalServiceUserHistoryRecord = 0;
			var totalServiceUserTemporaryRecord = 0;

			const serviceUserKeyParttern = /^\d{10}-\d{4}$/;
			const serviceUserHistoryKeyParttern = /^\d{10}-\d{4}-\d*$/;
			const serviceUserTemporaryKeyParttern = /^\d{10}-\d{4}-[T]$/;
			const serviceUserTemporaryKeyParttenEx = /^\d{10}--[\d]+-[T]$/;
			
			var last_update;
			if (lines.length > 0) {
				var firstLine = lines[0];
				if (firstLine) {

					var data = firstLine.split(',');
					if (data.length == 2) {
						// last_update
						var key_time = data[0];
						// time stamp
						var time = data[1];

						// validate first line
						if (!(key_time == lastUpate)) {
							
							if(time){
								if(!isValidateTime(time)){
									displayInvalidFormatMessage();
									return false;
								}
							}
							
							
							
						}
						last_update = time;
						//console.log(last_update+ "---------");
						
					}

				}

				var secondLine = lines[1];
				if (secondLine) {
					// read service user data
					var data = secondLine.split(',');
					if (data.length = 2) {

						var service_user_key = data[0];
						totalServiceUserRecord = parseInt(data[1]);

						// validate second line
						if ((service_user_key == webStorageUtil.getSchema().SERVICE_USER
								&& totalServiceUserRecord > -1 && totalServiceUserRecord < lines.length - 3)) {

							// read service user data and validate
							// if valida then save to service user array
							for (var i = 0; i < totalServiceUserRecord; i++) {

								// starting from line 2
								var serviceUserData = lines[i + 2];
								if (serviceUserData) {

									var serviceUserArray = serviceUserData.split(',');
									var keyService = serviceUserArray[0];

									if (keyService) {
										var serviceData = serviceUserData.substring(keyService.length + 1,serviceUserData.length);

										// validate service user data
										if (serviceUserKeyParttern.exec(keyService) !== null && serviceData) {

											var serviceUserJson = JSON.parse(serviceData);

											if (isValidSerivceUser(serviceUserJson)) {

												var service_user = new Service_User();
												service_user.service_user_number = serviceUserJson.service_user_number;
												service_user.care_facility_id = serviceUserJson.care_facility_id;
												service_user.insured_no = serviceUserJson.insured_no;
												service_user.insurer_no = serviceUserJson.insurer_no;
												service_user.last_name = serviceUserJson.last_name;
												service_user.first_name = serviceUserJson.first_name;
												service_user.last_name_kana = serviceUserJson.last_name_kana;
												service_user.first_name_kana = serviceUserJson.first_name_kana;
												service_user.tel_no = serviceUserJson.tel_no;
												service_user.birthday = serviceUserJson.birthday;

												serviceUserDataArr.keys.push(keyService);
												serviceUserDataArr.datas.push(service_user);

											} else {
												displayInvalidFormatMessage();
												return false;
											}

										} else {
											displayInvalidFormatMessage();
											return false;
										}

									} else {
										displayInvalidFormatMessage();
										return false;
									}

								} else {
									displayInvalidFormatMessage();
									return false;
								}
							}

							
							//console.log(serviceUserDataArr);
							
							// read service user history data
							var serviceHistoryIndex = totalServiceUserRecord + 2;
							var serviceUserHistoryLines = lines[serviceHistoryIndex];
							if (serviceUserHistoryLines) {
								var dataHistory = serviceUserHistoryLines.split(',');
								var service_user_history_key = dataHistory[0];
								totalServiceUserHistoryRecord = parseInt(dataHistory[1]);
								
								if (service_user_history_key == webStorageUtil.getSchema().SERVICE_USER_HISTORY
										&& totalServiceUserHistoryRecord > -1 && totalServiceUserHistoryRecord < lines.length-1
										- totalServiceUserRecord - 2) {
									// validate service user data
									for (var i = 0; i < totalServiceUserHistoryRecord; i++) {

										// starting from line 2
										var serviceUserHistoryData = lines[i+ serviceHistoryIndex + 1];
										if (serviceUserHistoryData) {

											var serviceUserHistoryArray = serviceUserHistoryData.split(',');
											var keyService = serviceUserHistoryArray[0];
											if(keyService){
												// validate service user data
												if (serviceUserHistoryKeyParttern.exec(keyService) !== null) {

													var serviceData = serviceUserHistoryData.substring(keyService.length + 1,serviceUserHistoryData.length);
													if (serviceData) {

														var serviceUserJson = JSON.parse(serviceData);

														if (isValidSerivceUser(serviceUserJson)) {

															var service_user = new Service_User();
															service_user.service_user_number = serviceUserJson.service_user_number;
															service_user.care_facility_id = serviceUserJson.care_facility_id;
															service_user.insured_no = serviceUserJson.insured_no;
															service_user.insurer_no = serviceUserJson.insurer_no;
															service_user.last_name = serviceUserJson.last_name;
															service_user.first_name = serviceUserJson.first_name;
															service_user.last_name_kana = serviceUserJson.last_name_kana;
															service_user.first_name_kana = serviceUserJson.first_name_kana;
															service_user.tel_no = serviceUserJson.tel_no;
															service_user.birthday = serviceUserJson.birthday;

															serviceUserHistoryDataArr.keys.push(keyService);
															serviceUserHistoryDataArr.datas.push(service_user);

														} else {
															displayInvalidFormatMessage();
															return false;
														}
													} else {
														displayInvalidFormatMessage();
														return false;
													}

												} else {
													displayInvalidFormatMessage();
													return false;
												}	
													
											}else{
												displayInvalidFormatMessage();
												return false;
											}
										} else {
											displayInvalidFormatMessage();
											return false;
										}
									}

									// Read service user temporary data
									//console.log(serviceUserHistoryDataArr);

									var serviceUserTemporaryIndex = totalServiceUserRecord+ 2+ totalServiceUserHistoryRecord+ 1;
									var serviceUserTemporaryLines = lines[serviceUserTemporaryIndex];
									if (serviceUserTemporaryLines) {
										var dataTemporary = serviceUserTemporaryLines.split(',');
										var service_user_temporary_key = dataTemporary[0];
										totalServiceUserTemporaryRecord = parseInt(dataTemporary[1]);

										if ((service_user_temporary_key == webStorageUtil.getSchema().SERVICE_USER_TEMPORARY
												&& totalServiceUserTemporaryRecord > -1 
												&& totalServiceUserTemporaryRecord+ serviceUserTemporaryIndex + 1 == lines.length-1)) {
											// validate service user data
											for (var i = 0; i < totalServiceUserTemporaryRecord; i++) {

												// starting from line 2
												var serviceUserTemporaryData = lines[i+ serviceUserTemporaryIndex+ 1];
												if (serviceUserTemporaryData) {

													var serviceUserArray = serviceUserTemporaryData.split(',');
													var keyService = serviceUserArray[0];
													if (keyService) {
														
														var serviceTemporaryData = serviceUserTemporaryData.substring(keyService.length + 1,serviceUserTemporaryData.length);
														// validate service user data
														if ((serviceUserTemporaryKeyParttern.exec(keyService) !== null) || (serviceUserTemporaryKeyParttenEx.exec(keyService) !==null)) {

															if (serviceTemporaryData) {

																var serviceUserTemporaryJson = JSON.parse(serviceTemporaryData);

																if (isValidSerivceUserTemporary(serviceUserTemporaryJson)) {

																	var service_user = new Service_User_Temporary();
																	service_user.service_user_number = serviceUserTemporaryJson.service_user_number;
																	service_user.care_facility_id = serviceUserTemporaryJson.care_facility_id;
																	service_user.insured_no = serviceUserTemporaryJson.insured_no;
																	service_user.insurer_no = serviceUserTemporaryJson.insurer_no;
																	service_user.last_name = serviceUserTemporaryJson.last_name;
																	service_user.first_name = serviceUserTemporaryJson.first_name;
																	service_user.last_name_kana = serviceUserTemporaryJson.last_name_kana;
																	service_user.first_name_kana = serviceUserTemporaryJson.first_name_kana;
																	service_user.tel_no = serviceUserTemporaryJson.tel_no;
																	service_user.birthday = serviceUserTemporaryJson.birthday;
																	service_user.gender = serviceUserTemporaryJson.gender;
																	service_user.care_period_start = serviceUserTemporaryJson.care_period_start;
																	service_user.care_period_end = serviceUserTemporaryJson.care_period_end;
																	service_user.care_level = serviceUserTemporaryJson.care_level;
																	service_user.family_structure = serviceUserTemporaryJson.family_structure;
																	service_user.main_care_person = serviceUserTemporaryJson.main_care_person;
																	service_user.nursing_care_contents = serviceUserTemporaryJson.nursing_care_contents;
																	service_user.burden = serviceUserTemporaryJson.burden;
																	service_user.living_enviroment =  serviceUserTemporaryJson.living_enviroment;
																	service_user.financial_situation = serviceUserTemporaryJson.financial_situation;
																	service_user.history_of_life =  serviceUserTemporaryJson.history_of_life;
																	service_user.individual_factor = serviceUserTemporaryJson.individual_factor;
																	service_user.hobby_region_of_interest = serviceUserTemporaryJson.hobby_region_of_interest;
																	service_user.remarks = serviceUserTemporaryJson.remarks;
																	service_user.service_period_start = serviceUserTemporaryJson.service_period_start;
																	service_user.service_period_end = serviceUserTemporaryJson.service_period_end;
																	service_user.careing_person = serviceUserTemporaryJson.careing_person;
																	service_user.request_flag = serviceUserTemporaryJson.request_flag;
																	
																	serviceUserTemporaryDataArr.keys.push(keyService);
																	serviceUserTemporaryDataArr.datas.push(service_user)

																} else {
																	displayInvalidFormatMessage();
																	return false;
																}
															} else {
																displayInvalidFormatMessage();
																return false;
															}

														} else {
															displayInvalidFormatMessage();
															return false;
														}

													} else {
														displayInvalidFormatMessage();
														return false;
													}

												} else {
													displayInvalidFormatMessage();
													return false;
												}
											}

										}

									}

									//console.log(serviceUserTemporaryDataArr);
									var tempoInfo = lines[lines.length-1];
									var data = tempoInfo.split(',');
									if (data.length = 2) {
										var result = new ServiceUserData(data[1],last_update,serviceUserDataArr,serviceUserHistoryDataArr,serviceUserTemporaryDataArr);
										importServiceUserData(result);
									}else{
										displayInvalidFormatMessage();
										return false;
									}
									
								}

							}

						}

					}

				}

			}

			displayInvalidFormatMessage();
			return false;
		} catch (e) {
			displayInvalidFormatMessage();
			return false;
		}

	}

	reader.readAsText(file);
}

// send request to server to check update time of service user data
// if time in server side is newer then display warning dialog.
function importServiceUserData(data){
	
	
	if(data){
		$.ajax({
			url : serverContextPath+'service_user/last_update',
			type : "get",
			contentType : "application/json; charset=utf-8",
			success : function(response) {
				
				if(response.lastUpdate){
					var d = new Date(parseInt(data.last_update));
					if(response.lastUpdate > d.getTime()){
						
						// display warning dialog
						var dialogMessage = stvClientInputCheck.getMessage('CON_U51_01');
						var okCallback = function(data){
							importCallback(data);
						}
						$("#error_message").empty();
						$("#loading").css("display","none");
						displayConfirmDialog(dialogMessage, okCallback, data);
						
						
					}else{
						
						// begin import data
						importCallback(data);
					}
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				
				window.location.href = serverContextPath+"/error";
			}
		});
	}
	
	
}


function backUpData(secretKey){
	
	$("#loading").css("display","block");
	var data = exportServiceUser();
	var date = $.format.date(new Date(), "yyyyMMddHHmmss");

	var encryptedData = CryptoJS.AES.encrypt(data, secretKey);

	$("#loading").css("display","none");
	var fileName = "Rehabili_"+ date +".rehabili";
	var rawData = new Blob([encryptedData.toString()],{type: "application/octet-stream"});
	if(window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(rawData, fileName);
	}else {
		var textToSaveAsURL = window.URL.createObjectURL(rawData);
		var downloadLink = document.createElement("a");
		downloadLink.download = fileName;
		downloadLink.href = textToSaveAsURL;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		downloadLink.remove();
	}
	
}




function importCallback(data){
	$("#loading").css("display","block");
	var result = importServiceUser(data);
	if(result){
		//display success message
		document.getElementById("input_check").hidden = "hidden";
		document.getElementById("error_message").hidden = "hidden";
		
		$("#success_message").empty();
		var message = stvClientInputCheck.getMessage('INF_U51_01');
		$("#success_message").append('<li>' + message + '</li>');
		document.getElementById("success_message").hidden = "";
		
	}else{
		//display errors message
		document.getElementById("input_check").hidden = "hidden";
		document.getElementById("success_message").hidden = "hidden";
		
		$("#error_message").empty();
		var message = stvClientInputCheck.getMessage('WAR_U51_03');
		$("#error_message").append('<li class="error">' + message + '</li>');
		document.getElementById("error_message").hidden = "";
	}
	
	 $("#loading").css("display","none");
}




function ServiceUserData(temporary_index,last_update, serviceUserDataArr,serviceUserHistoryDataArr, serviceUserTemporaryDataArr) {
	this.temporary_index = temporary_index;
	this.last_update = last_update;
	this.serviceUserDataArr = serviceUserDataArr;
	this.serviceUserHistoryDataArr = serviceUserHistoryDataArr;
	this.serviceUserTemporaryDataArr = serviceUserTemporaryDataArr;
}

// validate date time function
function isValidateTime(time) {
	var flag = (new Date(time) !== "Invalid Date" && !isNaN(new Date(time))) ? true
			: false;
	return flag;
}

// validate service user object
function isValidSerivceUser(serviceUserJson) {
	//return true;
	const insuredNoPattern = /^[0-9\H]\d{9}$/;
	const insurerNoPattern = /^\d{6}$/;
	const telNoParttern = /^\d{14}$/;
	const serviceUserNoParttern = /^\d{4}$/;
	const careFacilityIdParttern = /^\d{10}$/;
	
	if (Object.keys(serviceUserJson).length == 10) {

		var serviceUserNumber = serviceUserJson.service_user_number;
		var careFacilityId = serviceUserJson.care_facility_id;
		var insureddNo = serviceUserJson.insured_no;
		var insurerNo = serviceUserJson.insurer_no;
		var lastName = serviceUserJson.last_name;
		var firstName = serviceUserJson.first_name;
		var lastNameKana = serviceUserJson.last_name_kana;
		var firstNameKana = serviceUserJson.first_name_kana;
		var telNo = serviceUserJson.tel_no;
		var birthday = serviceUserJson.birthday;

		if(!(serviceUserJson.hasOwnProperty('service_user_number') && serviceUserJson.hasOwnProperty('care_facility_id')
				&& serviceUserJson.hasOwnProperty('insured_no') && serviceUserJson.hasOwnProperty('insurer_no') 
				&& serviceUserJson.hasOwnProperty('last_name') && serviceUserJson.hasOwnProperty('first_name') 
				&& serviceUserJson.hasOwnProperty('last_name_kana') && serviceUserJson.hasOwnProperty('first_name_kana') 
				&& serviceUserJson.hasOwnProperty('birthday') && serviceUserJson.hasOwnProperty('tel_no'))){
			return false;
		}
		
		if(!isMatch(serviceUserNumber, serviceUserNoParttern)){
			return false;
		}
		if(!isMatch(careFacilityId, careFacilityIdParttern)){
			return false;
		}
		if(!isMatch(insureddNo, insuredNoPattern)){
			return false;
		}
		if(!isMatch(insurerNo, insurerNoPattern)){
			return false;
		}
		
		if(birthday){
			if(!isValidBirthday(birthday)){
				return false;
			}
		}
		
		if(telNo){
			if(isMatch(telNo, telNoParttern)){
				return false;
			}
		}
		



		return true;

	}
	return false;
}

// validate service user temporary 28
function isValidSerivceUserTemporary(serviceUserTemporaryJson) {
	
	//Andrew no validate temporary user service
	return true;
	
	const insuredNoPattern = /^[0-9\H]\d{9}$/;
	const insurerNoPattern = /^\d{8}$/;
	const telNoParttern = /^\d{14}$/;
	const serviceUserNoParttern = /^\d{4}$/;
	const careFacilityIdParttern = /^\d{10}$/;
	
	
	if (Object.keys(serviceUserTemporaryJson).length == 28) {

		var serviceUserNumber = serviceUserTemporaryJson.service_user_number;
		var careFacilityId = serviceUserTemporaryJson.care_facility_id;
		var insureddNo = serviceUserTemporaryJson.insured_no;
		var insurerNo = serviceUserTemporaryJson.insurer_no;
		var lastName = serviceUserTemporaryJson.last_name;
		var firstName = serviceUserTemporaryJson.first_name;
		var lastNameKana = serviceUserTemporaryJson.last_name_kana;
		var firstNameKana = serviceUserTemporaryJson.first_name_kana;
		var telNo = serviceUserTemporaryJson.tel_no;
		var birthday = serviceUserTemporaryJson.birthday;
		
		var carePeriodStart = serviceUserTemporaryJson.care_period_start;
		var carePeriodEnd = serviceUserTemporaryJson.care_period_end;
		var carelevel = serviceUserTemporaryJson.care_level;
		var familyStructure = serviceUserTemporaryJson.family_structure;
		var mainCarePerson = serviceUserTemporaryJson.main_care_person;
		var nursingCareContents = serviceUserTemporaryJson.nursing_care_contents;
		var burden = serviceUserTemporaryJson.burden;
		var livingEnviroment =  serviceUserTemporaryJson.living_enviroment;
		var financialSituation = serviceUserTemporaryJson.financial_situation;
		var historyOfLife =  serviceUserTemporaryJson.history_of_life;
		var individualFactor = serviceUserTemporaryJson.individual_factor;
		var hobbyRegionOfInterest = serviceUserTemporaryJson.hobby_region_of_interest;
		var remarks = serviceUserTemporaryJson.remarks;
		var servicePeriodStart = serviceUserTemporaryJson.service_period_start;
		var servicePeriodEnd = serviceUserTemporaryJson.service_period_end;
		var careingPerson = serviceUserTemporaryJson.careing_person;

		if(!(serviceUserTemporaryJson.hasOwnProperty('service_user_number') && serviceUserTemporaryJson.hasOwnProperty('care_facility_id')
				&& serviceUserTemporaryJson.hasOwnProperty('insured_no') && serviceUserTemporaryJson.hasOwnProperty('insurer_no') 
				&& serviceUserTemporaryJson.hasOwnProperty('last_name') && serviceUserTemporaryJson.hasOwnProperty('first_name') 
				&& serviceUserTemporaryJson.hasOwnProperty('last_name_kana') && serviceUserTemporaryJson.hasOwnProperty('first_name_kana') 
				&& serviceUserTemporaryJson.hasOwnProperty('birthday') && serviceUserTemporaryJson.hasOwnProperty('tel_no')
				
				&& serviceUserTemporaryJson.hasOwnProperty('care_period_start') && serviceUserTemporaryJson.hasOwnProperty('care_period_end')
				&& serviceUserTemporaryJson.hasOwnProperty('care_level') && serviceUserTemporaryJson.hasOwnProperty('family_structure')
				&& serviceUserTemporaryJson.hasOwnProperty('main_care_person') && serviceUserTemporaryJson.hasOwnProperty('nursing_care_contents')
				&& serviceUserTemporaryJson.hasOwnProperty('burden') && serviceUserTemporaryJson.hasOwnProperty('living_enviroment')
				&& serviceUserTemporaryJson.hasOwnProperty('financial_situation') && serviceUserTemporaryJson.hasOwnProperty('history_of_life')
				&& serviceUserTemporaryJson.hasOwnProperty('individual_factor') && serviceUserTemporaryJson.hasOwnProperty('hobby_region_of_interest')
				&& serviceUserTemporaryJson.hasOwnProperty('remarks') && serviceUserTemporaryJson.hasOwnProperty('service_period_start')
				&& serviceUserTemporaryJson.hasOwnProperty('service_period_end') && serviceUserTemporaryJson.hasOwnProperty('careing_person')
				&& serviceUserTemporaryJson.hasOwnProperty('gender') && serviceUserTemporaryJson.hasOwnProperty('request_flag'))){
			
			return false;
		}
		
		if(!(isMatch(serviceUserNumber, serviceUserNoParttern) || serviceUserNumber == '-1')){
			return false;
		}
		if(!isMatch(careFacilityId, careFacilityIdParttern)){
			return false;
		}
		if(!isMatch(insureddNo, insuredNoPattern)){
			return false;
		}
		if(!isMatch(insurerNo, insurerNoPattern)){
			return false;
		}
		
		if(birthday){
			if(!isValidBirthday(birthday)){
				return false;
			}
		}
		
		if(carePeriodStart){
			if(!isValidBirthday(carePeriodStart)){
				return false;
			}
		}
		
		if(carePeriodEnd){
			if(!isValidBirthday(carePeriodEnd)){
				return false;
			}
		}
		
		if(servicePeriodStart){
			if(!isValidBirthday(servicePeriodStart)){
				return false;
			}
		}
		
		if(servicePeriodEnd){
			if(!isValidBirthday(servicePeriodEnd)){
				return false;
			}
		}
		if(telNo){
			if(isMatch(telNo, telNoParttern)){
				return false;
			}
		}
		

		return true;
	
	}
	
	return false;
}

//validate follow regex
function isMatch(string, regex) {
	if ((regex.exec(string)) !== null) {

		return true;
	}
	return false;
}

// validate date birthday yyyy/mm/dd
function isValidBirthday(birthday) {
	
	const regex = /^(\d{4})[\/](\d{2})[\/](\d{2})$/;
	if ((regex.exec(birthday)) !== null) {

		var year = parseInt(birthday.substring(0, 4));
		var month = parseInt(birthday.substring(5, 7));
		var day = parseInt(birthday.substring(8, 10));

		var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		if (!(year < 1000 || year > 3000 || month == 0 || month > 12)) {
			if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
				monthLength[1] = 29;
			}

			if (day > 0 && day <= monthLength[month - 1]) {
				return true;
			}
		}

	}
	return false;
}

function displayInvalidFormatMessage(){
	$("#loading").css("display","none");
	//display errors message
	document.getElementById("success_message").hidden = "hidden";
	document.getElementById("input_check").hidden = "hidden";
	
	
	var message = stvClientInputCheck.getMessage('WAR_U51_02');
	
	$("#error_message").empty();
	$("#error_message").append('<li class="error">' + message + '</li>');
	document.getElementById("error_message").hidden = "";
}
