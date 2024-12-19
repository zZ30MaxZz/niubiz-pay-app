import React from 'react';
import styles from './loader.module.scss';
import { DotLoader } from 'react-spinners';

interface LoaderProps {
    size?: number;
    color?: string;
    loader?: React.ElementType;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, color = '#333', loader, ...rest }) => {
    const CustomLoader = loader ?? DotLoader;

    return (
        <div className={styles.loaderContainer}>
            <CustomLoader
                color={color ?? '#fff'}
                size={size ?? 20}
                {...rest}
            />
        </div>
    );
};

export default Loader;