import React from 'react';
import styles from "./customContent.module.scss";

type CustomProps = {
};

const CustomContent: React.FC<CustomProps> = ({ ...props }) => {
    return (
        <div className={styles.formContainer}>
            CONTENT
        </div>
    );
};

export default CustomContent;
