// Rehabili web storage object
function RehabiliWebStorage() {
	const suffix = 'T';
	if (!localStorage) {

		throw "Your browser is not support.";
	};

	var webStorageUtil = new WebStorageUtil();
	// check service user web-storage was existed.
	webStorageUtil.setupDatabase();

	// Get service user factory
	this.getServiceUserFactory = function() {
		return serviceUserFactory;
	};

	// Get service user history factory
	this.getHistoryFactory = function() {
		return historyFactory;
	};

	// Service_User factory: provide API for service user module with
	// Web-Storage
	var serviceUserFactory = new function() {
		
		// get last update time
		this.getLastUpdate = function(){
			var schema = webStorageUtil.getSchema();
			// get data collections
			var serviceUsersTable = localStorage
					.getItem(schema.SERVICE_USER);

			// convert string to an JSON object
			var serviceUserArray = JSON.parse(serviceUsersTable);
			
			return serviceUserArray.updated_time;
		}

		// get service user by care_facility_id and service_user_number from
		// SERVICE_USER
		// return a service_user
		this.getServiceUser = function(care_facility_id, service_user_number) {

			// validate input data
			if (care_facility_id && service_user_number) {
				// create service user key and get data follow key in
				// localStorage
				var serviceUserData = localStorage.getItem(care_facility_id
						+ '-' + service_user_number);

				// convert string to an JSON object
				var serviceUser = JSON.parse(serviceUserData);

				return serviceUser;

			}

		};

		// get service user by care_facility_id and service_user_number from SERVICE_USER_TEMPORARY
		// my be serviceUserNumber is null
		// careFacilityId can be fake when the first time save
		this.getServiceUserFromTemporary = function(care_facility_id,service_user_number){
			
			// validate data input : not null or empty or undefined
			if(care_facility_id && service_user_number){
				
				// create service user key and get data follow key in localStorage
				var serviceUserData = localStorage.getItem(care_facility_id+'-'+service_user_number+'-'+suffix);

				// convert string to an JSON object
				var serviceUser = JSON.parse(serviceUserData);
				
				return serviceUser;
			}
			
		}
		
		// get list service_user
		// 1. Get list service_user from Service_User by care facility id
		// 2. return array service user
		this.getListServiceUserByCareFacility = function(care_facility_id) {

			// check care facility empty or not null or undefined
			if (care_facility_id) {

				var schema = webStorageUtil.getSchema();
				// get data collections
				var serviceUsersTable = localStorage
						.getItem(schema.SERVICE_USER);

				// convert string to an JSON object
				var serviceUserArray = JSON.parse(serviceUsersTable);
				var serviceUsers = [];
				for ( var i in serviceUserArray.service_users) {

					// get key of each service user
					var key = serviceUserArray.service_users[i];

					if (key.indexOf(care_facility_id) >= 0) {
						// get sevice user by key
						var service_user = localStorage.getItem(key);
						if (service_user) {
							// push service_user to the array
							serviceUsers.push(JSON.parse(service_user));
						}
					}

				}
				return serviceUsers;
			}

		};

		// save service_user to Web-Storage : SERVICE_USER table
		// 1. check data is valid
		// 2. check data is existed: if exist then update attribute else add new
		// to the end
		// 3. save data
		// return errors if have
		this.saveOrUpdate = function(service_user,updateTime) {

			// validate data input
			if (service_user && service_user instanceof Service_User) {

				var schema = webStorageUtil.getSchema();
				// get data collections
				var serviceUsersTable = localStorage.getItem(schema.SERVICE_USER);

				// convert string to an JSON object
				var serviceUserArray = JSON.parse(serviceUsersTable);

				// find service_user exist
				var service_user_key = service_user.care_facility_id+ '-'
						+ service_user.service_user_number  ;

				var index = findServiceUserById(service_user_key,
						serviceUserArray.service_users);
				try {

					if (index == -1) {
						// Add new service_user key to table
						serviceUserArray.service_users.push(service_user_key);
						serviceUserArray.updated_time = updateTime;
					}

					// save data to localStorage
					localStorage.setItem(schema.SERVICE_USER, JSON
							.stringify(serviceUserArray));
					
					localStorage.setItem(service_user_key, JSON
							.stringify(service_user));

					
					
					return true;
				} catch (err) {
					// exceed your storage quota
					return false;
				}

			} 
		}

		// save data to temporary user service
		this.saveOrUpdateToTemporary = function(service_user_temporary) {

			// validate data input
			if (service_user_temporary
					&& service_user_temporary instanceof Service_User_Temporary) {

				var schema = webStorageUtil.getSchema();
				// get data from SERVICE_USER_TEMPORARY
				var serviceUsersTemporaryTable = localStorage
						.getItem(schema.SERVICE_USER_TEMPORARY);
				// Convert data to JSON array
				var serviceUsersTemporaryArray = JSON
						.parse(serviceUsersTemporaryTable);

				// find service user temporary exist
				var service_user_key = service_user_temporary.care_facility_id
						+ '-' + service_user_temporary.service_user_number
						+ '-T';
				var index = findServiceUserById(service_user_key,
						serviceUsersTemporaryArray.service_users);

				try {
					if (index == -1) {
						// Add new service user temporary
						serviceUsersTemporaryArray.service_users
								.push(service_user_key);
					}

					// save data to localStorage
					localStorage.setItem(schema.SERVICE_USER_TEMPORARY, JSON
							.stringify(serviceUsersTemporaryArray));
					localStorage.setItem(service_user_key, JSON
							.stringify(service_user_temporary));

					return true;

				} catch (err) {
					// exceed your storage quota
					return false;
				}
			}
		}

		
		// Delete service user
		// 1. get list of service user from SERVICE_USER
		// 2. check service user exist in list of service user  then remove service user if exist
		// 3. save data
		
		this.remove = function(care_facility_id,service_user_number){ // the key of SERVICE_USER
			// validate data input : not null or empty or undefined
			if(care_facility_id && service_user_number){
				
				var schema = webStorageUtil.getSchema();
				// get data collections
				var serviceUsersTable = localStorage.getItem(schema.SERVICE_USER);

				// convert string to an JSON object
				var serviceUserArray = JSON.parse(serviceUsersTable);
				
				// find service_user exist
				var key = care_facility_id+'-'+service_user_number;
				var index = findServiceUserById(key,serviceUserArray.service_users);
				if(index != -1){
					// remove the service user out of array
					serviceUserArray.service_users.splice(index,1);
					try{
						// save data to localStorage
						localStorage.setItem(schema.SERVICE_USER,JSON.stringify(serviceUserArray));
						// remove service user object
						localStorage.removeItem(care_facility_id+'-'+service_user_number);
					
						return true;
					}catch(err){
					
						// exceed your storage quota
						return false;
					}
				}
				
			}

		}
		
		// Delete service user
		// 1. get list of service user from SERVICE_USER_TEMPORARY
		// 2. check service user exist in list of service user  then remove service user if exist
		// 3. save data
		this.removeFromTemporary = function(care_facility_id,service_user_number){
			
			// validate data input : not null or empty or undefined
			if(care_facility_id && service_user_number){
				var schema = webStorageUtil.getSchema();
				// get data from SERVICE_USER_TEMPORARY
				var serviceUsersTemporaryTable = localStorage.getItem(schema.SERVICE_USER_TEMPORARY);
				// Convert data to JSON array
				var serviceUsersTemporaryArray = JSON.parse(serviceUsersTemporaryTable);
				var key = care_facility_id+'-'+service_user_number+'-T';
				// find service user temporary exist
				var index = findServiceUserById(key,serviceUsersTemporaryArray.service_users);
				
				if(index >= 0){
					// Remove the service user temporary out of array
					serviceUsersTemporaryArray.service_users.splice(index,1);	
					try{
						// save data to localStorage
						localStorage.setItem(schema.SERVICE_USER_TEMPORARY,JSON.stringify(serviceUsersTemporaryArray));
						// remove service user temporary save record by key
						localStorage.removeItem(key);
						
						return true;
					}catch(err){
						
						// exceed your storage quota
						return false;
					}
				}
			}
		}
		
		// import service user data
		this.importServiceUserData = function(last_update,serviceUserDataArr,temporary_index){
			
			var schema = webStorageUtil.getSchema();
			// get data collections
			var serviceUsersTable = localStorage.getItem(schema.SERVICE_USER);
			
			
			
			// convert string to an JSON object
			var serviceUserArray = JSON.parse(serviceUsersTable);
			
			if(serviceUserArray){
				serviceUserArray.updated_time = last_update;
			}
			
			//Andrew add temporay_index
			if(serviceUserArray){
				serviceUserArray.temporary_index = temporary_index;
			}
			serviceUserArray.service_users = serviceUserDataArr.keys;
			try{
				localStorage.setItem(schema.SERVICE_USER, JSON.stringify(serviceUserArray));
				for(var i = 0; i < serviceUserDataArr.keys.length; i++){
					localStorage.setItem(serviceUserDataArr.keys[i], JSON.stringify(serviceUserDataArr.datas[i]));
				}
				
				return true;
			}catch(err){
				
				// exceed your storage quota
				return false;
			}
			
			
		}
		// export service user data
		this.exportServiceUserData= function(){
			
			var schema = webStorageUtil.getSchema();
			var serviceUsersTable = localStorage.getItem(schema.SERVICE_USER);
			
			var keyList = JSON.parse(serviceUsersTable);
			var dataList = [];
			for(var i = 0; i < keyList.service_users.length; i++){
				
				var serviceUserData = localStorage.getItem(keyList.service_users[i]);
				dataList.push(serviceUserData);
			}
			var serviceData = {
					temporary_index: keyList.temporary_index,
					updated_time: keyList.updated_time,
					key : keyList.service_users,
					data: dataList
			}
			return serviceData;
			
		}
		
		
		
		// import service temporary data
		this.importServiceUserTemporaryData = function(serviceUserTemporaryDataArr){
			
			var schema = webStorageUtil.getSchema();
			// get data from SERVICE_USER_TEMPORARY
			var serviceUsersTemporaryTable = localStorage.getItem(schema.SERVICE_USER_TEMPORARY);
			// Convert data to JSON array
			var serviceUsersTemporaryArray = JSON.parse(serviceUsersTemporaryTable);
			
			serviceUsersTemporaryArray.service_users = serviceUserTemporaryDataArr.keys;
			try{
				localStorage.setItem(schema.SERVICE_USER_TEMPORARY, JSON.stringify(serviceUsersTemporaryArray));
				
				for(var i = 0; i < serviceUserTemporaryDataArr.keys.length; i++){
					localStorage.setItem(serviceUserTemporaryDataArr.keys[i], JSON.stringify(serviceUserTemporaryDataArr.datas[i]));
				}
				
				return true;
			}catch(err){
				
				// exceed your storage quota
				return false;
			}
			
		}
		
		// export service user data
		this.exportServiceUserTemporaryData = function(){
			
			var schema = webStorageUtil.getSchema();
			var serviceUsersTemporaryTable = localStorage.getItem(schema.SERVICE_USER_TEMPORARY);
			
			var keyList = JSON.parse(serviceUsersTemporaryTable);
			var dataList = [];
			for(var i = 0; i < keyList.service_users.length; i++){
				
				var serviceUserData = localStorage.getItem(keyList.service_users[i]);
				dataList.push(serviceUserData);
			}
			
			var serviceData = {
					key : keyList.service_users,
					data: dataList
			}
			return serviceData;
			
		}
		
		// private method
		// find service user in service_users arrays
		// return index of service user or service user temporary in array
		var findServiceUserById = function(key, service_users_array) {

			var index = service_users_array.indexOf(key);
			return index;
		}

	};
	
	// Service_User History : provide API for module history change
	var historyFactory = new function(){
		
		// add new service user history change
		// 1. validate data input
		// save service user history to localStorage
		this.save = function(service_user_history,historyNumber){
			
			if(service_user_history && service_user_history instanceof Service_User){
				// create key to save service user history
				var key = service_user_history.care_facility_id + '-' + service_user_history.service_user_number + '-' + historyNumber;
				
				var schema = webStorageUtil.getSchema();
				
				var serviceUserHistoryTable = localStorage.getItem(schema.SERVICE_USER_HISTORY);
				
				var serviceUserHistoryArray = JSON.parse(serviceUserHistoryTable);
				
				var index = findServiceUserHistory(key,serviceUserHistoryArray.service_users);
				try{
					if(index < 0){
					
						// push the key to service user history
						serviceUserHistoryArray.service_users.push(key);
					}
					
					// save service user to web-storage
					localStorage.setItem(key,JSON.stringify(service_user_history));
					localStorage.setItem(schema.SERVICE_USER_HISTORY,JSON.stringify(serviceUserHistoryArray));
					
					return true;
				}catch(err){
					// exceed your storage quota
					return false;
				}	
			}
		};
		
		
		this.removeHistoryList = function(care_facility_id,service_user_number){
			
			// validate data input : not null or empty or undefined
			if(care_facility_id && service_user_number){
				
				var schema = webStorageUtil.getSchema();
				// get data collections
				var serviceUsersHistoryTable = localStorage.getItem(schema.SERVICE_USER_HISTORY);

				// convert string to an JSON object
				var serviceUserHistoryArray = JSON.parse(serviceUsersHistoryTable);
				
				// find service_user exist
				var result = getListServiceUserHistoryKey(care_facility_id,service_user_number,serviceUserHistoryArray.service_users);
				
				for(var i = 0; i < result.length; i++ ){
					
					var index = serviceUserHistoryArray.service_users.indexOf(result[i]);
					
					if(index != -1){
						// remove the service user out of array
						serviceUserHistoryArray.service_users.splice(index,1);
						// remove service user object
						localStorage.removeItem(result[i]);
						
					}
				}
				
				try{
					// save data to localStorage
					localStorage.setItem(schema.SERVICE_USER_HISTORY,JSON.stringify(serviceUserHistoryArray));

					return true;
				}catch(err){
				
					// exceed your storage quota
					return false;
				}
				
			}
			
		}
		
		// Get history change of an service user
		this.getServiceUserHistory = function(care_facility_id, service_user_number,history_number){
			
			if(care_facility_id && service_user_number && history_number){
				var key = care_facility_id+'-'+service_user_number+'-'+history_number;
			
				var serviceUserHistoryData = localStorage.getItem(key);
				var serviceUserHistory = JSON.parse(serviceUserHistoryData);

				return serviceUserHistory;
			}
			
		};
		
		// import history service user data
		this.importServiceUserHistoryData = function(serviceUserHistoryDataArr){
			
			var schema = webStorageUtil.getSchema();
			
			var serviceUserHistoryTable = localStorage.getItem(schema.SERVICE_USER_HISTORY);
			
			var serviceUserHistoryArray = JSON.parse(serviceUserHistoryTable);
			serviceUserHistoryArray.service_users = serviceUserHistoryDataArr.keys;
			
			try{
				localStorage.setItem(schema.SERVICE_USER_HISTORY,JSON.stringify(serviceUserHistoryArray));
				
				for(var i = 0; i < serviceUserHistoryDataArr.keys.length; i++){
					localStorage.setItem(serviceUserHistoryDataArr.keys[i],JSON.stringify(serviceUserHistoryDataArr.datas[i]));
				}
				
				return true;
			}catch(err){
				// exceed your storage quota
				return false;
			}	
			
		}
		
		this.exportServiceUserHistoryData = function(){
			
			var schema = webStorageUtil.getSchema();
			var serviceUserHistoryTable = localStorage.getItem(schema.SERVICE_USER_HISTORY);
			
			var keyList = JSON.parse(serviceUserHistoryTable);
			
			var dataList = [];
			for(var i = 0; i < keyList.service_users.length; i++){
				
				var serviceUserHistoryData = localStorage.getItem(keyList.service_users[i]);
				dataList.push(serviceUserHistoryData);
			}
			
			var serviceData = {
					key : keyList.service_users,
					data: dataList
			}
			
			return serviceData;
			
		}
		
		// private method
		// to find the service user history key exist in an array
		var findServiceUserHistory = function(key, service_users_history){
			var index = service_users_history.indexOf(key);
			return index;
		}
		
		// private method
		// get list service user history follow care facility id and service user number
		var getListServiceUserHistoryKey = function(careFacilityId,serviceUserNumber, service_users_history){
			var result = [];
			var key = careFacilityId+'-'+serviceUserNumber;
			for(var i = 0; i < service_users_history.length; i++ ){
				
				if(service_users_history[i].indexOf(key) >=0){
					result.push(service_users_history[i]);
				}
			}
			
			
			
			return result;
		}
	};

}

