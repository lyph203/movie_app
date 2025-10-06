import { useAuth } from "./AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return <p>Please login</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{user.fullName}</h2>
      <p>@{user.username}</p>
      <p>{user.email}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-2">
        Logout
      </button>
    </div>
  );
}
