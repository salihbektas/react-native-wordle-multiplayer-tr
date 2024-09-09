import dbRootRef, { ServerType } from "@/utils/firebase";
import { get } from "firebase/database";
import { useState } from "react";


export default function useFirebase() {

  const [isLoading, setIsloading] = useState<boolean>(true)
  const [serverList, setServerList] = useState<ServerType[]>([])

  function refreshServerList() {
    setIsloading(true)
    get(dbRootRef).then((snapshot) => {
      if (snapshot.exists()) {
        setServerList(
          Object.keys(snapshot.val())
          .filter(item => snapshot.val()[item].isWaiting)
          .map(item => snapshot.val()[item]))
      } else {
        setServerList([])
        console.log("No data available");
      }
      setIsloading(false)
    }).catch((error) => {
      console.error('getServerList', error);
      setIsloading(false)
    });
  }
  
  return{
    isLoading,
    serverList,
    refreshServerList,

  }
}