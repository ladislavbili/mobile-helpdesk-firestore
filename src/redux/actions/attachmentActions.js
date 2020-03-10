import { SET_ATTACHMENTS, ADD_ATTACHMENT, SET_ATTACHMENTS_LOADING, DELETE_ATTACHMENT, EDIT_ATTACHMENT,CLEAR_ATTACHMENTS } from '../types'
import { UPLOAD_FILE,GET_LOC, GET_FILE } from '../urls';
import {processError} from '../../helperFunctions';

export const uploadFile = (file,token) => {
  return (dispatch) => {
    let formData = new FormData();
    formData.append("file", file);
    fetch(UPLOAD_FILE,{
      headers: {
        'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      body:formData,
    })
    .then((response)=>{
      response.json().then((response)=>{
            if(!response.ok){
              processError(response,dispatch);
              return;
            }
            let attachment = {id:response.data.slug,file:{name:file.name,size:file.size}};
            dispatch({type: ADD_ATTACHMENT, attachment});
            //zaciatok nacitavania attachmentov
              fetch(GET_LOC+attachment.id+'/download-location', {
                method: 'get',
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                }
              }).then((response2)=>{
                if(!response2.ok){
                  processError(response3,dispatch);
                  return;
                }

                response2.json().then((data2)=>{
                fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
                  method: 'get',
                  headers: {
                    'Authorization': 'Bearer ' + token,
                  }
                }).then((response3) =>{
                  if(!response3.ok){
                    processError(response3,dispatch);
                    return;
                  }
                  attachment.url=response3.url;
                  dispatch({type: EDIT_ATTACHMENT, attachment});
                }).catch(function (error) {
                  console.log(error);
                });
              }).catch(function (error) {
                console.log(error);
              })}
            ).catch(function (error) {
              console.log(error);
            });
            //koniec nacitavania attachmentov
        })})
        .catch(function (error) {
          console.log(error);
        });
  }
};


export const removeFile = (id,token) => {
  return (dispatch) => {
    dispatch({ type: DELETE_ATTACHMENT, id });
  }
};

export const clearAttachments = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_ATTACHMENTS });
  }
};
