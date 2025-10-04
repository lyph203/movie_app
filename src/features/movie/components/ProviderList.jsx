const ProviderList = ({ providers }) => {
  if (!providers?.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-gray-400 text-sm mb-2">Available On</h4>
      <div className="flex space-x-3">
        {providers.map((prov) => (
          <div
            key={prov.provider_id}
            className="flex flex-col items-center text-xs text-gray-300"
          >
            <img
              src={`https://image.tmdb.org/t/p/w92${prov.logo_path}`}
              alt={prov.provider_name}
              className="w-12 h-12 rounded-lg"
            />
            <span className="mt-1">{prov.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderList;
