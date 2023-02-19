import Image from "next/image";
import {useEffect, useState} from "react";
import PocketBase from "pocketbase";
export default function LoginForm2(){
    const [email, setEmail] = useState(String);
    const [password, setPassword] = useState(String);
    const [appstate,setAppstate] = useState(<div></div>)
    const [step,setStep] = useState(0);
    const pb = new PocketBase('https://admin.deleno.cz');
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await pb.admins.authWithPassword(email,password);
            console.log(response)
            setStep(1);
        } catch (error) {
            console.log(error)
            setAppstate(
                <div className="w-full h-20 bg-red-400 rounded-2xl flex flex-col items-center place-content-center text-red-100 font-bold tracking-tighter text-center">
                    <p>Vyskytla se chyba... Jste si jisti, že jsou Vaše údaje správné?</p>
                </div>
            )
        }
    }
    useEffect(()=>{if(pb.authStore.isValid){
        setStep(1)
    }},[])
    useEffect(()=>{
        if(step === 1){
            console.log("hoo")
        }
    },[step])
    const handleLogout = (()=>{
        pb.authStore.clear()
        setStep(0);
    })


    return(
        <div className="flex flex-col h-screen w-full overflow-hidden overscroll-none items-center justify-center">
                <div className="flex flex-col w-96 ">
                    <div className="text-center pb-10 text-2xl font-bold tracking-tight">
                        Přihlásit se
                    </div>
                    <div className="hidden">social login</div>
                    <div className="">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-y-4">
                                <input className="rounded-xl w-full border-gray-400 " type="email" id="email" name="email" placeholder="email" onChange={e => setEmail(e.target.value)} required={true}  />
                                <input className="rounded-xl w-full border-gray-400 " type="password" id="heslo" name="heslo" placeholder="heslo" onChange={e => setPassword(e.target.value)} required={true}  />
                                {step === 1 ?
                                    <div>Aplikace</div>
                                    :
                                    <button className="rounded-xl w-full bg-black text-white py-3 mt-2 hover:bg-gray-500" type="submit">Přihlásit se</button>
                                }

                            </div>
                        </form>
                    </div>
                </div>
        </div>
    )
}