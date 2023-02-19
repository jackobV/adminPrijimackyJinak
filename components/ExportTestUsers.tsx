import {useEffect, useState} from "react";
import PocketBase from "pocketbase";
import { jsPDF } from "jspdf";
import CreatePDFListOfUsers from "@/CreatePDFListOfUsers";
type User = {
    name:string
    surname:string
    email:string
}

export default function ExportTestUsers(){
    const [data, setData] = useState(Array)
    const [selectedDate,setSelectedDate] = useState("")
    const [usersInDate,setUsersInDate] = useState(Array)
    const pb = new PocketBase('https://admin.deleno.cz');
    function formatDate(props:string){
        const dny = [
            "pondělí",
            "úterý",
            "středa",
            "čtvrtek",
            "pátek",
            "sobota",
            "neděle",
        ]
        const date = new Date(props)
        return (date.getUTCDate() + "." + (date.getMonth() + 1) + " " );
    }
    pb.autoCancellation(false)
    useEffect(()=>{
        const fetchData = async () =>{
            const records = await pb.collection('price_item_test').getFullList(100 /* batch size */, {
                sort: 'created',
            });
            setData(records)
        };
        try{
            fetchData().then(r => console.log(r));
        } catch (e){
            console.log(e);
        }

    },[])
    useEffect(()=>{
        if(selectedDate != "") {
            const fetchData = async () => {
                const records = await pb.collection('price_item_test').getOne(selectedDate,{
                    expand: 'zakaznici',
                })
                console.log(records)
                // @ts-ignore
                setUsersInDate(records.expand.zakaznici);
            };
            try {
                fetchData().then(r => console.log(r));
            } catch (e) {
                console.log(e);
            }
        }

    },[selectedDate])
    function GenerateUserList(){
        // @ts-ignore
        const list:User[] = []
        for(let i = 0; i < usersInDate.length; i++){
            let toBePushed = {
                // @ts-ignore
                name:usersInDate[i].jmeno,
                // @ts-ignore
                surname:usersInDate[i].prijmeni,
                // @ts-ignore
                email:usersInDate[i].email,
            }
            list.push(toBePushed);
        }
        const listGenerated = CreatePDFListOfUsers(list);
        listGenerated.save("list")
        console.log(listGenerated)
    }
return(
    <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-12  bg-black text-white">
            <div className="col-span-2 px-2">Datum testu</div>
            <div className="col-span-10 pl-10 grid grid-cols-5">
                <div>Jméno</div>
                <div>Přijímení</div>
                <div>Email</div>


            </div>

        </div>
        <div className="grid grid-cols-12">
            <div className="col-span-2 flex flex-col">
                {data.map((datum:any)=>(
                    <div key={datum.id} onClick={(()=>(setSelectedDate(datum.id)))}>
                        {selectedDate === datum.id ?
                        <div className="py-2 border border-black bg-black text-white px-2">
                            {formatDate(datum.datum)}
                        </div>
                            :
                        <div className="py-2 border border-black px-2 hover:bg-gray-300 cursor-pointer">
                            {formatDate(datum.datum)}
                        </div>
                        }
                    </div>
                ))}
            </div>
            <div className="col-span-10">{
                usersInDate ?
                    <div className="flex flex-col h-full justify-between">
                    <div className="flex flex-col w-full  [&>*:nth-child(odd)]:bg-gray-50 [&>*:nth-child(even)]:bg-gray-300">

                        {
                            usersInDate.map((user:any)=>(
                                <div key={user.id} className="grid grid-cols-5  pl-10 py-2">
                                    <div className="">{user.prijmeni}</div>
                                    <div className="">{user.prijmeni}</div>
                                    <div className="">{user.email}</div>
                                </div>
                            ))

                        }</div>
                        <div className="bg-gray-600 w-fit text-white py-2 mt-10 self-end px-2 hover:bg-black cursor-pointer" onClick={GenerateUserList}>Stáhnout list</div>

                    </div>
                    :
                    <div>Nikdo zatím není na tento termín přihlášený</div>
            }</div>
        </div>
    </div>
)
}