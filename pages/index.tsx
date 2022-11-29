import { GetStaticProps, NextPage } from 'next'
import { Grid } from "@nextui-org/react";
import { Layout } from "../components/layouts";
import pokeApi from '../api/pokeApi';
import { PokemonListResponse, SmallPokemon } from '../interfaces';
import { PokemonCard } from '../components/pokemon';

interface Props{
    pokemons: SmallPokemon[];
}

const Home: NextPage<Props> = (props) => {
    
    //console.log(props)
    const { pokemons } = props; 
    return (
        <Layout title="Listado de Pokemons" >
            {/* <Button color={"gradient"}>Hola mundo</Button> */} 
            <Grid.Container gap={ 2 } justify='flex-start'>
                {
                    pokemons.map(pokemon => (
                        <PokemonCard key={ pokemon.id } pokemon={ pokemon } />
                        // <li key={ pokemon.id }>{ pokemon.id } - { pokemon.name }</li>
                    ))
                }
            </Grid.Container>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    
    const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151', {
        headers: {
            'accept-encoding': '*'
        }
    });
    //console.log(data)
    const pokemons: SmallPokemon[] = data.results.map((poke, idx) => ({
        ...poke,
        id: idx + 1,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${ idx + 1 }.svg`
    }))

    return {
        props: {
            pokemons
        }
    }
}

export default Home;
