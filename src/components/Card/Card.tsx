import React, { } from 'react';
import styles from "./card.module.scss";

type CustomProps = {
    number?: string;
    dateYear?: string;
    dateMonth?: string;
    owner?: string;
};

const Card: React.FC<CustomProps> = ({
    number = '**** **** **** ****',
    dateYear = 'AA',
    dateMonth = 'MM',
    owner = 'Nombre del titular',
}) => {

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <div className={styles.cardNumber}>{number}</div>
                <div className={styles.cardDate}>Vence el {dateMonth}/{dateYear}</div>
                <div className={styles.cardOwner}>{owner}</div>
            </div>
        </div>
    );
};

export default Card;
