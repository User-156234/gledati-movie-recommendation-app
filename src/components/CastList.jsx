import React from 'react';

export default function CastList({ cast }) {
  return (
    <div className="cast-list">
      <h3>Cast</h3>
      <div className="cast-scroll">
        {cast.map((actor) => (
          <div key={actor.cast_id} className="cast-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
            />
            <p>{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}