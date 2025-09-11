import { BASE_URL } from "@/api/BaseUrl";

export async function addpurchase(id__,status_){

    let response=await fetch(`${BASE_URL}addpurchase/${id__}`,{
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include"
  ,
   body: JSON.stringify({
    status:status_
  })
})
    let data=await response.json();
    return data.data
}