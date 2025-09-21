
import { BASE_URL } from "@/api/BaseUrl";

export async function MasterGet(endpoint){
    let response=await fetch(`${BASE_URL}get_master/`+endpoint,{
  method: "GET",
   credentials: "include",
})
    let data=await response.json();
    return data.data
}

export async function MasterAPI(methode="GET",endpoint,payload={}){
   let response=await fetch(`${BASE_URL}`+endpoint,{
  method: methode,
  body:JSON.stringify(payload),
   credentials: "include",
})
    let data=await response.json();
  return data
}



export async function GetFromAPI(endpoint){
 let response=await fetch(`${BASE_URL}`+endpoint,{
    method: "GET",
   credentials: "include",
 })
 let data=await response.json();
 console.log(data)

}