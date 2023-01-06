(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function formQuantity() {
        document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
                } else {
                    --value;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                    } else if (value < 1) value = 0;
                }
                targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    var allSumm = 0;
    var allSummValue = document.getElementById("allSumm");
    var cashSumm = 0;
    var cashSummValue = document.getElementById("cashSumm");
    var cardSumm = 0;
    var cardSummValue = document.getElementById("cardSumm");
    var beforeMoneyValue = 0;
    var espressoPrice = 19;
    var americanoPrice = 19;
    var dopioPrice = 33;
    var kapucinoSPrice = 30;
    var kapucinoMPrice = 37;
    var kapucinoLPrice = 43;
    var latteSPrice = 30;
    var latteMPrice = 37;
    var latteLPrice = 43;
    var rafSPrice = 43;
    var rafMPrice = 50;
    var fletWhiteSPrice = 35;
    var fletWhiteMPrice = 43;
    var espressoCount = Number();
    var americanoCount = Number();
    var dopioCount = Number();
    var kapucinoSCount = Number();
    var kapucinoMCount = Number();
    var kapucinoLCount = Number();
    var latteSCount = Number();
    var latteMCount = Number();
    var latteLCount = Number();
    var rafSCount = Number();
    var rafMCount = Number();
    var fletWhiteSCount = Number();
    var fletWhiteMCount = Number();
    var chek = document.getElementById("chekWindow");
    var chekSumm = Number();
    var espressoSumm = Number();
    var americanoSumm = Number();
    var dopioSumm = Number();
    var kapucinoSSumm = Number();
    var kapucinoMSumm = Number();
    var kapucinoLSumm = Number();
    var latteSSumm = Number();
    var latteMSumm = Number();
    var latteLSumm = Number();
    var rafSSumm = Number();
    var rafMSumm = Number();
    var fletWhiteSSumm = Number();
    var fletWhiteMSumm = Number();
    var reportEspressoValue = document.getElementById("reportEspresso");
    var reportEspresso = 0;
    var reportAmericanoValue = document.getElementById("reportAmericano");
    var reportAmericano = 0;
    var reportDopioValue = document.getElementById("reportDopio");
    var reportDopio = 0;
    var reportKapucinoSValue = document.getElementById("reportKapucinoS");
    var reportKapucinoS = 0;
    var reportKapucinoMValue = document.getElementById("reportKapucinoM");
    var reportKapucinoM = 0;
    var reportKapucinoLValue = document.getElementById("reportKapucinoL");
    var reportKapucinoL = 0;
    var reportLatteSValue = document.getElementById("reportLatteS");
    var reportLatteS = 0;
    var reportLatteMValue = document.getElementById("reportLatteM");
    var reportLatteM = 0;
    var reportLatteLValue = document.getElementById("reportLatteL");
    var reportLatteL = 0;
    var reportRafSValue = document.getElementById("reportRafS");
    var reportRafS = 0;
    var reportRafMValue = document.getElementById("reportRafM");
    var reportRafM = 0;
    var reportFletWhiteSValue = document.getElementById("reportFletWhiteS");
    var reportFletWhiteS = 0;
    var reportFletWhiteMValue = document.getElementById("reportFletWhiteM");
    var reportFletWhiteM = 0;
    const sell = document.getElementById("sell");
    const confirmCash = document.getElementById("confirmCash");
    const confirmCard = document.getElementById("confirmCard");
    const beforeMoneyButton = document.getElementById("beforeMoneyButton");
    const espressoButton = document.getElementById("espressoButton");
    const americanoButton = document.getElementById("americanoButton");
    const dopioButton = document.getElementById("dopioButton");
    const kapucinoSButton = document.getElementById("kapucinoSButton");
    const kapucinoMButton = document.getElementById("kapucinoMButton");
    const kapucinoLButton = document.getElementById("kapucinoLButton");
    const latteSButton = document.getElementById("latteSButton");
    const latteMButton = document.getElementById("latteMButton");
    const latteLButton = document.getElementById("latteLButton");
    const rafSButton = document.getElementById("rafSButton");
    const rafMButton = document.getElementById("rafMButton");
    const fletWhiteSButton = document.getElementById("fletWhiteSButton");
    const fletWhiteMButton = document.getElementById("fletWhiteMButton");
    function chekCalc() {
        chekSumm = 0;
        chekSumm = espressoSumm + americanoSumm + dopioSumm + kapucinoSSumm + kapucinoMSumm + kapucinoLSumm + latteSSumm + latteMSumm + latteLSumm + rafSSumm + rafMSumm + fletWhiteSSumm + fletWhiteMSumm;
        chek.value = chekSumm;
        console.log(chekSumm);
    }
    function espresso() {
        espressoCount = document.getElementById("espresso").value;
        espressoSumm = espressoCount * espressoPrice;
        chekCalc();
    }
    espressoButton.addEventListener("click", espresso);
    function americano() {
        americanoCount = document.getElementById("americano").value;
        americanoSumm = americanoCount * americanoPrice;
        chekCalc();
    }
    americanoButton.addEventListener("click", americano);
    function dopio() {
        dopioCount = document.getElementById("dopio").value;
        dopioSumm = dopioCount * dopioPrice;
        chekCalc();
    }
    dopioButton.addEventListener("click", dopio);
    function kapucinoS() {
        kapucinoSCount = document.getElementById("kapucinoS").value;
        kapucinoSSumm = kapucinoSCount * kapucinoSPrice;
        chekCalc();
    }
    kapucinoSButton.addEventListener("click", kapucinoS);
    function kapucinoM() {
        kapucinoMCount = document.getElementById("kapucinoM").value;
        kapucinoMSumm = kapucinoMCount * kapucinoMPrice;
        chekCalc();
    }
    kapucinoMButton.addEventListener("click", kapucinoM);
    function kapucinoL() {
        kapucinoLCount = document.getElementById("kapucinoL").value;
        kapucinoLSumm = kapucinoLCount * kapucinoLPrice;
        chekCalc();
    }
    kapucinoLButton.addEventListener("click", kapucinoL);
    function latteS() {
        latteSCount = document.getElementById("latteS").value;
        latteSSumm = latteSCount * latteSPrice;
        chekCalc();
    }
    latteSButton.addEventListener("click", latteS);
    function latteM() {
        latteMCount = document.getElementById("latteM").value;
        latteMSumm = latteMCount * latteMPrice;
        chekCalc();
    }
    latteMButton.addEventListener("click", latteM);
    function latteL() {
        latteLCount = document.getElementById("latteL").value;
        latteLSumm = latteLCount * latteLPrice;
        chekCalc();
    }
    latteLButton.addEventListener("click", latteL);
    function rafS() {
        rafSCount = document.getElementById("rafS").value;
        rafSSumm = rafSCount * rafSPrice;
        chekCalc();
    }
    rafSButton.addEventListener("click", rafS);
    function rafM() {
        rafMCount = document.getElementById("rafM").value;
        rafMSumm = rafMCount * rafMPrice;
        chekCalc();
    }
    rafMButton.addEventListener("click", rafM);
    function fletWhiteS() {
        fletWhiteSCount = document.getElementById("fletWhiteS").value;
        fletWhiteSSumm = fletWhiteSCount * fletWhiteSPrice;
        chekCalc();
    }
    fletWhiteSButton.addEventListener("click", fletWhiteS);
    function fletWhiteM() {
        fletWhiteMCount = document.getElementById("fletWhiteM").value;
        fletWhiteMSumm = fletWhiteMCount * fletWhiteMPrice;
        chekCalc();
    }
    fletWhiteMButton.addEventListener("click", fletWhiteM);
    function sellFoo() {
        chekSumm -= chekSumm / 100 * 20;
        chek.value = chekSumm;
    }
    sell.addEventListener("click", sellFoo);
    function report() {
        allSumm += chekSumm;
        allSummValue.value = allSumm;
        clearAll();
    }
    function reportCash() {
        reportSaveCount();
        cashSumm += chekSumm;
        cashSummValue.value = cashSumm;
        report();
    }
    function reportCard() {
        reportSaveCount();
        cardSumm += chekSumm;
        cardSummValue.value = cardSumm;
        clearAll();
    }
    confirmCash.addEventListener("click", reportCash);
    confirmCard.addEventListener("click", reportCard);
    function clearAll() {
        americanoSumm = americanoCount = document.getElementById("americano").value = 0;
        espressoSumm = espressoCount = document.getElementById("espresso").value = 0;
        dopioSumm = dopioCount = document.getElementById("dopio").value = 0;
        kapucinoSSumm = kapucinoSCount = document.getElementById("kapucinoS").value = 0;
        kapucinoMSumm = kapucinoMCount = document.getElementById("kapucinoM").value = 0;
        kapucinoLSumm = kapucinoLCount = document.getElementById("kapucinoL").value = 0;
        latteSSumm = latteSCount = document.getElementById("latteS").value = 0;
        latteMSumm = latteMCount = document.getElementById("latteM").value = 0;
        latteLSumm = latteLCount = document.getElementById("latteL").value = 0;
        rafSSumm = rafSCount = document.getElementById("rafS").value = 0;
        rafMSumm = rafMCount = document.getElementById("rafM").value = 0;
        fletWhiteSSumm = fletWhiteSCount = document.getElementById("fletWhiteS").value = 0;
        fletWhiteMSumm = fletWhiteMCount = document.getElementById("fletWhiteM").value = 0;
        chek.value = chekSumm = 0;
        document.getElementById("beforeMoney").value = "";
    }
    function beforeMoneyFoo() {
        beforeMoneyValue = document.getElementById("beforeMoney").value;
        allSumm = +beforeMoneyValue;
        report();
    }
    beforeMoneyButton.addEventListener("click", beforeMoneyFoo);
    function reportSaveCount() {
        reportEspresso += +espressoCount;
        reportEspressoValue.value = reportEspresso;
        reportAmericano += +americanoCount;
        reportAmericanoValue.value = reportAmericano;
        reportDopio += +dopioCount;
        reportDopioValue.value = reportDopio;
        reportKapucinoS += +kapucinoSCount;
        reportKapucinoSValue.value = reportKapucinoS;
        reportKapucinoM += +kapucinoMCount;
        reportKapucinoMValue.value = reportKapucinoM;
        reportKapucinoL += +kapucinoLCount;
        reportKapucinoLValue.value = reportKapucinoL;
        reportLatteS += +latteSCount;
        reportLatteSValue.value = reportLatteS;
        reportLatteM += +latteMCount;
        reportLatteMValue.value = reportLatteM;
        reportLatteL += +latteLCount;
        reportLatteLValue.value = reportLatteL;
        reportRafS += +rafSCount;
        reportRafSValue.value = reportRafS;
        reportRafM += +rafMCount;
        reportRafMValue.value = reportRafM;
        reportFletWhiteS += +fletWhiteSCount;
        reportFletWhiteSValue.value = reportFletWhiteS;
        reportFletWhiteM += +fletWhiteMCount;
        reportFletWhiteMValue.value = reportFletWhiteM;
    }
    window["FLS"] = true;
    isWebp();
    formQuantity();
})();