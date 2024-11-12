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
    userEmail: string,
    channelToken: string,
    onClose: () => void;
};

const CustomForm: React.FC<CustomProps> = ({
    showForm,
    srcCss,
    tokenSession,
    merchandId,
    purchasenumber,
    userEmail,
    channelToken,
    onClose
}) => {
    const amount = '1.00';
    const [isFlipped, setIsFlipped] = useState(false);

    const [cardNumberState, setCardNumberState] = useState<Promise<any>>();
    const [cardExpiryState, setCardExpiryState] = useState<Promise<any>>();
    const [cardCvvState, setCardCvvState] = useState<Promise<any>>();

    let cardNumber: Promise<any>;
    let cardExpiry: Promise<any>;
    let cardCvv: Promise<any>;

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

    const loadInputs = async () => {
        const elementStyles = {
            base: {
                color: '#666666',
                fontWeight: 700,
                fontFamily: "'Roboto', sans-serif",
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
                placeholder: '**** **** **** ****'
            },
            'txtNumeroTarjeta'
        );

        cardExpiry = window?.payform.createElement(
            'card-expiry',
            {
                style: elementStyles,
                placeholder: 'MM/AA'
            },
            'txtFechaVencimiento'
        );

        cardCvv = window?.payform.createElement(
            'card-cvc',
            {
                style: elementStyles,
                placeholder: '***'
            },
            'txtCvv'
        );

        cardNumber.then(element => {
            element.on('bin', function (data: any) {
            });
            element.on('change', function (data: any) {
                if (data.length > 0 && data[0].code === "invalid_number") {

                    setErrors((prev) => ({
                        ...prev,
                        cardNumber: data[0].message
                    }));

                    setValues((prev) => ({
                        ...prev,
                        cardNumber: ''
                    }));
                }
                else {
                    setErrors((prev) => ({
                        ...prev,
                        cardNumber: ''
                    }));
                }
            });
            element.on('dcc', function (data: any) {
            });
            element.on('installments', function (data: any) {
            });
            element.on('lastFourDigits', function (data: any) {
                setCardNumberState(cardNumber);
                setValues((prev) => ({
                    ...prev,
                    cardNumber: `**** **** **** ${data}`
                }));
            });
        });

        cardExpiry.then(element => {
            element.on('change', function (data: any) {
                if (data.length > 0 && data[0].code === "invalid_expiry") {
                    setErrors((prev) => ({
                        ...prev,
                        cardExpirationDate: data[0].message
                    }));
                }
                else {
                    setCardExpiryState(cardExpiry);

                    setErrors((prev) => ({
                        ...prev,
                        cardExpirationDate: ''
                    }));
                }
            })
        });

        cardCvv.then(element => {
            element.on('change', function (data: any) {
                if (data.length > 0 && data[0].code === "invalid_cvc") {
                    setIsFlipped(true);

                    setErrors((prev) => ({
                        ...prev,
                        cardCvv: data[0].message
                    }));
                }
                else {
                    setCardCvvState(cardCvv);

                    setIsFlipped(false);

                    setErrors((prev) => ({
                        ...prev,
                        cardCvv: ''
                    }));
                }
            });
        });
    };

    useEffect(() => {
        if (!tokenSession)
            return;

        const initSetting = () => window?.payform.setConfiguration({
            sessionkey: tokenSession,
            channel: channelToken,
            merchantid: merchandId,
            purchasenumber: purchasenumber,
            amount: amount,
            callbackurl: "",
            language: "es",
            font: "https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"
        });

        initSetting()

    }, [tokenSession, merchandId, purchasenumber]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (
                document.getElementById('txtNumeroTarjeta') &&
                document.getElementById('txtFechaVencimiento') &&
                document.getElementById('txtCvv')

            ) {
                clearInterval(intervalId);
                loadInputs();
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

        setValues((prev) => ({
            ...prev,
            [event.target.name]: value
        }))

        setErrors((prev) => ({
            ...prev,
            [event.target.name]: ''
        }))
    };

    const handleTransactionToken = () => {
        var data = {
            name: values.cardFirstname,
            lastName: values.cardLastname,
            email: userEmail,
            alias: userEmail,
            userBlockId: userEmail,
            currencyConversion: false,
            amount: amount
        };

        const inputCard = [cardNumberState, cardExpiryState, cardCvvState];

        window?.payform.createToken(
            inputCard,
            data
        )
            .then(function (data) {
                console.log(data)
            })
            .catch(function (error) {
                console.log(error)
            });
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
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputLabel}>Número de tarjeta</div>
                                    <div id="txtNumeroTarjeta" className={`form-control ${styles.formControl}`}></div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputLabel}>Vencimiento</div>
                                        <div id="txtFechaVencimiento" className={`form-control ${styles.formControl}`}></div>
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputLabel}>Código CVV</div>
                                        <div id="txtCvv" className={`form-control ${styles.formControl}`}></div>
                                    </div>
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
                            <button className={styles.buttonPrimary} onClick={handleTransactionToken}>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomForm;
