import React, { useEffect, useState } from 'react';
import styles from "./customForm.module.scss";
import { X } from "@phosphor-icons/react";
import Card from '../Card/Card';
import InputGroup from '../InputGroup/InputGroup';

type CustomProps = {
    showForm: boolean;
    srcCss: string;
    tokenSession?: string;
    merchandId: string,
    purchasenumber: number,
    onClose: () => void;
};

const CustomForm: React.FC<CustomProps> = ({
    showForm,
    srcCss,
    tokenSession,
    merchandId,
    purchasenumber,
    onClose
}) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const [values, setValues] = React.useState({
        cardNumber: '',
        cardExpirationDate: '',
        cardCvv: '',
        cardFirstname: '',
        cardLastname: '',
        tyc: ''
    });

    const [errors, setErrors] = React.useState({
        cardNumber: '',
        cardExpirationDate: '',
        cardOwner: '',
        cardCvv: '',
        cardFirstname: '',
        cardLastname: '',
        tyc: ''
    });

    const loadInputs = () => {
        let cardNumber: Promise<any>;
        let cardExpiry: Promise<any>;
        let cardCvv: Promise<any>;

        const elementStyles = {
            base: {
                color: '#666666',
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                placeholder: {
                    color: '#999999'
                },
                autofill: {
                    color: '#e39f48',
                }
            },
            invalid: {
                color: '#E25950',
                '::placeholder': {
                    color: '#FFCCA5',
                }
            }
        };

        cardNumber = window?.payform.createElement(
            'card-number',
            {
                style: elementStyles,
                placeholder: 'Número de tarjeta'
            },
            'txtNumeroTarjeta'
        );

        cardNumber.then(element => {
            element.on('bin', function (data: any) {
                // alert('Vinculado')
            });
            element.on('change', function (data: any) {
                const cardnumberdata = JSON.stringify(data);
                const cardnumbervalidation = JSON.parse(cardnumberdata);
                if (data.length > 0 && cardnumbervalidation[0].code === "invalid_number") {
                    alert('Invalido')
                }

                console.log(cardnumbervalidation[0].message);
            });
            element.on('dcc', function (data: any) {
            });
            element.on('installments', function (data: any) {
            });
            element.on('lastFourDigits', function (data: any) {
                console.log(data);
            });
        });

        cardExpiry =
            window?.payform.createElement(
                'card-expiry',
                {
                    style: elementStyles,
                    placeholder: 'MM/AA'
                },
                'txtFechaVencimiento'
            );

        cardExpiry.then(element => {
            element.on('change', function (data: any) {
            })
        });

        cardCvv =
            window?.payform.createElement(
                'card-cvc',
                {
                    style: elementStyles,
                    placeholder: 'CVV'
                },
                'txtCvv'
            );
        cardCvv.then(element => {
            element.on('change', function (event: any) {
            })
        });
    };

    useEffect(() => {
        if (!tokenSession)
            return;

        const initSetting = () => window?.payform.setConfiguration({
            sessionkey: tokenSession,
            channel: 'paycard',
            merchantid: merchandId,
            purchasenumber: purchasenumber,
            amount: "1.00",
            language: "es",
            font: "https://fonts.googleapis.com/css?family=Montserrat:400&display=swap"
        });

        initSetting()

    }, [tokenSession, merchandId, purchasenumber]);

    useEffect(() => {
        const initializePayform = () => {
            if (
                document.getElementById('txtNumeroTarjeta') &&
                document.getElementById('txtFechaVencimiento') &&
                document.getElementById('txtCvv')
            ) {
                loadInputs();
            }
        };

        const intervalId = setInterval(() => {
            if (document.getElementById('txtNumeroTarjeta')) {
                clearInterval(intervalId);
                initializePayform();
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    if (!showForm) {
        return null;
    }

    const handleOnClose = () => {
        onClose();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        console.log(value);

        setValues((prev) => ({
            ...prev,
            [event.target.name]: value
        }))

        setErrors((prev) => ({
            ...prev,
            [event.target.name]: ''
        }))
    };

    return (
        <>
            {/* <link rel="stylesheet" href={srcCss}></link> */}
            <div className={styles.formContainer}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <div className={styles.formTitle}>Agregar nueva tarjeta</div>
                        <div className={styles.formIconClose} onClick={handleOnClose}>
                            <X size={24} />
                        </div>
                    </div>
                    <div className={styles.formBody}>
                        <div className={styles.formContent}>
                            <div className={styles.formCardContainer}>
                                <Card
                                    isFlipped={isFlipped}
                                    number={values.cardNumber}
                                    cvv={values.cardCvv}
                                    owner={`${values.cardFirstname} ${values.cardLastname}`}
                                    brand='Amex'
                                />
                            </div>
                            <div className={styles.formInfoCard}>
                                <div id="txtNumeroTarjeta" className={`form-control ${styles.formControl}`}></div>
                                <div id="txtFechaVencimiento" className="form-control"></div>
                                <div id="txtCvv" className="form-control"></div>
                                <InputGroup
                                    id='cardNumbers'
                                    label='Número de tarjeta'
                                    type='document'
                                    name='cardNumber'
                                    value={values.cardNumber}
                                    error={errors.cardNumber}
                                    callbackOnChange={handleInputChange}
                                    maxLength={50} />

                                <div className={styles.formRow}>
                                    <InputGroup
                                        id='cardExpirationDate'
                                        label='Vencimiento'
                                        type='text'
                                        name='cardExpirationDate'
                                        value={values.cardExpirationDate}
                                        error={errors.cardExpirationDate}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                    <InputGroup
                                        id='cardCvv'
                                        label='Código CVV'
                                        type='text'
                                        name='cardCvv'
                                        value={values.cardCvv}
                                        error={errors.cardCvv}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50}
                                        onFocus={() => setIsFlipped(true)}
                                        onBlur={() => setIsFlipped(false)}
                                    />

                                </div>
                                <div className={styles.formRow}>
                                    <InputGroup
                                        id='cardFirstname'
                                        label='Nombre'
                                        type='text'
                                        name='cardFirstname'
                                        value={values.cardFirstname}
                                        error={errors.cardFirstname}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                    <InputGroup
                                        id='cardLastname'
                                        label='Apellido'
                                        type='text'
                                        name='cardLastname'
                                        value={values.cardLastname}
                                        error={errors.cardLastname}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                </div>
                                <div className={styles.formCheckboxContainer}>
                                    <input
                                        type="checkbox"
                                        id='tyc'
                                        name='tyc'
                                        value={values.tyc}
                                        className={styles.formCheckbox}
                                    />
                                    <label
                                        htmlFor="tyc"
                                        className={styles.formCheckboxLabel}
                                    >He leido y acepto los terminos y condiciones </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formFooter}>
                        <div className={styles.formButtonContainer}>
                            <button className={styles.buttonSecondary}>Volver</button>
                            <button className={styles.buttonPrimary}>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomForm;
