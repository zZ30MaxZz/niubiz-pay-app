import React, { } from 'react';
import styles from "./card.module.scss";
import IconHolder from '../Icon/Holder';
import { FinancialInstitution } from '../../helper/card';

type CustomProps = {
    isFlipped: boolean;
    number?: string;
    dateYear?: string;
    dateMonth?: string;
    cvv?: string;
    owner?: string;
    brand: {};
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

    let currentBrand = Object.values(FinancialInstitution).find(obj => obj.name === brand) ?? FinancialInstitution.NotFound;

    let IconBrand = currentBrand.icon;

    return (
        <div className={`${styles.card}`}>
            <div className={`${styles.cardSection} ${isFlipped ? styles.cardFlipped : ''}`}>
                <div className={`${styles.cardBody} ${styles.cardBodyFront} ${styles[currentBrand.class]}`}>
                    <div className={styles.cardBodyResume}>
                        {currentBrand.name && currentBrand.name !== FinancialInstitution.NotFound.name && <div className={styles.cardBrand}>{currentBrand.name}</div>}
                        <div className={styles.cardNumber}>{number}</div>
                        <div className={styles.cardDate}>Vence el {dateMonth}/{dateYear}</div>
                        <div className={styles.cardOwner}>{owner}</div>
                        {currentBrand.name !== FinancialInstitution.NotFound.name &&
                            <div className={styles.cardBrandIconContainer}>
                                <IconBrand />
                            </div>
                        }
                    </div>
                </div>
                <div className={`${styles.cardBody} ${styles.cardBodyBack} ${styles[currentBrand.class]}`}>
                    <div className={`${styles.cardMagneticTape} ${styles.colorMagnetic}`}></div>
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
