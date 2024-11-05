import * as React from "react";
import { FC, useState } from "react";
import styles from './inputGroup.module.scss';
import { X } from "@phosphor-icons/react/dist/ssr";
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { useMediaQuery } from "@mui/material";

type Type = "text" | "password" | "email" | "number" | "date" | "select" | "tel" | "document";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    value: string;
    type: Type;
    error?: string;
    name: string;
    span?: string;
    maxLength?: number;
    icon?: React.ReactNode | string;
    iconSrc?: string;
    callbackOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: FC<Props> = ({
    id,
    label,
    value,
    type,
    error,
    name,
    span,
    maxLength,
    icon,
    iconSrc,
    callbackOnChange,
    ...props
}) => {
    // const isMobile = useMediaQuery('(max-width:1024px)');

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const today = new Date();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'tel' || type === 'document') {
            const numericValue = e.target.value.replace(/\D/g, '');
            e.target.value = numericValue;
        }

        callbackOnChange(e);
    };

    const handleChangeDate = (date: Date | null) => {
        setSelectedDate(date);

        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const event = {
                target: {
                    name,
                    value: formattedDate,
                },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            callbackOnChange(event);
        }
    };

    return (
        <div className={styles.inputContainer}>
            <div className={styles.inputContent}>
                <label htmlFor={id} className={styles.inputLabel}>{label}</label>
                <div className={`${error && styles.inputFieldError} ${styles.inputFieldContainer} ${type === 'date' ? styles.inputFieldDateContainer : ''}`}>
                    {type === 'date' ? (
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleChangeDate}
                            dateFormat="dd/MM/yyyy"
                            maxDate={today}
                            placeholderText="Selecciona una fecha"
                        />
                    )
                        :
                        <>
                            {icon && (
                                <span className={styles.inputFieldIcon}>
                                    {icon}
                                </span>
                            )}
                            {iconSrc && (
                                <img src={iconSrc} alt="icon" className={styles.inputFieldIconImg} />
                            )}
                            <input
                                id={id}
                                value={value}
                                type={type}
                                name={name}
                                onChange={handleChange}
                                className={`${styles.inputField} ${((icon || iconSrc) && styles.inputFieldWithIcon)}`}
                                maxLength={maxLength}
                                {...props}
                            />
                        </>
                    }
                </div>
            </div>
            {error && (
                <div className={styles.inputErrorContainer}>
                    <X size={20} color="#C82014" />
                    <div className={styles.inputError}>{error}</div>
                </div>
            )}
            {span && <span className={styles.inputSpanMessage}>{span}</span>}
        </div>
    );
}

export default InputGroup;