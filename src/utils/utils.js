import { config } from 'react-spring';

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const findPercentage = (time, trainingTime) => {
    const startTime = new Date(time.toDate());
    const endTime = new Date(trainingTime.toDate());
    const currentTime = new Date();
    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;
    return (elapsedTime / totalTime) * 100;
}

export const animation = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff
};