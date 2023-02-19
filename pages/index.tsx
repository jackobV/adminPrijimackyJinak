import PocketBase from "pocketbase";
import {useEffect, useState} from "react";
import ExportTestUsers from "@/components/ExportTestUsers";
export default function Home() {
  const pb = new PocketBase('https://admin.deleno.cz');
  const [authenticate, setAuthenticated] = useState(false);
  useEffect(()=>{
    if(pb.authStore.isValid){
      console.log("nice");
      setAuthenticated(true)
    }else{
      console.log("not")
    }
  },[])
  return (
    <>
      {authenticate === true ?
      <div>
        <div className="">
          <ExportTestUsers />
        </div>
      </div>
          :
          <div>
            <a className="" href="/login">Please login</a>
          </div>
      }
    </>
  )
}