// save all data in service_users to SERVICE_USER table and
// SERVICE_USER_TEMPORARY
// 1. Clear all data in SERVICE_USER and SERVICE_USER_TEMPORARY table
// 2. save all data in array service_users to SERVICE_USER table
// 3. save all data in array service_users_temporary to SERVICE_USER_TEMPORARY
// table
function importServiceUser(data) {

	var lastUpdate = data.last_update;
	localStorage.clear();
	
	var webStorageUtil = new WebStorageUtil();
	webStorageUtil.setupDatabase();
	
	var storage = new RehabiliWebStorage();
	var serviceUserFactory = storage.getServiceUserFactory();
	var historyUserFactory = storage.getHistoryFactory();
	if(serviceUserFactory.importServiceUserData(data.last_update,data.serviceUserDataArr,data.temporary_index)){
		
		if(historyUserFactory.importServiceUserHistoryData(data.serviceUserHistoryDataArr)){
			if(serviceUserFactory.importServiceUserTemporaryData(data.serviceUserTemporaryDataArr)){
				return true;
			}
		}
	}
	
	return false;
	
};

// Write service user data to a text file: csv or txt
// 1. read service user data
// 2. read service user temporary data
// 3. return data export

function exportServiceUser() {
	
	var webStorageUtil = new WebStorageUtil();
	var storage = new RehabiliWebStorage();
	var serviceUserFactory = storage.getServiceUserFactory();
	var historyUserFactory = storage.getHistoryFactory();
	// get all service user data
	var serviceUserData = serviceUserFactory.exportServiceUserData();
	var serviceUserHistoryData = historyUserFactory.exportServiceUserHistoryData();
	var serviceUserTemporaryData = serviceUserFactory.exportServiceUserTemporaryData();
	
	var dot = ",";
	var newLine = "\n";
	
	var temporaryIndex = newLine + "temporary_index," + serviceUserData.temporary_index;
	var timeContent = webStorageUtil.getSchema().updated_time + dot + serviceUserData.updated_time;
	var serviceUserNumber = newLine+ webStorageUtil.getSchema().SERVICE_USER + dot + serviceUserData.data.length;
	var serviceUserContent = "";
	for(var i = 0; i < serviceUserData.data.length; i++){
		serviceUserContent += newLine + serviceUserData.key[i] + dot+ serviceUserData.data[i];
	}
	
	var serviceUserHistoryNumber = newLine+ webStorageUtil.getSchema().SERVICE_USER_HISTORY + dot + serviceUserHistoryData.data.length;
	var serviceUserHistoryContent = "";
	for(var i = 0; i < serviceUserHistoryData.data.length; i++){
		serviceUserHistoryContent += newLine + serviceUserHistoryData.key[i] + dot+ serviceUserHistoryData.data[i];
	}
	
	var serviceUserTemporaryNumber = newLine+ webStorageUtil.getSchema().SERVICE_USER_TEMPORARY + dot + serviceUserTemporaryData.data.length;
	var serviceUserTemporaryContent = "";
	
	for(var i = 0; i < serviceUserTemporaryData.data.length; i++){
		serviceUserTemporaryContent += newLine + serviceUserTemporaryData.key[i] + dot+ serviceUserTemporaryData.data[i];
	}
	
	return  timeContent + serviceUserNumber + serviceUserContent 
					+ serviceUserHistoryNumber + serviceUserHistoryContent
					+ serviceUserTemporaryNumber + serviceUserTemporaryContent + temporaryIndex;
};

