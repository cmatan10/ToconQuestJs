import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Card.css';

const Card = ({url, title, description, imageUrl, difficulty, stageNumber, status }) => {
  return (
    <div className="card-custom">
    <Link to={url}>
      <img src={process.env.PUBLIC_URL + imageUrl} alt="Card" className="card-image-custom" />
      <h3 className="card-title-custom">{title}</h3>
    </Link>
      <div className="card-content-custom">
        <p className="card-description-custom">{description}</p>
        <p className="card-difficulty-custom">Difficulty: {difficulty}</p>
        <p className="card-stage-custom"> {status}</p>
      </div>
    </div>
  );
};

export default Card;