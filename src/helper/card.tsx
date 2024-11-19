import IconAmex from "../components/Icons/IconAmex";
import IconEmpty from "../components/Icons/IconEmpty";
import IconMasterCard from "../components/Icons/IconMasterCard";
import IconVisa from "../components/Icons/IconVisa";

export const FinancialInstitution = {
    Visa: {
        name: 'Visa',
        icon: IconVisa,
        class: 'faVisa'
    },
    Mastercard: {
        name: 'Mastercard',
        icon: IconMasterCard,
        class: 'faMastercard'
    },
    AmericanExpress: {
        name: 'American Express',
        icon: IconAmex,
        class: 'faAmex'
    },
    Discover: {
        name: 'Discover',
        icon: IconEmpty,
        class: 'faDiscover'
    },
    DinersClub: {
        name: 'Diners Club',
        icon: IconEmpty,
        class: 'faDinersClub'
    },
    JCB: {
        name: 'JCB',
        icon: IconEmpty,
        class: 'faJCB'
    },
    NotFound: {
        name: 'Not Found',
        icon: IconEmpty,
        class: 'faNotFound'
    }
}

export const getCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    const firstFourDigits = cardNumber.substring(0, 4);

    if (firstDigit === '4') {
        return FinancialInstitution.Visa.name;
    } else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
        return FinancialInstitution.Mastercard.name;
    } else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
        return FinancialInstitution.AmericanExpress.name;
    } else if (firstFourDigits === '6011' || (firstFourDigits >= '644' && firstFourDigits <= '649') || firstFourDigits === '65') {
        return FinancialInstitution.Discover.name;
    } else if ((firstDigit === '3' && (firstTwoDigits >= '30' && firstTwoDigits <= '35')) || firstTwoDigits === '36' || firstTwoDigits === '38') {
        return FinancialInstitution.DinersClub.name;
    } else if ((firstFourDigits >= '2131' && firstFourDigits <= '2132') || firstFourDigits === '1800' || (firstFourDigits >= '3528' && firstFourDigits <= '3589')) {
        return FinancialInstitution.JCB.name;
    } else {
        return FinancialInstitution.NotFound.name;
    }
};


