
// export const BASE_URL = "https://api-wineshippingerp.prudent360.in/api/v1/"; 
export const BASE_URL = "http://localhost:3000/api/v1/"; 

  export function globalsearchstate(modalstate,className,callback){
  if (modalstate == true) {
        setTimeout(() => {
          $(className).chosen();
           $(className).on("change",function(e){
            callback(e.target.value)
            
                     
      })
        }, 500)
  }

}





  
  export function globalsearchcountry(modalstate,classNamecountry,classNamestate,callback){
   
      if (modalstate == true) {
        setTimeout(() => {
          $(classNamecountry).chosen();
                      $(classNamestate).chosen();

           $(classNamecountry).on("change",function(e){
                     callback(e.target.value)
                      $(classNamestate).chosen("destroy");
                     
      })
        }, 500)
      }
  }


export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_USER: "/users/me",
  UPDATE_USER: "/users/update",
};

export type ApiEndpoints = keyof typeof API_ENDPOINTS;

export const getApiUrl = (endpoint: ApiEndpoints): string => {
  return `${BASE_URL}${API_ENDPOINTS[endpoint]}`;
};
