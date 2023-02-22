import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloClient, InMemoryCache,ApolloProvider } from "@apollo/client"
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import MyBooksContextProvider from './context/MyBooksProvider';

// Initialize the Apollo Client

const apikey = "beiwanglizhen::stepzen.net+1000::5d93219cb9e12abb62a17adfcf2ac3133e89434a1af7fe6dda70dce006e35b12"

const client = new ApolloClient({
  uri:"https://beiwanglizhen.stepzen.net/api/cranky-whippet/__graphql",
  headers:{
    Authorization: `Apikey ${apikey}`
  },
  cache: new InMemoryCache(),
})

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <MyBooksContextProvider>
            <Navigation colorScheme={colorScheme} />
          </MyBooksContextProvider>
        </ApolloProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
