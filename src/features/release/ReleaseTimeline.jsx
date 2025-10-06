import { useEffect, useState } from "react";
import { getUpcomingMovies } from "../../api/tmdb";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReleaseCalendar({ country }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const result = await getUpcomingMovies(country);
      const mapped = result.results.map((m) => ({
        name: m.title,
        release: new Date(m.release_date).getTime(),
      }));
      setData(mapped);
    }
    load();
  }, [country]);

  return (
    <div className="h-96 bg-white rounded-xl shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis dataKey="release" hide />
          <Tooltip labelFormatter={(idx) => data[idx]?.name} />
          <Bar dataKey="release" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
