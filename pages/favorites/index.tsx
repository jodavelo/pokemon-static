import { Card, Grid } from "@nextui-org/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { Layout } from "../../components/layouts"
import { FavoritePokemons } from "../../components/pokemon"
import { NoFavorites } from "../../components/ui"
import { localFavorites } from "../../utils"

const FavoritesPage: NextPage = () => {
    
    const [favoritesPokemons, setFavoritesPokemons] = useState<number[]>([])

    useEffect(() => {
      setFavoritesPokemons( localFavorites.pokemons() )
    }, [])
    

    return (
        <Layout title="Pokemons - Favoritos">
            {
                favoritesPokemons.length === 0 
                ? ( <NoFavorites/> )
                : (
                    <FavoritePokemons key={ 1 } pokemons={ favoritesPokemons } />
                )
            }
        </Layout>
    )
}

export default FavoritesPage