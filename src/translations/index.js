import i18n from 'i18next';
import { initReactI18next  } from 'react-i18next';
import translations from './resources';

function convertToResouce(data){
  let resources = {}
  Object.keys(data).forEach((translation)=>{
    let keys = Object.keys(data[translation]);
    keys.forEach((key)=>{
      if(! (key in resources) ){
        resources[key] = {['translation']:{}};
      }
      resources[key]['translation'][translation] = data[translation][key];
    })
  })
  return resources;
}

console.log(convertToResouce(translations));
i18n
.use(initReactI18next)
.init({
  fallbackLng: 'sk',
  lng: 'sk',
  resources: convertToResouce(translations),

  interpolation: {
    escapeValue: false,
  }
});
export default i18n;
