
import { BASE_URL } from "@/api/BaseUrl";

export async function MasterGet(endpoint){

    let response=await fetch(`${BASE_URL}get_master/`+endpoint,{
  method: "GET",
})
    let data=await response.json();
    return data.data


}
export async function GetFromAPI(endpoint){
 let response=await fetch(`${BASE_URL}`+endpoint)
 let data=await response.json();
 console.log(data)

}