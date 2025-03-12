import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from "./customPayForm.module.scss";
import { X } from "@phosphor-icons/react";
import InputGroup from '../InputGroup/InputGroup';
import { TokenizerResponse } from '../types';
import { FinancialInstitution, getCardType } from '../../helper/card';
import * as Yup from 'yup';
import { useFormik } from "formik";
import Loader from '../Loader/Loader';
import PostNiubizAuthorize from 'helper/PostNiubizAuthorize';

type CustomPayProps = {
    documentType: string,
    documentUser: string,
    setFormResponse: any;
    showForm: boolean;
    showBlocked: boolean;
    srcCss: string;
    tokenSession?: string;
    merchandId: string,
    purchasenumber: number,
    userEmail: string,
    channelToken: string,
    authorizationService: string,
    tokenSecurity?: string | null,
    baseUrl: string,
    amount: string;
    onClose: () => void;
    loader?: JSX.Element;
};

const CustomPayForm = forwardRef(({
    documentType,
    documentUser,
    setFormResponse,
    showForm,
    showBlocked,
    srcCss,
    tokenSession,
    merchandId,
    purchasenumber,
    userEmail,
    channelToken,
    authorizationService,
    tokenSecurity,
    baseUrl,
    amount,
    onClose,
    loader
}: CustomPayProps, ref) => {
    const [showLoader, setShowLoader] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    const [brand, setBrand] = useState(FinancialInstitution.NotFound.name);

    const [cardNumberState, setCardNumberState] = useState<Promise<any>>();
    const [cardExpiryState, setCardExpiryState] = useState<Promise<any>>();
    const [cardCvvState, setCardCvvState] = useState<Promise<any>>();

    const [lastNumbers, setLastNumbers] = useState<string>('');


    const [tokenizer, setTokenizer] = useState<TokenizerResponse | null>();

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
            .max(50, 'No debe exceder los 50 caracteres')
    });

    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            cardExpiry: '',
            cardCvv: '',
            cardFirstname: '',
            cardLastname: '',
        },
        validationSchema: cardSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: async (values) => {
            setShowLoader(true);

            var dataForm = {
                name: values.cardFirstname,
                lastName: values.cardLastname,
                email: userEmail,
                alias: userEmail,
                userBlockId: userEmail,
                currencyConversion: false,
                recurrence: false
            };

            const inputCard = [cardNumberState, cardExpiryState, cardCvvState];

            window?.payform.createToken(
                inputCard,
                dataForm
            )
                .then(function (data) {
                    setTokenizer(data as TokenizerResponse);

                    setShowLoader(false);
                })
                .catch(function (error) {
                    setShowLoader(false);

                    const dataResponse = {
                        success: false,
                        code: "100",
                        data: error,
                        message: error
                    }

                    setFormResponse(dataResponse);
                });
        }
    });

    const { values, errors, handleChange, handleSubmit, touched, isValid, setFieldTouched } = formik;

    useEffect(() => {
        const validateForm = async () => {
            const allFieldsTouched =
                touched.cardNumber &&
                touched.cardExpiry &&
                touched.cardCvv &&
                touched.cardFirstname &&
                touched.cardLastname;

            setSuccessForm(isValid && (allFieldsTouched ?? false));
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
                let numberCard = getCardType(data);

                if (numberCard)
                    setBrand(numberCard);
            });
            element.on('change', function (data: any) {
                if (data.length > 0 && data[0].code === "invalid_number") {
                    formik.setFieldError('cardNumber', data[0].message);

                    // setBrand(FinancialInstitution.NotFound.name);   
                }
            });
            element.on('dcc', function (data: any) {
            });
            element.on('installments', function (data: any) {
            });
            element.on('lastFourDigits', function (data: any) {
                setLastNumbers(`**** **** **** ${data}`);

                setCardNumberState(cardNumber);

                formik.setFieldValue('cardNumber', '***');
                formik.setFieldError('cardNumber', '');
                setFieldTouched('cardNumber', true);
            });
        });

        cardExpiry.then(element => {
            element.on('change', function (data: any) {

                if (data.length > 0 && data[0].code === "invalid_expiry") {
                    formik.setFieldError('cardExpiry', data[0].message);
                }
                else {
                    setCardExpiryState(cardExpiry);

                    formik.setFieldValue('cardExpiry', '***');
                    formik.setFieldError('cardExpiry', '');
                    setFieldTouched('cardExpiry', true);
                }
            })
        });

        cardCvv.then(element => {
            element.on('change', function (data: any) {
                setFieldTouched('cardCvv', true);

                if (data.length > 0 && data[0].code === "invalid_cvc") {
                    formik.setFieldError('cardCvv', data[0].message);
                }
                else {
                    setCardCvvState(cardCvv);

                    formik.setFieldValue('cardCvv', '***');
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
                const url = `${baseUrl}${authorizationService}/${merchandId}`;

                const data =
                {
                    "channel": "web",
                    "captureType": "manual",
                    "countable": true,
                    "order": {
                        "tokenId": tokenizer.transactionToken,
                        "purchaseNumber": purchasenumber,
                        "amount": amount,
                        "currency": "PEN",
                        "productId": "329"
                    },
                    "cardHolder": {
                        "documentType": documentType,
                        "documentNumber": documentUser
                    }
                }

                const response = await PostNiubizAuthorize(url, tokenSecurity, data);

                const newResponse = {
                    success: response.success,
                    code: response.code,
                    data: {
                        ...response.data,
                        user: { ...values }
                    },
                    message: response.message
                }

                setFormResponse(newResponse);
            }
        };

        fetchData();

    }, [tokenizer, merchandId, tokenSecurity, authorizationService]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFieldTouched(name, true);
        handleChange(e);
    };

    const handleTransactionToken = () => {
        handleSubmit();
    };

    useImperativeHandle(ref, () => ({
        handleTransactionToken
    }));

    if (!showForm) {
        return null;
    }

    return (
        <>
            {showLoader && (loader ?? <Loader color="#fff" size={40} />)}
            <div className={styles.formContainer}>
                <div className={styles.formSection} ref={modalRef} >
                    <div className={styles.formBody}>
                        <div className={styles.formContent}>
                            <div className={styles.formInfoCard}>
                                <div className={styles.formRow}>
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
                                </div>
                                <div className={styles.formRow}>
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
                                    <InputGroup
                                        id='cardFirstname'
                                        label='Nombre'
                                        type='text'
                                        name='cardFirstname'
                                        value={values.cardFirstname}
                                        error={touched.cardFirstname ? errors.cardFirstname : ''}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                </div>
                                <div className={styles.formRow}>
                                    <InputGroup
                                        id='cardLastname'
                                        label='Apellido'
                                        type='text'
                                        name='cardLastname'
                                        value={values.cardLastname}
                                        error={touched.cardLastname ? errors.cardLastname : ''}
                                        callbackOnChange={handleInputChange}
                                        maxLength={50} />
                                    <div className={styles.formHalfContent}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default CustomPayForm;
