import waiting from '../../../../../../ressources/img/waiting.png'
import accept from '../../../../../../ressources/img/check-green.png';
import reject from '../../../../../../ressources/img/reject.png';
import './markerStatus.scss';

const MarkerStatus = ({ message, src }) => (
    <div className="info-status">
        <p className='info-message'>{message}</p>
        <img src={src} alt={message} className='info-status-img' />
    </div>
);

export const getRequestStatusContent = (onShowConfirmModal) => ({
    classic: <button className="btn btn-join" onClick={onShowConfirmModal}>Join</button>,
    view: <button className="btn btn-join">Join</button>,
    active: <MarkerStatus message="Thank you! Your request is waiting for confirmation" src={waiting} />,
    rejected: <MarkerStatus message="Sorry, your request was rejected" src={reject} />,
    confirmed: <MarkerStatus message="Nice! Your request was accepted" src={accept} />,
    full: <MarkerStatus message="Unfortunatelly the training is already full" src={reject} />
});