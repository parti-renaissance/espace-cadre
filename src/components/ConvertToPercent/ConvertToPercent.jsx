function ConvertToPercent({ valueToConvert }) {
    return `${Number((valueToConvert * 100).toFixed(2))}%`;
}

export default ConvertToPercent;
