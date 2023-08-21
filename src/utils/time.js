export const findPercentage = (time, trainingTime) => {
    const startTime = new Date(time.toDate());
    const endTime = new Date(trainingTime.toDate());
    const currentTime = new Date();
    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;
    return (elapsedTime / totalTime) * 100;
}