// SERVICE_USER table
function Service_User() {

	this.care_facility_id = ""; // key
	this.service_user_number = ""; // key

	this.insured_no = ""; // String
	this.insurer_no = ""; // String
	this.last_name = ""; // String
	this.first_name = ""; // String
	this.last_name_kana = ""; // String
	this.first_name_kana = ""; // String
	this.birthday = ""; // String
	this.tel_no = ""; // String

}

// SERVICE_USER_TEMPORARY table
function Service_User_Temporary() {

	this.service_user_number = ""; // String - key
	this.care_facility_id = ""; // String - key
	this.insured_no = ""; // String
	this.insurer_no = ""; // String
	this.last_name = ""; // String
	this.last_name_kana = ""; // String
	this.first_name = ""; // String
	this.first_name_kana = ""; // String
	this.tel_no = ""; // String
	this.gender = ""; // boolean
	this.birthday = ""; // YYYY/MM/DD
	this.care_period_start = ""; // Date YYYY/MM/DD
	this.care_period_end = ""; // Date YYYY/MM/DD
	this.care_level = ""; // String
	this.family_structure = ""; // String
	this.main_care_person = ""; // String
	this.nursing_care_contents = "";// String
	this.burden = ""; // boolean
	this.living_enviroment = ""; // String
	this.financial_situation = ""; // String
	this.history_of_life = ""; // String
	this.individual_factor = ""; // String
	this.hobby_region_of_interest = ""; // String
	this.remarks = ""; // String
	this.service_period_start = ""; // Date YYYY/MM/DD
	this.service_period_end = ""; // Date YYYY/MM/DD
	this.careing_person = ""; // system_user_id
	this.request_flag = ""; // Manage synchronized transaction between client
							// and server : -1,0,1,2
}

