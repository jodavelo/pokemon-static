import { useState } from 'react';
import { NextPage } from "next";
import Image from 'next/image';
import { Card, Grid, Text, Container, Button } from '@nextui-org/react';
import { GetStaticPaths, GetStaticProps } from 'next'

import confetti from 'canvas-confetti';

import { pokeApi } from "../../api";
import { Layout } from "../../components/layouts";
import { Pokemon, PokemonListResponse } from "../../interfaces";
import { getPokemonInfo, localFavorites } from '../../utils';

interface Props {
    pokemon: Pokemon
}

const PokemonByNamePage: NextPage<Props> = ({ pokemon }) => {

    const [isInFavorites, setIsInFavorites] = useState( localFavorites.existsInFavorites( pokemon.id ) )
    const onToggleFavorite = () => {
        localFavorites.toggleFavorites( pokemon.id );
        setIsInFavorites( !isInFavorites )
        if( !isInFavorites ) return;
        confetti({
            zIndex: 999,
            particleCount: 100,
            spread: 160,
            angle: -100,
            origin:{
                x: 1,
                y: 0
            }
        })
    }

    console.log(pokemon)

    return (
        <Layout title={ pokemon.name }>
            <Grid.Container css={{ marginTop: '5px' }} gap={ 2 } >
                <Grid xs={12} sm={4} >
                    <Card.Body>
                        <Card.Image
                            src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
                            alt={ pokemon.name }
                            width='100%'
                            height={ 200 }                           
                        />
                    </Card.Body>
                </Grid>
                <Grid xs={12} sm={8}>
                    <Card>
                        <Card.Header css={{ display:'flex', justifyContent: 'space-between' }}>
                            <Text h1 transform="capitalize" >{ pokemon.name }</Text>
                            <Button 
                                color={"gradient"}
                                ghost={ !isInFavorites }
                                onClick={ onToggleFavorite }
                            >{ isInFavorites ? 'En favoritos' : 'Guardar en favoritos' }</Button>
                        </Card.Header>
                        <Card.Body>
                            <Text size={30} >Sprites:</Text>
                            <Container direction="row" display="flex">
                                <Image
                                    src={ pokemon.sprites.front_default }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                                <Image
                                    src={ pokemon.sprites.back_default }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                                <Image
                                    src={ pokemon.sprites.front_shiny }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                                <Image
                                    src={ pokemon.sprites.back_shiny }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                            </Container>
                        </Card.Body>
                    </Card>
                </Grid> 
            </Grid.Container>
        </Layout>
        
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    
    const { data } = await pokeApi.get<PokemonListResponse>(`/pokemon?limit=151`, {
        headers:{
            'accept-encoding': '*'
        }
    });
    const pokemonNames: string[] = data.results.map( pokemon => pokemon.name );

    console.log(data)

    return {
        paths: pokemonNames.map( name => ({
            params: { name }
        })),
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    //const { data } = await  // your fetch function here 
    const { name } = params as { name: string }
    const pokemon = await getPokemonInfo( name );

    if( !pokemon ){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            pokemon
        },
        revalidate: 84600
    }
}


export default PokemonByNamePage;