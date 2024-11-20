import React, { useEffect, useState } from 'react';
import styles from "./customForm.module.scss";
import { X } from "@phosphor-icons/react";
import Card from '../Card/Card';
import InputGroup from '../InputGroup/InputGroup';
import { ErrorResponse, TokenizerResponse } from '../types';
import GetNiubizTokenizerCard from '../../helper/GetNiubizTokenizerCard';
import { FinancialInstitution, getCardType } from '../../helper/card';
import * as Yup from 'yup';
import { useFormik } from "formik";

type CustomProps = {
    showForm: boolean;
    srcCss: string;
    tokenSession?: string;
    merchandId: string,
    purchasenumber: number,
    userEmail: string,
    channelToken: string,
    tokenizerService: string,
    tokenSecurity?: string | null,
    baseUrl: string,
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
    tokenizerService,
    tokenSecurity,
    baseUrl,
    onClose
}) => {
    const amount = '1.00';
    const [isFlipped, setIsFlipped] = useState(false);

    const [brand, setBrand] = useState(FinancialInstitution.NotFound.name);

    const [cardNumberState, setCardNumberState] = useState<Promise<any>>();
    const [cardExpiryState, setCardExpiryState] = useState<Promise<any>>();
    const [cardCvvState, setCardCvvState] = useState<Promise<any>>();

    const [lastNumbers, setLastNumbers] = useState<string>('');


    const [tokenizer, setTokenizer] = useState<TokenizerResponse | null>();
    const [errorTokenizer, setErrorTokenizer] = useState<ErrorResponse | null>()

    let cardNumber: Promise<any>;
    let cardExpiry: Promise<any>;
    let cardCvv: Promise<any>;

    const [successForm, setSuccessForm] = useState(false);

    const cardSchema = Yup.object().shape({
        cardNumber: Yup
            .string()
            .required('Este campo es requerido')
            .max(50, 'No debe exceder los 50 caracteres'),
        cardExpiry: Yup
            .string()
            .required('Este campo es requerido')
            .max(50, 'No debe exceder los 50 caracteres'),
        cardCvv: Yup
            .string()
            .required('Este campo es requerido')
            .max(50, 'No debe exceder los 50 caracteres'),
        cardFirstname: Yup
            .string()
            .required('Ingresa el Nombre como figura en tu tarjeta.')
            .max(50, 'No debe exceder los 50 caracteres'),
        cardLastname: Yup
            .string()
            .required('Ingresa el Apellido como figura en tu tarjeta.')
            .max(50, 'No debe exceder los 50 caracteres'),
        tyc: Yup
            .boolean()
            .required('Este campo es requerido')
    });

    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            cardExpiry: '',
            cardCvv: '',
            cardFirstname: '',
            cardLastname: '',
            tyc: ''
        },
        validationSchema: cardSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: async (values) => {
            console.log(values);
            console.log('Formulario enviado');



            // onClose();
        }
    });

    const { values, errors, handleChange, handleSubmit, touched, isValid, setFieldTouched, resetForm } = formik;

    useEffect(() => {
        const validateForm = async () => {
            const allFieldsTouched =
                touched.cardNumber &&
                touched.cardExpiry &&
                touched.cardCvv &&
                touched.cardFirstname &&
                touched.cardLastname &&
                touched.tyc;

            setSuccessForm(isValid && (allFieldsTouched ?? false));


            console.log('allFieldsTouched', errors);
        };

        validateForm();
    }, [values, isValid, touched]);

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
                console.log(data);
                let numberCard = getCardType(data);

                if (numberCard)
                    setBrand(numberCard);
            });
            element.on('change', function (data: any) {
                if (data.length > 0 && data[0].code === "invalid_number") {
                    formik.setFieldError('cardNumber', data[0].message);

                    // setBrand(FinancialInstitution.NotFound.name);   
                }
                else {
                    setCardNumberState(cardNumber);

                    formik.setFieldValue('cardNumber', '123');
                    formik.setFieldError('cardNumber', '');
                    setFieldTouched('cardNumber', true);
                }
            });
            element.on('dcc', function (data: any) {
            });
            element.on('installments', function (data: any) {
            });
            element.on('lastFourDigits', function (data: any) {
                setLastNumbers(data);
            });
        });

        cardExpiry.then(element => {
            element.on('change', function (data: any) {

                if (data.length > 0 && data[0].code === "invalid_expiry") {
                    formik.setFieldError('cardExpirationDate', data[0].message);
                }
                else {
                    setCardExpiryState(cardExpiry);

                    formik.setFieldValue('cardExpiry', '123');
                    formik.setFieldError('cardExpiry', '');
                    setFieldTouched('cardExpiry', true);
                }
            })
        });

        cardCvv.then(element => {
            element.on('change', function (data: any) {
                setFieldTouched('cardCvv', true);

                if (data.length > 0 && data[0].code === "invalid_cvc") {
                    setIsFlipped(true);

                    formik.setFieldError('cardCvv', data[0].message);
                }
                else {
                    setCardCvvState(cardCvv);

                    setIsFlipped(false);

                    formik.setFieldValue('cardCvv', '123');
                    formik.setFieldError('cardCvv', '');
                    setFieldTouched('cardCvv', true);
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

    }, [tokenSession, merchandId, purchasenumber, channelToken]);

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

    useEffect(() => {
        const fetchData = async () => {
            if (tokenizer?.transactionToken && tokenSecurity) {
                const url = `${baseUrl}${tokenizerService}/${merchandId}/${tokenizer.transactionToken}`;
                const response = await GetNiubizTokenizerCard(url, tokenSecurity);

                if (response) {
                    console.log(response)
                }
            }
        };

        fetchData();

    }, [tokenizer, merchandId, tokenSecurity, tokenizerService]);

    if (!showForm) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFieldTouched(name, true);
        handleChange(e);
    };

    const handleTransactionToken = () => {
        var dataForm = {
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
            dataForm
        )
            .then(function (data) {
                console.log('DATA:', data);

                setTokenizer(data as TokenizerResponse);

            })
            .catch(function (error) {
                console.dir(error)
                setErrorTokenizer(error as ErrorResponse);
            });
    };

    return (
        <>
            {/* <link rel="stylesheet" href={srcCss}></link> */}
            <div className={styles.formContainer}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <div className={styles.formTitle}>Agregar nueva tarjeta</div>
                        <div className={styles.formIconClose} onClick={onClose}>
                            <X size={24} />
                        </div>
                    </div>
                    <div className={styles.formBody}>
                        <div className={styles.formContent}>
                            <div className={styles.formCardContainer}>
                                <Card
                                    isFlipped={isFlipped}
                                    number={lastNumbers}
                                    cvv={values.cardCvv}
                                    owner={`${values.cardFirstname} ${values.cardLastname}`}
                                    brand={brand}
                                />
                            </div>
                            <div className={styles.formInfoCard}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputLabel}>Número de tarjeta</div>
                                    <div id="txtNumeroTarjeta" className={`form-control ${styles.formControl} ${errors.cardNumber && styles.formError}`}></div>
                                    {
                                        errors.cardNumber &&
                                        <div className={styles.inputErrorContainer}>
                                            <X size={20} color="#C82014" />
                                            <div className={styles.inputError}>{errors.cardNumber}</div>
                                        </div>
                                    }
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputLabel}>Vencimiento</div>
                                        <div id="txtFechaVencimiento" className={`form-control ${styles.formControl} ${errors.cardExpiry && styles.formError}`}></div>
                                        {
                                            errors.cardExpiry &&
                                            <div className={styles.inputErrorContainer}>
                                                <X size={20} color="#C82014" />
                                                <div className={styles.inputError}>{errors.cardExpiry}</div>
                                            </div>
                                        }
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputLabel}>Código CVV</div>
                                        <div id="txtCvv" className={`form-control ${styles.formControl} ${errors.cardCvv && styles.formError}`}></div>
                                        {
                                            errors.cardCvv &&
                                            <div className={styles.inputErrorContainer}>
                                                <X size={20} color="#C82014" />
                                                <div className={styles.inputError}>{errors.cardCvv}</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <InputGroup
                                        id='cardFirstname'
                                        label='Nombre'
                                        type='text'
                                        name='cardFirstname'
                                        value={values.cardFirstname}
                                        error={touched.cardFirstname ? errors.cardFirstname : ''}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                    <InputGroup
                                        id='cardLastname'
                                        label='Apellido'
                                        type='text'
                                        name='cardLastname'
                                        value={values.cardLastname}
                                        error={touched.cardLastname ? errors.cardLastname : ''}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.formCheckboxContainer}>
                                            <input
                                                type="checkbox"
                                                id='tyc'
                                                name='tyc'
                                                value={values.tyc}
                                                className={styles.formCheckbox}
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                htmlFor="tyc"
                                                className={styles.formCheckboxLabel}
                                            >He leido y acepto los terminos y condiciones </label>
                                        </div>
                                        {
                                            errors.tyc &&
                                            <div className={styles.inputErrorContainer}>
                                                <X size={20} color="#C82014" />
                                                <div className={styles.inputError}>{errors.tyc}</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formFooter}>
                        <div className={styles.formButtonContainer}>
                            <button className={styles.buttonSecondary} onClick={onClose}>Volver</button>
                            <button className={`${styles.buttonPrimary} ${!successForm && styles.buttonDisabled}`} onClick={handleTransactionToken}>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomForm;
