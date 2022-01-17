
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { CountRecords, DeleteRecord, getRecords } from '../api/apiService'

export default function useScrollHandlerHook(filter, recordId) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [Records, setRecords] = useState([])
    const [count, setCount] = useState(0)
    const [hasMore, setHasMore] = useState(false)
   useEffect(() => {
       async function fetchCount()
       {
           const request =  await CountRecords();
           if(request.data.error === null)
           {
               setCount(request.data.data);
           } else {
            setCount(0);
           }
       }
       fetchCount();
   }, [])
    useEffect(  () => {

        setLoading(true)
        setError(false)
        let cancel
        async function fetchData()
        {
            const request =  await getRecords(filter, cancel);
            if(request.data && request.data.error === null)
            {
                setRecords(prevData =>{
                    return prevData.concat(request.data.data);
                });
                setHasMore(request.data.data.length > 0)
                setLoading(false)
            } else {
                setLoading(false)
                setError(true)
            }
          
        }
        fetchData();
      // return () => cancel();
      }, [filter])

      useEffect(() => {
        async function DeleteRecordHandler() {
            if(recordId !== null)
            {
                const deleteRequest = await DeleteRecord(recordId)
                
                if (deleteRequest.data.error === null) {
                  toast.success("Record deleted successfully!")
                } else {
                  toast.error("Record delete failed!")
                }
            }
           
          }
          DeleteRecordHandler()
      }, [recordId])
    
      return { loading, error, Records, count, hasMore  }
}
