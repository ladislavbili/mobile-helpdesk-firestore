
/**
 * Processes errors in actions
 * @param  {function} dispatch dispatches error actions
 */
export const processError= (response,dispatch)=>{
  if(response.status===401){
    //NOPE
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

export const snapshotToArray = (snapshot) => {
  if(snapshot.empty){
    return [];
  }
  return snapshot.docs.map((item)=>{
    return {id:item.id,...item.data()};
  })
}
