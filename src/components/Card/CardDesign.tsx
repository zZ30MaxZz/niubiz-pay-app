import React, { } from 'react';
import styles from "./cardDesign.module.scss";
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

const CardDesign: React.FC<CustomProps> = ({
    number = '**** **** **** ****',
    dateYear = 'AA',
    dateMonth = 'MM',
    owner,
    brand
}) => {
    number = number ? number : '**** **** **** ****';
    dateYear = dateYear ? dateYear : 'AA';
    dateMonth = dateMonth ? dateMonth : 'MM';

    const anyAlias = owner?.trim() !== "";

    let currentBrand = Object.values(FinancialInstitution).find(obj => obj.name === brand) ?? FinancialInstitution.NotFound;

    let IconBrand = currentBrand.icon;

    return (
        <div className={`${styles.card}`}>
            <div className={styles.cardSection}>
                <div className={`${styles.cardBody} ${styles.cardBodyTop} ${anyAlias ? styles.imgCard : ""}`}>
                    <div className={styles.cardBodyResume}>
                        <div className={styles.cardNumber}>{number}</div>
                    </div>
                </div>
                <div className={`${styles.cardBody} ${styles.cardBodyBottom} ${styles[currentBrand.class]}`}>
                    <div className={styles.cardBodyResume}>
                        {anyAlias &&
                            <>
                                <div className={styles.aliasLabel}>Alias</div>
                                <div className={styles.cardOwner}>{owner}</div>
                            </>
                        }
                        {currentBrand.name !== FinancialInstitution.NotFound.name &&
                            <div className={styles.cardBrandIconContainer}>
                                <IconBrand />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDesign;
