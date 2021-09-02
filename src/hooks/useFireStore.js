import React from "react"
import {db} from "../firebase/config"


export const useFireStore = (collection, condition) => {

    const [document, setDocument] = React.useState([]);
    
    React.useEffect(() => {
        let collectionRef = db.collection(collection).orderBy('createdAt');

        if(condition) {

            if(!condition.compareValue || !condition.compareValue.length) {
                return;
            }
            collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);

        }
        const unsubscribed = collectionRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                ...doc.data(), 
                id: doc.id,
            }))
            console.log({data, snapshot , docs : snapshot.docs, condition})
            setDocument(data);
        })

        return unsubscribed;

    },[collection, condition])


    return document;

}
