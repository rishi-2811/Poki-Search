import React, { useState, useEffect } from 'react';
import Loading from './Loading';

export default function PokemonApp() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);

    
    const getData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300'); 
            const data = await response.json();
            const detailedPokemons = await Promise.all(
                data.results.map(async (pokemon) => {
                    const pokemonData = await fetch(pokemon.url);
                    const pokemonDetails = await pokemonData.json();
                    return {
                        name: pokemon.name,
                        id: pokemonDetails.id,
                        image: pokemonDetails.sprites.front_default,
                        types: pokemonDetails.types.map(type => type.type.name).join(', '),
                    };
                })
            );
            setPokemons(detailedPokemons);
            setFilteredPokemons(detailedPokemons);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch Pokémon data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        getData(); 
    }, []);

    
    const handleSearch = (e) => {
        setQuery(e.target.value.toLowerCase());
        const filtered = pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredPokemons(filtered);
    };

    
    const pokemonCards = filteredPokemons.map((pokemon) => (
        <div key={pokemon.id} className="card">
            <img 
                src={pokemon.image} 
                alt={pokemon.name} 
            />
            <p><strong>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</strong></p>
            <p>Type(s): {pokemon.types}</p>
        </div>
    ));

    return (
        <div className="container">
            <div className="input-box">
                <label>Pokemon Search</label>
                <input 
                    type="text" 
                    placeholder="Enter Pokemon name" 
                    value={query} 
                    onChange={handleSearch} 
                />
            </div>
            <div className="results">
                {loading ? <Loading /> : error ? <p>{error}</p> : <div className="pokemon-grid">{pokemonCards}</div>}
            </div>
        </div>
    );
}
