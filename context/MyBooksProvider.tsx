import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type MyBooks={
    addBookToggle:(book: Book)=>void,
    isBookSaved:(book: Book)=>boolean,
    savedBooks:Book[]
}

export const MyBooksContext = createContext<MyBooks>({
    addBookToggle:()=>{},
    isBookSaved:()=>false,
    savedBooks:[]
});

type Props = {
    children:ReactNode
}


const MyBooksContextProvider = ({children}:Props)=>{
    const [savedBooks,setSavedBooks] = useState<Book[]>([]);
    const [loaded,setLoaded] = useState<boolean>(false);

    // At first Load the Data
    useEffect(()=>{
        loadData();
    },[])

    useEffect(()=>{
        if(loaded){
            persistData();
        }
    },[savedBooks])

    

    const compareBooks = (a:Book,b:Book)=>{
        return JSON.stringify(a) === JSON.stringify(b)
    }

    const isBookSaved = (book:Book)=>{
        return savedBooks.some((savedBook)=> compareBooks(savedBook,book));
    }

    const addBookToggle = (book:Book)=>{
        if(isBookSaved(book)){
            setSavedBooks(books=>books.filter((item)=>!compareBooks(item,book)))
        }else{
            setSavedBooks((books)=>[...books,book]);
        }
    }

    const persistData = async ()=>{
        await AsyncStorage.setItem("myBooksData",JSON.stringify(savedBooks))
    }

    const loadData = async ()=>{
        const myBooks = await AsyncStorage.getItem("myBooksData");
        setLoaded(true);
        if(myBooks){
            const items = JSON.parse(myBooks);
            setSavedBooks(items);
        }
    }
    
    return (
        <MyBooksContext.Provider value={{ addBookToggle,isBookSaved,savedBooks }}>
            {children}
        </MyBooksContext.Provider>
    )
}

export const useMyBooks = ()=>useContext(MyBooksContext);

export default MyBooksContextProvider