function WebStorageUtil() {
	
	// Manage table name ==> key name constants in Web-Storage : private method
	var schema = new function() {
		this.updated_time = "updated_time";
		/*
		 * Format: "updated_time" : "2016-12-31T23:59:59.000Z" "service_users" : [
		 * "1234567890-1111","1234567890-2222"....]
		 *  - Manage service user key
		 */
		this.SERVICE_USER = "service_users";

		/*
		 * Format: "service_users" : [
		 * "1234567890-1111-1","1234567890-2222-2"....] - Manage service user
		 * history key
		 */
		this.SERVICE_USER_HISTORY = "service_users_history";

		/*
		 * Format: "service_users" : [
		 * "1234567890-1111-T","1234567890-2222-T"....] - Manage service user
		 * temporary key
		 */
		this.SERVICE_USER_TEMPORARY = "service_users_temporary";

	};

	this.getSchema = function() {
		return schema;
	}
	// set up rehabili database
	this.setupDatabase = function() {
		try {
			var isStorageSetup = new function() {
				var service_user_table = localStorage
						.getItem(schema.SERVICE_USER);
				if (!service_user_table) {
					return false;
				}

				return true;
			}

			if (isStorageSetup) {
				// Initialize SERVICE_USER table
				var table_service_user = localStorage
						.getItem(schema.SERVICE_USER);
				if (!table_service_user) {
					var SERVICE_USER = {
						temporary_index:0,
						updated_time : "",
						service_users : []
					// array key of service user: care facility id - service
					// user number
					};
					localStorage.setItem(schema.SERVICE_USER, JSON
							.stringify(SERVICE_USER));
				}

				// Initialize SERVICE_USER_TEMPORARY table
				var table_service_user_temporary = localStorage
						.getItem(schema.SERVICE_USER_TEMPORARY);
				if (!table_service_user_temporary) {
					var SERVICE_USER_TEMPORARY = {

						service_users : []
					// array key of service user: care facility id + service
					// user number
					};
					localStorage.setItem(schema.SERVICE_USER_TEMPORARY, JSON
							.stringify(SERVICE_USER_TEMPORARY));
				}

				// Initialize SERVICE_USER_HISTORY table
				var table_service_user_history = localStorage
						.getItem(schema.SERVICE_USER_HISTORY);
				if (!table_service_user_history) {
					var SERVICE_USER_HISTORY = {
						service_users : []
					// array key of service user: care facility id - service
					// user number - history number
					};
					localStorage.setItem(schema.SERVICE_USER_HISTORY, JSON
							.stringify(SERVICE_USER_HISTORY));
				}

//				console.log("Set database success!");
			} else {

//				console.log("Rehabili storage ready!");
			}

		} catch (err) {
			console.log("Initialize database errors :" + err);
			return err;
		}
	}

}

