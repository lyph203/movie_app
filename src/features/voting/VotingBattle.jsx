import React, { useEffect, useState } from "react";
import { connect, subscribe, disconnect } from "@/services/socket";
import { getMovieDetail } from "@/api/tmdb";
import { voteBattle, getBattleResult } from "@/api/voting";
import MovieCard from "@/features/movie/components/MovieCard";
import { toast } from "react-toastify";

export default function VotingBattle({ battleId, currentUserId }) {
  const [result, setResult] = useState(null);
  const [movieA, setMovieA] = useState(null);
  const [movieB, setMovieB] = useState(null);

  useEffect(() => {
    let sub = null;
    connect(() => {
      sub = subscribe(`/topic/votes/${battleId}`, (data) => {
        console.log("Received update:", data);
        setResult(data);
      });
    });

    // initial fetch
    (async () => {
      try {
        const res = await getBattleResult(battleId);
        setResult(res.data);
        const [mA, mB] = await Promise.all([
          getMovieDetail(res.data.movieIdA),
          getMovieDetail(res.data.movieIdB),
        ]);
        setMovieA(mA.data || mA);
        setMovieB(mB.data || mB);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (sub) sub.unsubscribe();
      disconnect();
    };
  }, [battleId]);

  const handleVote = async (movieId) => {
    try {
      await voteBattle(battleId, { movieId, userId: currentUserId || null });
      // backend will broadcast result; optional optimistic update handled by incoming message
    } catch (err) {
      toast.error(err.response.data.error);
      console.error("Vote failed", err);
    }
  };

  if (!movieA || !movieB || !result) return <div>Loading...</div>;

  return (
    <>
      <h2 className="text-2xl font-semibold mt-4 text-indigo-500 text-center">
        Movie Battle
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-1/2 mx-auto mt-4">
        <div className="p-4 rounded">
          <MovieCard movie={movieA} />
          <button
            className="w-full mt-4 p-2 bg-indigo-500 rounded-2xl cursor-pointer"
            onClick={() => handleVote(movieA.id)}
          >
            Vote
          </button>
          <div className="mt-2">
            Votes: {result.votesA} ({result.percentA.toFixed(1)}%)
          </div>
        </div>
        <div className="p-4 rounded">
          <MovieCard movie={movieB} />
          <button
            className="w-full mt-4 p-2 bg-indigo-500 rounded-2xl cursor-pointer"
            onClick={() => handleVote(movieB.id)}
          >
            Vote
          </button>
          <div className="mt-2">
            Votes: {result.votesB} ({result.percentB.toFixed(1)}%)
          </div>
        </div>
      </div>
    </>
  );
}
