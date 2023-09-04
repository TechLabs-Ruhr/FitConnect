import defaultUserPhoto from '../../../../../../ressources/img/user.png';
import './participantAvatars.scss'; 

const ParticipantAvatars = ({ participants}) => {
    return (
      <div className="info-people-imgs">
        {participants.slice(0, 10).map((participant, index) => {
          const src = participant.photo || defaultUserPhoto;
          return (
            <img 
              key={index} 
              alt={participant.displayName} 
              src={src} 
              title={participant.name} 
              className='info-people-img' 
            />
          );
        })}
      </div>
    );
  }

  export default ParticipantAvatars; 