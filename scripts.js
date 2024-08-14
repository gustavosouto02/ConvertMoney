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

//api KEY
const apiKey = "e6c700cd59fd861fac3d7a42";
const apiUrl = "https://v6.exchangerate-api.com/v6/e6c700cd59fd861fac3d7a42/latest/";


// função para pegar as taxas atualizadas
async function fetchRates(baseCurrency) {
    try{
        const response = await fetch(`${apiUrl}${baseCurrency}`);
        const data = await response.json();
        if(data.result === "success"){
            return data.conversion_rates;
        }else{
            throw new Error("Erro ao obter as taxas de câmbio.");
        }
    }catch (error){
        console.error("Erro ao buscar as taxas de câmbio.");
        return null;
    }
}
async function convertValues() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const inputValue = parseFloat(inputCurrencyValue.value.replace(/[^\d,]/g, '').replace(',', '.'));

    if (isNaN(inputValue)) {
        currencyValue.innerHTML = "Valor inválido";
        currencyValueConvert.innerHTML = "Valor inválido";
        return;
    }

    const rates = await fetchRates(fromCurrency);
    if(!rates){
        currencyValueConvert.innerHTML = "Erro ao obter taxas.";
        return;
    }

    let convertedValue;
    if(fromCurrency === toCurrency){
        convertedValue = inputValue;
    }else {
        convertedValue = inputValue * rates[toCurrency];
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
