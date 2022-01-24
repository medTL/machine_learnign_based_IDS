
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
    function ListFiltered()
    {
        return filter.page === 0 || filter.attack !== "" || filter.fromDate === null || filter.toDate === null;
    }
   
    useEffect(  () => {

        setLoading(true)
        setError(false)
        let cancel
        async function fetchData()
        {
            const request =  await getRecords(filter, cancel);
            if(request.data && request.data.error === null)
            {
                if(ListFiltered())
                {
                    setRecords(request.data.data); 
                } else {
                    setRecords(prevData =>{
                        return prevData.concat(request.data.data);
                    });
                }
            
                setHasMore(Records.length < count)
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
          console.log("ID CHANGED")
        async function DeleteRecordHandler() {
            if(recordId !== null)
            {
                console.log(recordId);
                const deleteRequest = await DeleteRecord(recordId)
                
                if (deleteRequest.data.error === null) {
                  toast.success("Record deleted successfully!")
                  setRecords(prevRecords => {
                      return prevRecords.filter(x => x.id !== recordId);
                  })
                } else {
                  toast.error("Record delete failed!")
                }
            }
           
          }
          DeleteRecordHandler()
      }, [recordId])
    
      return { loading, error, Records, count, hasMore  }
}
