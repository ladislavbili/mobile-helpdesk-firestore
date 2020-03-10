import {LOGIN_LOGOUT} from './redux/types';

/**
 * Processes errors in actions
 * @param  {function} dispatch dispatches error actions
 */
export const processError= (response,dispatch)=>{
  if(response.status===401){
    dispatch({ type: LOGIN_LOGOUT });
  }
  response.text().then((data)=>{
    console.log(JSON.parse(data).message);
  });
}

/**
  * Format's javascript timestamp to slovak format of the datetime
  * @param  {int} time Timestamp/javascript format
  * @return {string} Visual format of the date
*/
export const formatDate = (time) => {
  let date = new Date(time);
  if(isNaN(date.getTime())){
    return '';
  }
  return date.getHours() + ":" + ((date.getMinutes()<10)? "0" + date.getMinutes() : date.getMinutes()) + " " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
};

/**
  * Check's if the input string is an acceptable integer and return's it in acceptable format
  * @param  {string} input integer
  * @return {string}       return's either false, if the string is an unacceptable integer or return's correctly formated integer in string
*/
export const processInteger = (input)=>{
  if(input==''){
    return '0'
  }
  if(!/^\d*$/.test(input)){
    return false;
  }
  if(input.length!=1 && input[0]=='0'){
    return input.substring(1);
  }
  else{
    return input;
  }
}
/**
  * Recieves an javascript object, that is broken down and transformed into x-www-form-urlencoded
  * @param  {object} input object containing all information required by the REST API
  * @return {string}       x-www-form-urlencoded input object in a string form
*/
export const processRESTinput = (input)=>{
  if(!input){
    return '';
  }
  let result='';
  for ( item in input) {
    if(item && input[item] && input[item]!='' ){
      result+=(item+'='+input[item]+'&');
    }
  }
  return result.substring(0,result.length-1);
}

/**
  * Recieves an javascript object, that is broken down and transformed into x-www-form-urlencoded, where every element has selected prefix
  * @param  {object} input object containing all information required by the REST API
  * @param  {string} prefix prefix added before each element
  * @return {string}       x-www-form-urlencoded input object in a string form with a prefix
*/
export const processDataWithPrefix = (input,prefix)=>{
  if(!input){
    return '';
  }
  let result='';
  for ( item in input) {
    if(item && input[item] && input[item]!='' ){
      result+=(prefix+'['+item+']='+input[item]+'&');
    }
  }
  return result.substring(0,result.length-1);
}
/**
  * Creates string containing all major information about the user's name and e-mail, easily usable for searching.
  * @param  {user} item Object containing user information (same as REST API's user response)
  * @return {string}      Return's lower case string used for search
*/
export const compactUserForSearch = (item)=>{
  return ((item.email?item.email:'')+ (item.name?item.name:'')+' '+ (item.surname?item.surname:'')+ ' ' + (item.name?item.name:'')).toLowerCase();
}

/**
 * Checks if this email is correct
 * @param  {string}  email User entered e-mail
 * @return {Boolean}       If its correct
 */
export const isEmail = (email) => {
  return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
}

/**
 * From attributes it creates new object, that contains empty custom attributes
 * @param  {object} attributes Contains informations about all of the attributes that should be created
 * @return {object}            Created object that contains empty attributes
 */
export const initialiseCustomAttributes=(attributes)=>{
  let data = {};
  attributes.map(attribute => {
    let value = "";
    switch (attribute.type) {
      case "input":
        value = "";
        break;
      case "text_area":
        value = "";
        break;
      case "simple_select":
        value = attribute.options[0];
        break;
      case "multi_select":
        value = [];
        break;
      case "date":
        value = null;
        break;
      case "decimal_number":
        value = "0";
        break;
      case "integer_number":
        value = "0";
        break;
      case "checkbox":{
        value = false;
        break;
      }
      default:{
        value = "null";
      }
    }
    data[attribute.id] = value;
  });
  return data;
}

/**
 * Transforms savedAttributes/current state of attributes into processed object that is acceptable as JSON by API
 * @param  {Object} savedAttributes    Current state of custom attributes
 * @param  {Object} originalAttributes Object containing informations about every custom attribute
 * @return {Object}                    Changed object that is acceptable by API
 */
