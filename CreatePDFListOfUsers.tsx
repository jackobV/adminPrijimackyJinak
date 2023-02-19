import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
type User = {
    name:string
    surname:string
    email:string
}

export default function CreatePDFListOfUsers(props:User[]){
    console.log(props);
    const doc = new jsPDF()
    const bodyToBePassed = []
    for (let i = 0;i<props.length;i++){
        bodyToBePassed.push([props[i].name,props[i].surname,props[i].email])
    }
    autoTable(doc, {
        head: [['Jméno', 'Prijímení', 'Email']],
        body:
            bodyToBePassed
            // ...

    })
    return(doc)

}