import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { gql,useQuery,useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import BookItem from '../components/BookItem';


const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen() {

  const [search,setSearch] = useState("React");
  const [provider,setProvider] = useState<"googleBooksSearch"|"openLibrarySearch">("googleBooksSearch")

  const [runQuery,{ data,loading,error }] = useLazyQuery(query);

  const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWow3WRIYLU4FE5u-e7sAZW7dRKVz4FebjwaD1GJuggQQu4ww4ZSCsFb8lwZMftpFOWp4&usqp=CAU"

    // Parse the book
    const parseBook = (item:any):Book=>{
      if(provider==="googleBooksSearch"){
        return { 
          title: item?.volumeInfo.title, 
          image: item?.volumeInfo.imageLinks?.thumbnail || image,
          authors: item?.volumeInfo.authors,
          isbn: item?.volumeInfo.industryIdentifiers?.[0]?.identifier
        }
      }else{
        return{
          title:item.title,
          image: item.cover_edition_key?`https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`:image,
          authors:item.author_name,
          isbn:item.isbn?.[0]
        }
      }
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput value={search} onChangeText={setSearch} placeholder='Search...' style={styles.input}/>
        <Button title='Search' onPress={()=>runQuery({variables:{ q:search }})}/>
      </View>
      <View style={styles.tabs}>
        <Text style={provider==="googleBooksSearch"?{fontWeight:'bold',color:'royalblue'}:{}} onPress={()=>setProvider("googleBooksSearch")}>Google Books</Text>
        <Text style={provider==="openLibrarySearch"?{fontWeight:'bold',color:'royalblue'}:{}} onPress={()=>setProvider("openLibrarySearch")}>Open Library</Text>
      </View>
      {error && 
        <>
          <Text>Fetching Error</Text>
          <Text>{error.message}</Text>
        </>
      }
      {loading && <ActivityIndicator style={{alignSelf:'center'}}/>}
      <FlatList
         data={provider==="googleBooksSearch" ? data?.googleBooksSearch?.items : data?.openLibrarySearch?.docs || []}
         showsVerticalScrollIndicator = {false}
         renderItem={({item})=><BookItem book={parseBook(item)}/>}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header:{
    flexDirection:'row',
    padding:5,
    alignItems:'center'
  },
  input:{
    flex:1,
    borderWidth:1,
    borderColor:"gainsboro",
    borderRadius:5,
    padding:3,
    marginVertical:5,
    borderBottomRightRadius:0,
    borderTopRightRadius:0
  },
  tabs:{
    flexDirection:'row',
    justifyContent:'space-around',
    height:50,
    alignItems:'center'
  }
});
