import React, { } from 'react';
import styles from "./card.module.scss";
import IconHolder from '../Icon/Holder';

type CustomProps = {
    isFlipped: boolean;
    number?: string;
    dateYear?: string;
    dateMonth?: string;
    cvv?: string;
    owner?: string;
    brand?: string;
    brandIcon?: string;
};

const Card: React.FC<CustomProps> = ({
    isFlipped = false,
    number = '**** **** **** ****',
    dateYear = 'AA',
    dateMonth = 'MM',
    cvv = '****',
    owner = 'Nombre del titular',
    brand,
    brandIcon,
}) => {
    number = number ? number : '**** **** **** ****';
    dateYear = dateYear ? dateYear : 'AA';
    dateMonth = dateMonth ? dateMonth : 'MM';
    cvv = cvv ? cvv : '****';
    owner = owner ? owner : 'Nombre del titular';

    return (
        <div className={`${styles.card}`}>
            <div className={`${styles.cardSection} ${isFlipped ? styles.cardFlipped : ''}`}>
                <div className={`${styles.cardBody} ${styles.cardBodyFront} ${brand && styles['color' + brand]}`}>
                    <div className={styles.cardBodyResume}>
                        {brand && <div className={styles.cardBrand}>{brand}</div>}
                        <div className={styles.cardNumber}>{number}</div>
                        <div className={styles.cardDate}>Vence el {dateMonth}/{dateYear}</div>
                        <div className={styles.cardOwner}>{owner}</div>
                        {brandIcon && <div className={styles.cardBrandIconContainer}>{brandIcon}</div>}
                    </div>
                </div>
                <div className={`${styles.cardBody} ${styles.cardBodyBack} ${brand && styles['color' + brand]}`}>
                    <div className={`${styles.cardMagneticTape} ${brand && styles['colorMagnetic' + brand]}`}></div>
                    <div className={styles.cardHolderContainer}>
                        <IconHolder />
                    </div>
                    <div className={styles.cardBodyResume}>
                        <div className={styles.cardCvv}>{cvv}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
