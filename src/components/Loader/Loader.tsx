import React from 'react';
import styles from './loader.module.scss';
import { DotLoader } from 'react-spinners';

interface LoaderProps {
    size?: number;
    color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, color = '#333' }) => {
    return (
        <div className={styles.loaderContainer}>
            <DotLoader
                color={color ?? '#fff'}
                size={size ?? 20} />
        </div>
    );
};

export default Loader;