import React, { useState, useEffect } from "react";
import { createBattle, getListBattle } from "@/api/voting";
import VotingBattle from "@/features/voting/VotingBattle";

export default function VotingPage() {
  const [battleId, setBattleId] = useState(null);
  const [movieA, setMovieA] = useState("");
  const [movieB, setMovieB] = useState("");
  const [battles, setBattles] = useState([]);
  const userId = localStorage.getItem("userId");

  // Load danh sách battle khi mount
  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    try {
      const res = await getListBattle();
      setBattles(res.data || []);
    } catch (err) {
      console.error("Failed to load battles", err);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await createBattle({
        movieIdA: movieA,
        movieIdB: movieB,
        title: "",
      });
      setBattleId(res.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (battleId)
    return <VotingBattle battleId={battleId} currentUserId={userId} />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mt-4 text-indigo-500 text-center">
        Create Battle
      </h2>

      <div className="flex items-center justify-center space-x-4 mt-2">
        <input
          className="border border-indigo-500 rounded-2xl p-2"
          placeholder="movieId A"
          value={movieA}
          onChange={(e) => setMovieA(e.target.value)}
        />
        <input
          className="border border-indigo-500 rounded-2xl p-2"
          placeholder="movieId B"
          value={movieB}
          onChange={(e) => setMovieB(e.target.value)}
        />
        <button
          className="bg-indigo-500 text-white rounded-2xl p-2 cursor-pointer"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      {/* Danh sách battles */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-indigo-400 mb-2 text-center">
          All Battles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
          {battles.length > 0 ? (
            battles.map((battle) => (
              <div
                key={battle.id}
                className="border border-gray-300 w-96 rounded-lg p-3 shadow hover:shadow-md cursor-pointer"
                onClick={() => setBattleId(battle.id)}
              >
                <p className="font-semibold text-indigo-600">Battle #{battle.id}</p>
                <p className="text-sm text-gray-600">Movie A: {battle.movieIdA}</p>
                <p className="text-sm text-gray-600">Movie B: {battle.movieIdB}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No battles available</p>
          )}
        </div>
      </div>
    </div>
  );
}
