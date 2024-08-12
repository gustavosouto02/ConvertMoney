const convertButton = document.querySelector(".convertButton");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const currencyName = document.getElementById("currency-name");
const currencyImg = document.getElementById("currency-img");
const currencyNameConvert = document.getElementById("currency-name-convert");
const currencyImgConvert = document.getElementById("currency-img-convert");
const currencyValue = document.querySelector(".currencyValue"); // Valor da moeda de origem
const currencyValueConvert = document.querySelector(".currencyValueConvert"); // Valor da moeda de destino
const inputCurrencyValue = document.querySelector(".inputCurrency");

// Correção das taxas de conversão
const rates = {
    BRL: { USD: 0.19, EUR: 0.16, GBP: 0.14 },
    USD: { BRL: 5.2, EUR: 1.1, GBP: 0.75 },
    EUR: { BRL: 6.2, USD: 1.1, GBP: 0.85 },
    GBP: { BRL: 7.2, USD: 1.33, EUR: 1.18 }
};

function convertValues() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const inputValue = parseFloat(inputCurrencyValue.value.replace(/[^\d,]/g, '').replace(',', '.'));

    if (isNaN(inputValue)) {
        currencyValue.innerHTML = "Valor inválido";
        currencyValueConvert.innerHTML = "Valor inválido";
        return;
    }

    let convertedValue;
    if (fromCurrency === toCurrency) {
        convertedValue = inputValue;
    } else {
        // Corrige a lógica de conversão para usar a taxa correta
        convertedValue = inputValue * rates[fromCurrency][toCurrency];
    }

    // Atualiza o valor da moeda de origem
    currencyValue.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: fromCurrency
    }).format(inputValue);

    // Atualiza o valor convertido na moeda de destino
    currencyValueConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: toCurrency
    }).format(convertedValue);

    // Atualiza as informações da moeda de origem
    updateCurrencyInfo(fromCurrency, currencyName, currencyImg);

    // Atualiza as informações da moeda de destino
    updateCurrencyInfo(toCurrency, currencyNameConvert, currencyImgConvert);
}

function updateCurrencyInfo(currency, nameElement, imgElement) {
    const currencyInfo = {
        USD: { name: "Dólar", img: "./assets/usa.png" },
        EUR: { name: "Euro", img: "./assets/euro.png" },
        GBP: { name: "Libra", img: "./assets/libra.png" },
        BRL: { name: "Real", img: "./assets/br.png" }
    };

    if (currencyInfo[currency]) {
        nameElement.innerHTML = currencyInfo[currency].name;
        imgElement.src = currencyInfo[currency].img;
    } else {
        console.error("Informações de moeda não encontradas para:", currency);
    }
}

// Adiciona o evento para o botão de conversão
convertButton.addEventListener("click", convertValues);

// Adiciona o evento para as mudanças nos selects de moeda
fromCurrencySelect.addEventListener("change", convertValues);
toCurrencySelect.addEventListener("change", convertValues);

// Adiciona o evento para a tecla Enter no campo de valor
inputCurrencyValue.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        convertValues();
    }
});
