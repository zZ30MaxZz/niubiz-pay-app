import React, { } from 'react';
import styles from "./cardDesignV0.module.scss";
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

const CardDesignV0: React.FC<CustomProps> = ({
    isFlipped = false,
    number = '**** **** **** ****',
    dateYear = 'AA',
    dateMonth = 'MM',
    owner = 'Nombre del titular',
    brand
}) => {
    number = number ? number : '**** **** **** ****';
    dateYear = dateYear ? dateYear : 'AA';
    dateMonth = dateMonth ? dateMonth : 'MM';

    let currentBrand = Object.values(FinancialInstitution).find(obj => obj.name === brand) ?? FinancialInstitution.NotFound;

    let IconBrand = currentBrand.icon;

    return (
        <div className={`${styles.card}`}>
            <div className={`${styles.cardSection} ${isFlipped ? styles.cardFlipped : ''}`}>
                <div className={`${styles.cardBody} ${styles.cardBodyFront} ${styles[currentBrand.class]}`}>
                    <div className={styles.cardBodyResume}>
                        {currentBrand.name && currentBrand.name !== FinancialInstitution.NotFound.name && <div className={styles.cardBrand}>{currentBrand.name}</div>}
                        <div className={styles.cardNumber}>{number}</div>
                        <div className={styles.cardOwner}>{owner && owner.trim() !== '' ? owner : 'Nombre del titular'}</div>
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
                        <div className={styles.cardCvv}>****</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDesignV0;
