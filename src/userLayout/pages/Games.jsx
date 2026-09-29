import { useQuery } from "@tanstack/react-query";
import { getGames } from "../api/gameApi";
import GameCard from "../components/GameCard";

function Games(){
const{
    data: games,
    isLoading,
    error,
} = useQuery({
    queryKey: ["games"],
    queryFn: getGames
});

if(isLoading){
    return <h2>Loading...</h2>
}
if(error){
    return <h2>Error: {error.message}</h2>
}

return(
    <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold border-b">All Games</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game)=>(
        <GameCard 
        key={game.id}
        game={game}
        />
    ))}
    </div>
    </div>
)
}

export default Games;