
// CRUD: Create.
// Posts an entity. "type" must be specified in the object passed in by
// the first parameter.
function postEntity(data, successCB, errorCB) {
    CLIENT.createEntity(data, function(error, result) {
		if (error) {
			errorCB();
		}
		else {
			successCB(result);
		}
    });
}

// CRUD: Read Many.
// Gets all the entitites of a specified type where the specified attribute
// matches the specified value.
// The success callback has one argument that refers to a list of the retrieved entities.
function getEntities(type, attribute, value, typeAttributes, successCB, errorCB) {
    // If the attribute is a uuid, the value is not wrapped with single quotes for the Apigee query,
    // because uuids are not considered strings by Apigee.
    if(attribute.indexOf("uuid") == -1) {
        value = "'" + value + "'";
    }

    var entityList = [];
	var queryObj = {
		client:CLIENT,
		type:type,
		qs:{
			// This is similar to SQL, but it is Apigee's simplified version. Not all valid SQL queries will work.
			ql:"select * where " + attribute + " = " + value + " order by created desc",
			// This gets 999 results (the maximum allowed in one query) instead of the default 10. TODO: Add paging.
			limit:999
		}
	}
				   
	var entities = new Apigee.Collection(queryObj);

	entities.fetch(
		function() {
			while ( entities.hasNextEntity() ) {
				var currentEntity = entities.getNextEntity();
                var currentListItem = {};

                typeAttributes.forEach( function(attribute) {
                	//if(attribute != 'image_data') {
                    	currentListItem[attribute] = currentEntity.get(attribute);
                	//}
                });
                //console.log(currentListItem);
                entityList.push(currentListItem);
			}
            successCB(entityList);
		},
		function() {
			errorCB();
		}
	);
}

// CRUD: Read One.
// Gets an entity of a specified type and uuid.
// The success callback has one argument that refers to the retrieved entity.
function getEntity(type, uuid, typeAttributes, successCB, errorCB) {
    var entity = {};

    var queryObj = {
		type:type,
		uuid:uuid
	}

    CLIENT.getEntity(queryObj, function (error, result) { 
		if (error) {
			errorCB();
		}
        else { 
            typeAttributes.forEach( function(attribute) {
                    entity[attribute] = result.get(attribute);
            });         

            successCB(entity);
		}
	});
}

// CRUD: Update.
// Modifies an entity. "type" and "uuid" must be specified in the object passed in by
// the first parameter.
function modifyEntity(data, successCB, errorCB) {
	
   var updateObj = {
        'client':CLIENT,
        'data':data
    };
	console.log(updateObj);
	
    var updateEntity = new Apigee.Entity(updateObj);

	console.log(updateEntity);
	
    updateEntity.save(function (error, result) {
        if (error) { 
			errorCB();
        }
        else { 
	        successCB();
        }
    });
	//$("#m").append(updateEntity);
}

// CRUD: Delete one.
function deleteEntity(type, uuid, successCB, errorCB) {
    var deleteData = {
	    client:CLIENT,
	    data:{
            "type":type,
	        "uuid":uuid
	    }
    }

    var delEntity = new Apigee.Entity(deleteData);

    delEntity.destroy(function (error, result) {
        if (error) { 
           errorCB();
        }
        else {
	        successCB(uuid);
        }
    });
}

// CRUD: Delete many.
function deleteEntities(type, attribute, value, successCB, errorCB) {
    var entityList = [];
	var deleteQuery = {
		endpoint:type,
        method:"DELETE",
		qs:{
			// This is similar to SQL, but it is Apigee's simplified version. Not all valid SQL queries will work.
			ql:"select * where " + attribute + " = " + value + " order by created desc",
			// This gets 999 results (the maximum allowed in one query) instead of the default 10. TODO: Add paging.
			limit:999
		}
	}
				   
	CLIENT.request(deleteQuery, function (error, result) {
	    if (error) { 
	        errorCB();
	    } else { 
		    successCB();
	    }
    });
}

// CRUD: Read Many.
// Gets all the entitites of a specified type where the specified "where" statement
// matches the specified query string.
// The success callback has one argument that refers to a list of the retrieved entities.
function getSpecifiedEntities(type, query, typeAttributes, successCB, errorCB) {

    var entityList = [];
	var queryObj = {
		client:CLIENT,
		type:type,
		qs:{
			// This is similar to SQL, but it is Apigee's simplified version. Not all valid SQL queries will work.
            ql : query,
			// This gets 999 results (the maximum allowed in one query) instead of the default 10. TODO: Add paging.
			limit:999
		}
	}
				   
	var entities = new Apigee.Collection(queryObj);

	entities.fetch(
		function() {
			while ( entities.hasNextEntity() ) {
				var currentEntity = entities.getNextEntity();
                var currentListItem = {};

                typeAttributes.forEach( function(attribute) {
                    currentListItem[attribute] = currentEntity.get(attribute);
                });

                entityList.push(currentListItem);
			}
            successCB(entityList);
		},
		function() {
			errorCB();
		}
	);
}

// CRUD: Read Many.
// Gets all the entitites of a specified type where the specified attribute
// matches the specified query string.
// The success callback has one argument that refers to a list of the retrieved entities.
function getSpecifiedAttributesFromEntity(type, query, typeAttributes, successCB, errorCB) {

	var entityList = [];

	var queryObj = {
		endpoint : type,
		method: "GET",
		qs : {ql : query, limit: 999}
	}

	CLIENT.request(queryObj, function(error, response) {
		if (error) {
			errorCB();
		} else {

			response.list.forEach( function(entity) {
		        var currentListItem = {};
		        var i = 0;
		        typeAttributes.forEach( function(attribute) {
		            currentListItem[attribute] = entity[i++];
		        });
		        entityList.push(currentListItem);
			});
		    successCB(entityList);
		}
	});
}







