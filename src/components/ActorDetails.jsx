// src/components/ActorDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchActorDetails } from '../api/tmdb';

export default function ActorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);

  useEffect(() => {
    const getActor = async () => {
      const res = await fetchActorDetails(id);
      setActor(res.data);
    };
    getActor();
  }, [id]);

  if (!actor) return <div className="container">Loading...</div>;

  return (
    <div className="container actor-details">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>
      <div className="actor-top">
        <img src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`} alt={actor.name} />
        <div className="actor-info">
          <h1>{actor.name}</h1>
          <p><strong>Birthday:</strong> {actor.birthday || 'N/A'}</p>
          <p><strong>Place of Birth:</strong> {actor.place_of_birth || 'N/A'}</p>
          <p><strong>Biography:</strong> {actor.biography || 'No biography available.'}</p>
        </div>
      </div>
    </div>
  );
}
