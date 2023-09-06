import football from '../ressources/img/trainings/football.png';
import basketball from '../ressources/img/trainings/basketball.png';
import volleyball from '../ressources/img/trainings/volleyball.png';
import tennis from '../ressources/img/trainings/tennis.png';
import golf from '../ressources/img/trainings/golf.png';
import rugby from '../ressources/img/trainings/rugby.png';
import badminton from '../ressources/img/trainings/badminton.png';
import tableTennis from '../ressources/img/trainings/table tennis.png';
import boxing from '../ressources/img/trainings/boxing.png';
import kickboxing from '../ressources/img/trainings/kickboxing.png';
import yoga from '../ressources/img/trainings/yoga.png';
import swimming from '../ressources/img/trainings/swimming.png';
import running from '../ressources/img/trainings/running.png';
import cycling from '../ressources/img/trainings/cycling.png';
import parkour from '../ressources/img/trainings/parkour.png';
import skateboarding from '../ressources/img/trainings/skateboarding.png';
import climbing from '../ressources/img/trainings/climbing.png';
import fitness from '../ressources/img/trainings/fitness.png';
import bowling from '../ressources/img/trainings/bowling.png';
import powerlifting from '../ressources/img/trainings/powerlifting.png';
import karate from '../ressources/img/trainings/karate.png';
import judo from '../ressources/img/trainings/judo.png';
import wrestling from '../ressources/img/trainings/wrestling.png';
import armwrestling from '../ressources/img/trainings/armwrestling.png';
import walking from '../ressources/img/trainings/walking.png';
import crossfit from '../ressources/img/trainings/crossfit.png';
import other from '../ressources/img/trainings/other.png';

export const trainings = [
    { activityType: "football", icon: football },
    { activityType: "basketball", icon: basketball },
    { activityType: "volleyball", icon: volleyball },
    { activityType: "tennis", icon: tennis },
    { activityType: "golf", icon: golf },
    { activityType: "rugby", icon: rugby },
    { activityType: "badminton", icon: badminton },
    { activityType: "table tennis", icon: tableTennis },
    { activityType: "boxing", icon: boxing },
    { activityType: "kickboxing", icon: kickboxing },
    { activityType: "yoga", icon: yoga },
    { activityType: "swimming", icon: swimming },
    { activityType: "running", icon: running },
    { activityType: "cycling", icon: cycling },
    { activityType: "parkour", icon: parkour },
    { activityType: "skateboarding", icon: skateboarding },
    { activityType: "climbing", icon: climbing },
    { activityType: "fitness", icon: fitness },
    { activityType: "bowling", icon: bowling },
    { activityType: "powerlifting", icon: powerlifting },
    { activityType: "karate", icon: karate },
    { activityType: "judo", icon: judo },
    { activityType: "wrestling", icon: wrestling },
    { activityType: "armwrestling", icon: armwrestling },
    { activityType: "walking", icon: walking },
    { activityType: "crossfit", icon: crossfit },
    { activityType: "other", icon: other }
];

export const getSize = (participants) => {
    if (participants === 1){
        return 34; 
    } else if (participants > 5) {
        return 50; 
    } else return 34 + participants * 2;  
}

