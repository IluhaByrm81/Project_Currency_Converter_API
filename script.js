let allBtnLeft = document.querySelectorAll(".allBtnLeft");
let allBtnRight = document.querySelectorAll(".allBtnRight");

const inputLeft = document.querySelector(".input-1");
const inputRight = document.querySelector(".input-2");

const select = document.querySelectorAll(".rates");
const selectLeft = document.querySelector(".rates-left");
const selectRight = document.querySelector(".rates-right");

const leftParagraf = document.querySelector(".left-p");
const rightParagraf = document.querySelector(".right-p");

const arrows = document.querySelector(".arrows");

let btnLeft = "RUB";
let btnRight = "USD";

let currencyLeft = document.querySelector(".currency-1");
let currencyRight = document.querySelector(".currency-2");

const getRates = async () => {
   const respons = await fetch("https://api.exchangerate.host/symbols");
   const data = await respons.json();
   return Object.keys(data.symbols);
};

const renderPage = () => {
   getRates()
      .then((dataSymbol) => {
      select.forEach((select) => {
         let filteredDataKeysRates = dataSymbol.filter((elem) => {
            return (
            elem !== "RUB" && elem !== "USD" && elem !== "EUR" && elem !== "GBP"
            );
         });

         for (let i = 0; i < filteredDataKeysRates.length; i++) {
            let option = document.createElement("option");
            option.classList.add("list-currencies");
            option.value = filteredDataKeysRates[i];
            option.innerText = filteredDataKeysRates[i];

            select.append(option);
         }
      });
      })
      .catch((error) => {
      alert("Ошибка, что-то пошло не так !!!!", error);
      });
};

const getCurrencyBaseRates = async (sourceCurrency, targetCurrency) => {
   const respons = await fetch(
      `https://api.exchangerate.host/latest?base=${sourceCurrency}&symbols=${targetCurrency}`
   );
   const data = await respons.json();

   const responsReverse = await fetch(
      `https://api.exchangerate.host/latest?base=${targetCurrency}&symbols=${sourceCurrency}`
   );
   const dataReverse = await responsReverse.json();

   return [data.rates[targetCurrency], dataReverse.rates[sourceCurrency]];
};

let cursCurrencyOne = [];
let cursCurrencyTwo = [];

const multiplayer = () => {
   getActivButton();

   getCurrencyBaseRates(btnLeft, btnRight)
      .then((rateCurrency) => {
         cursCurrencyOne.push(rateCurrency[0], rateCurrency[1]);
         cursCurrencyTwo.push(rateCurrency[1], rateCurrency[0]);
         inputRight.value = rateCurrency[0].toFixed(4) * inputLeft.value;

         leftParagraf.innerHTML = `1 ${btnLeft} = ${rateCurrency[0]} ${btnRight}`;
         rightParagraf.innerHTML = `1 ${btnRight} = ${rateCurrency[1]} ${btnLeft}`;
         hiddenDownload();
      })
      .catch((error) => {
         alert("Ошибка, что-то пошло не так !!!!", error);
   });
};

let setTime = null;

const waitingForDownload = () => {
   setTime = setTimeout(() => {
      document.querySelector(".expectation").classList.remove("louder");
      setTime = null;
   }, 500);
};

const hiddenDownload = () => {
   if (setTime !== null) {
      clearTimeout(setTime);
      setTime = null;
   }
   document.querySelector(".expectation").classList.add("louder");
};

const changeCurrencyValuesRight = () => {
   const changeValues = inputLeft.value;
   inputRight.value = cursCurrencyOne[0] * changeValues;
};

const changeCurrencyValuesLeft = () => {
   const changeValues = inputRight.value;
   inputLeft.value = cursCurrencyTwo[1] * changeValues;
};

inputLeft.addEventListener("keyup", changeCurrencyValuesRight);
inputRight.addEventListener("keyup", changeCurrencyValuesLeft);

const getActivButton = () => {
   waitingForDownload();
      const buttonActivLeft = document.querySelector(`#left-btn-${btnLeft}`);
      const buttonActivRight = document.querySelector(`#right-btn-${btnRight}`);

      const deleteClassOpenLeft = document.querySelector(".form-1 .open");
      if (deleteClassOpenLeft) {
         deleteClassOpenLeft.classList.remove("open");
      }

      if (buttonActivLeft) {
         buttonActivLeft.classList.add("open");
      } else {
         selectLeft.classList.add("open");
      }

      const deleteClassOpenRight = document.querySelector(".form-2 .open");
      if (deleteClassOpenRight) {
         deleteClassOpenRight.classList.remove("open");
      }

      if (buttonActivRight) {
         buttonActivRight.classList.add("open");
      } else {
         selectRight.classList.add("open");
      }
};

allBtnLeft.forEach((elem) => {
   elem.addEventListener("click", () => {
      btnLeft = elem.innerText;
      multiplayer();
   });
});

allBtnRight.forEach((elem) => {
   elem.addEventListener("click", () => {
      btnRight = elem.innerText;
      multiplayer();
   });
});

selectLeft.addEventListener("change", (event) => {
   btnLeft = event.target.value;
   console.log(btnLeft);
   multiplayer();
});

selectRight.addEventListener("change", (event) => {
   btnRight = event.target.value;
   console.log(btnRight);
   multiplayer();
});

arrows.addEventListener("click", () => {
   let reserv = btnLeft;
   btnLeft = btnRight;
   btnRight = reserv;
   multiplayer();
});

renderPage();
multiplayer();