export const processCustomAttributes = (savedAttributes,originalAttributes) => {
  let returnAttributes={};
  for (let key in savedAttributes) {
    let attribute = originalAttributes[originalAttributes.findIndex(item => item.id == key)]; //from ID find out everything about the field
    switch (attribute.type) {
      case "multi_select": {
        returnAttributes[key]=savedAttributes[key].map(item =>item.id);
        break;
      }
      case "date":{ //date should be formatted into miliseconds since 1970, divided by 1000 because of PHP/Javascript difference
        returnAttributes[key] = savedAttributes[key] === null ?  "null":Math.ceil(savedAttributes[key] / 1000);
          break;
        }
      case "checkbox":{
        returnAttributes[key] = savedAttributes[key]?"true":"false";
        break;
      }
      case "input":{
        if (savedAttributes[key] === "") {
          returnAttributes[key] = "null";
        }
        else{
          returnAttributes[key] = savedAttributes[key];
        }
        break;}
      case "text_area":{
        if (savedAttributes[key] === "") {
          returnAttributes[key] = "null";
        }
        else{
          returnAttributes[key] = savedAttributes[key];
        }
        break;}
      case "decimal_number":{
        if (isNaN(parseFloat(savedAttributes[key]))) {
          returnAttributes[key] = "null";
        }
        else{
          returnAttributes[key] = savedAttributes[key];
        }
        break;}
      case "integer_number":{
        if (isNaN(parseFloat(savedAttributes[key]))) {
          returnAttributes[key] = "null";
        }
        else{
          returnAttributes[key] = savedAttributes[key];
        }
        break;}
      default:{
        returnAttributes[key] = savedAttributes[key];
        break;
      }
    }
  }
  return returnAttributes;
}

/**
 * Checks if custom attribute object contains any attribute that is required and has null value
 * @param  {Object} attributes         Current state of custom attributes, that needs to be checked
 * @param  {Object} originalAttributes Contains informations about all of the attributes that should be checked
 * @return {Boolean}                    Return if conditions are met
 */
export const containsNullRequiredAttribute = (attributes,originalAttributes)=>{
  for (let key in attributes) {
    let original = originalAttributes[originalAttributes.findIndex((item) => (item.id.toString() === key))]; //from ID find out everything about the field
    if(attributes[key]==='null' && original.required && original.is_active){
      return true;
    }
  }
  return false;
}

/**
 * Adds to cuttent state of custom attributes already existing values and overwrites them
 * @param  {object} currentAttributes        Current state of attributes
 * @param  {object} existingCustomAttributes Saved state of attributes
 * @param  {object} originalAttributes       Contains informations about all of the attributes that should be processed
 * @return {object}                          Returns new state of attributes, overwritten by existing ones
 */
export const importExistingCustomAttributesForCompany=(currentAttributes,existingCustomAttributes,originalAttributes)=>{
  let keys=Object.keys(currentAttributes);
  let newAttributes= {...currentAttributes};
  existingCustomAttributes.map(attribute => {
    if (keys.includes(attribute.companyAttribute.id.toString())) {
      let original = originalAttributes[
        originalAttributes.findIndex(
          item => item.id == attribute.companyAttribute.id
        )
      ];
      if(original.type==="date"){
        let date = new Date(attribute.dateValue * 1000);
        if (isNaN(date)||attribute.dateValue===null) {
          newAttributes[attribute.companyAttribute.id] = null;
        } else {
          newAttributes[attribute.companyAttribute.id] = attribute.dateValue * 1000;
        }
      }
      else if(original.type==="checkbox"){
        newAttributes[attribute.companyAttribute.id] = attribute.boolValue;
      }else{
        if (original.type === "multi_select") {
          if (attribute.value === null) {
            newAttributes[attribute.companyAttribute.id] = [];
          }
          else{
            let selected = [];
            attribute.value.map(val =>
              selected.push({id:val,title:val})
            );
            newAttributes[attribute.companyAttribute.id] = selected;
          }
        } else {
          newAttributes[attribute.companyAttribute.id] = attribute.value!==null?attribute.value.toString():'';
        }
      }
    }
  });
  return newAttributes;
}


/**
 * Adds to cuttent state of custom attributes already existing values and overwrites them
 * @param  {object} currentAttributes        Current state of attributes
 * @param  {object} existingCustomAttributes Saved state of attributes
 * @param  {object} originalAttributes       Contains informations about all of the attributes that should be processed
 * @return {object}                          Returns new state of attributes, overwritten by existing ones
 */
export const importExistingCustomAttributesForTask=(currentAttributes,existingCustomAttributes,originalAttributes)=>{
  let keys=Object.keys(currentAttributes);
  let newAttributes= {...currentAttributes};
  existingCustomAttributes.map(attribute => {
    if (keys.includes(attribute.taskAttribute.id.toString())) {
      let original = originalAttributes[
        originalAttributes.findIndex(
          item => item.id == attribute.taskAttribute.id
        )
      ];
      if(original.type==="date"){
        let date = new Date(attribute.dateValue * 1000);
        if (isNaN(date)||attribute.dateValue===null) {
          newAttributes[attribute.taskAttribute.id] = null;
        } else {
          newAttributes[attribute.taskAttribute.id] = attribute.dateValue * 1000;
        }
      }
      else if(original.type==="checkbox"){
        newAttributes[attribute.taskAttribute.id] = attribute.boolValue;
      }else{
        if (original.type === "multi_select") {
          if (attribute.value === null) {
            newAttributes[attribute.taskAttribute.id] = [];
          }
          else{
            let selected = [];
            attribute.value.map(val =>
              selected.push({id:val,title:val})
            );
            newAttributes[attribute.taskAttribute.id] = selected;
          }
        } else {
          newAttributes[attribute.taskAttribute.id] = attribute.value!==null?attribute.value.toString():'';
        }
      }
    }
  });
  return newAttributes;
}
